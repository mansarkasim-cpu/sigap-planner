import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'screens/login.dart';
import 'services/push_notifications.dart';

// Background message handler must be a top-level function
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // Ensure Firebase is initialized in the background isolate (best-effort)
  try {
    await Firebase.initializeApp();
  } catch (e) {
    debugPrint('Background Firebase init failed: $e');
    return;
  }
  // handle background message if needed
  debugPrint('FCM background message: ${message.messageId}');
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase (catch errors so app doesn't crash when not configured)
  var firebaseReady = false;
  try {
    await Firebase.initializeApp();
    firebaseReady = true;
  } catch (e) {
    debugPrint('Firebase initialization failed: $e');
    debugPrint('To fix: install Firebase CLI, run `firebase login`, then run `flutterfire configure` from mobile/ to generate firebase_options.dart.');
  }

  if (firebaseReady) {
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
    await PushNotifications.init();
  } else {
    debugPrint('Skipping Firebase Messaging init because Firebase was not initialized.');
  }
  runApp(const SigapApp());
}

class SigapApp extends StatelessWidget {
  const SigapApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SIGAP Mobile',
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF4A148C),
        appBarTheme: const AppBarTheme(
          centerTitle: true,
          elevation: 2,
          backgroundColor: Color(0xFF4A148C),
          foregroundColor: Colors.white,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            minimumSize: const Size.fromHeight(48),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
        ),
      ),
      home: const LoginScreen(),
    );
  }
}
