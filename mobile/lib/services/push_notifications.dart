import 'dart:convert';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
// Note: foreground system notifications require `flutter_local_notifications`.
// That plugin may require Android Gradle Plugin upgrades; keep this file
// free of native notification code so the project can build across setups.
import 'package:shared_preferences/shared_preferences.dart';
import 'api.dart';
import '../config.dart';

class PushNotifications {
  static final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  static bool _initialized = false;
  // no local notification plugin here to keep android build simple

  // Call once during app startup
  static Future<void> init() async {
    try {
      debugPrint('PushNotifications.init called');
      if (kIsWeb) return; // Web setup not covered here
      await _requestPermission();
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        // For foreground messages, just log. Rely on system notifications (server should include channel_id and sound)
        debugPrint('FCM foreground message: ${message.notification}');
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
      debugPrint('registerAndSendToken: start');
      // If Firebase hasn't been initialized by `main.dart`, don't attempt
      // to initialize here — it causes noisy '[core/no-app]' errors on
      // platforms where Firebase isn't configured (desktop). Let the app
      // initialization flow handle creating the Firebase app.
      if (Firebase.apps.isEmpty) {
        debugPrint('registerAndSendToken: Firebase not initialized; skipping device token registration');
        return;
      }
      final prefs = await SharedPreferences.getInstance();
      final apiToken = prefs.getString('api_token') ?? '';
      debugPrint('registerAndSendToken: api_token present=${apiToken.isNotEmpty}');
      if (apiToken.isEmpty) {
        debugPrint('No api token; skipping device token register');
        return;
      }
      final token = await getToken();
      debugPrint('registerAndSendToken: token received=$token');
      if (token == null || token.isEmpty) return;
      await _sendTokenToServer(token);
    } catch (e) {
      debugPrint('registerAndSendToken error: $e');
    }
  }

  static Future<void> _sendTokenToServer(String? token) async {
    try {
      if (token == null || token.isEmpty) return;
      final prefs = await SharedPreferences.getInstance();
      final apiToken = prefs.getString('api_token') ?? '';
      if (apiToken.isEmpty) {
        debugPrint('_sendTokenToServer: no api token available');
        return;
      }
      final api = ApiClient(baseUrl: API_BASE, token: apiToken);
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
      final body = {'token': token, 'platform': platformStr};
      final res = await api.post('/device-tokens', body);
      debugPrint('Device token sent to server, response: $res');
    } catch (e) {
      debugPrint('_sendTokenToServer error: $e');
    }
  }
}
