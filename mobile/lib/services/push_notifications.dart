import 'dart:convert';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
// Foreground system notifications use `flutter_local_notifications`.
// This enables showing notifications when app is in foreground.
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api.dart';
import '../config.dart';

class PushNotifications {
  static final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  static bool _initialized = false;
  static final FlutterLocalNotificationsPlugin _localNotifications = FlutterLocalNotificationsPlugin();
  static const AndroidNotificationChannel _androidChannel = AndroidNotificationChannel(
    'high_alerts',
    'High Priority Alerts',
    description: 'Loud alarm channel for SIGAP notifications',
    importance: Importance.max,
    playSound: true,
  );
  // no local notification plugin here to keep android build simple

  // Call once during app startup
  static Future<void> init() async {
    try {
      debugPrint('PushNotifications.init called');
      if (kIsWeb) return; // Web setup not covered here
      await _requestPermission();
      // Initialize local notifications plugin and create channel on Android
      try {
        const initializationSettingsAndroid = AndroidInitializationSettings('@mipmap/ic_launcher');
        const initializationSettings = InitializationSettings(android: initializationSettingsAndroid);
        await _localNotifications.initialize(initializationSettings);
        // create channel (no-op on iOS)
        await _localNotifications.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()?.createNotificationChannel(_androidChannel);
      } catch (e) {
        debugPrint('Local notifications init failed: $e');
      }

      FirebaseMessaging.onMessage.listen((RemoteMessage message) async {
        debugPrint('FCM foreground message: ${message.notification}');
        final notif = message.notification;
        if (notif != null && !kIsWeb) {
          try {
            final androidDetails = AndroidNotificationDetails(
              _androidChannel.id,
              _androidChannel.name,
              channelDescription: _androidChannel.description,
              importance: Importance.max,
              priority: Priority.high,
              sound: RawResourceAndroidNotificationSound('ship_horn'),
              playSound: true,
            );
            final platformDetails = NotificationDetails(android: androidDetails);
            await _localNotifications.show(notif.hashCode, notif.title, notif.body, platformDetails, payload: jsonEncode(message.data));
          } catch (e) {
            debugPrint('Failed to show local notification: $e');
          }
        }
      });
      // Listen for token refresh and register automatically
      FirebaseMessaging.instance.onTokenRefresh.listen((newToken) {
        debugPrint('FCM onTokenRefresh: $newToken');
        _sendTokenToServer(newToken);
      });
      _initialized = true;
    } catch (e) {
      debugPrint('PushNotifications.init error: $e');
    }
  }

  static Future<void> _requestPermission() async {
    NotificationSettings settings = await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
    debugPrint('FCM permission status: ${settings.authorizationStatus}');
  }

  static Future<String?> getToken() async {
    try {
      final token = await _messaging.getToken();
      debugPrint('FCM token: $token');
      return token;
    } catch (e) {
      debugPrint('getToken error: $e');
      return null;
    }
  }

  // Register token on backend for current authenticated user
  static Future<void> registerAndSendToken() async {
    try {
      debugPrint('=== registerAndSendToken: START ===');
      // If Firebase hasn't been initialized by `main.dart`, don't attempt
      // to initialize here — it causes noisy '[core/no-app]' errors on
      // platforms where Firebase isn't configured (desktop). Let the app
      // initialization flow handle creating the Firebase app.
      if (Firebase.apps.isEmpty) {
        debugPrint('❌ registerAndSendToken: Firebase NOT initialized; skipping device token registration');
        return;
      }
      debugPrint('✓ Firebase is initialized');
      
      final prefs = await SharedPreferences.getInstance();
      final apiToken = prefs.getString('api_token') ?? '';
      final userId = prefs.getString('tech_id') ?? '';
      debugPrint('✓ Retrieved from SharedPreferences - api_token: ${apiToken.isNotEmpty ? '***' : 'EMPTY'}, tech_id: $userId');
      
      if (apiToken.isEmpty) {
        debugPrint('❌ No api token in SharedPreferences; skipping device token register');
        return;
      }
      
      final token = await getToken();
      debugPrint('✓ FCM token retrieved: ${token != null && token.isNotEmpty ? token.substring(0, 20) + '...' : 'NULL/EMPTY'}');
      
      if (token == null || token.isEmpty) {
        debugPrint('❌ FCM token is null or empty');
        return;
      }
      
      await _sendTokenToServer(token);
      debugPrint('=== registerAndSendToken: COMPLETED ===');
    } catch (e) {
      debugPrint('❌ registerAndSendToken error: $e');
      debugPrintStack(label: 'registerAndSendToken stacktrace', maxFrames: 10);
    }
  }

  static Future<void> _sendTokenToServer(String? token) async {
    try {
      if (token == null || token.isEmpty) {
        debugPrint('❌ _sendTokenToServer: token is null or empty');
        return;
      }
      
      final prefs = await SharedPreferences.getInstance();
      final apiToken = prefs.getString('api_token') ?? '';
      if (apiToken.isEmpty) {
        debugPrint('❌ _sendTokenToServer: no api token available');
        return;
      }
      
      final api = ApiClient(baseUrl: API_BASE, token: apiToken);
      debugPrint('✓ ApiClient initialized with API_BASE: $API_BASE');
      
      // Determine platform string for server (safe on web + desktop/mobile)
      String platformStr;
      if (kIsWeb) {
        platformStr = 'web';
      } else {
        switch (defaultTargetPlatform) {
          case TargetPlatform.android:
            platformStr = 'android';
            break;
          case TargetPlatform.iOS:
            platformStr = 'ios';
            break;
          case TargetPlatform.windows:
            platformStr = 'windows';
            break;
          case TargetPlatform.linux:
            platformStr = 'linux';
            break;
          case TargetPlatform.macOS:
            platformStr = 'macos';
            break;
          default:
            platformStr = 'unknown';
        }
      }
      debugPrint('✓ Platform detected: $platformStr');
      
      final body = {'token': token, 'platform': platformStr};
      debugPrint('→ Sending device token to /device-tokens endpoint...');
      debugPrint('  Request body: {token: ${token.substring(0, 20)}..., platform: $platformStr}');
      
      final res = await api.post('/device-tokens', body);
      debugPrint('✓ Device token successfully sent to server');
      debugPrint('  Response: $res');
    } catch (e) {
      debugPrint('❌ _sendTokenToServer error: $e');
      debugPrintStack(label: '_sendTokenToServer stacktrace', maxFrames: 10);
    }
  }
}
