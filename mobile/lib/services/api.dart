import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'logout_notifier.dart';

// Local test-only flag: set with `--dart-define=SIMULATE_NETWORK=slow` or `offline`
const String _SIMULATE_NETWORK = String.fromEnvironment('SIMULATE_NETWORK', defaultValue: '');
const bool _SIM_SLOW = _SIMULATE_NETWORK == 'slow';
const bool _SIM_OFFLINE = _SIMULATE_NETWORK == 'offline';

class ApiClient {
  final String baseUrl;
  final String? token;
  static const Duration defaultTimeout = Duration(seconds: 15);

  ApiClient({required this.baseUrl, this.token});

  Map<String, String> _headers() {
    final h = <String, String>{'Content-Type': 'application/json'};
    if (token != null && token!.isNotEmpty) h['Authorization'] = 'Bearer $token';
    return h;
  }

  Future<dynamic> get(String path, {Duration? timeout}) async {
    final url = Uri.parse(baseUrl + path);
    final headers = _headers();
    debugPrint('ApiClient GET: ${url.toString()}');
    debugPrint('ApiClient Headers: $headers');
    // Simulate network conditions when requested (development only)
    if (_SIM_OFFLINE) {
      debugPrint('ApiClient: Simulated OFFLINE for GET ${url.toString()}');
      // small delay before failing to let UI react
      await Future.delayed(const Duration(milliseconds: 200));
      throw Exception('SIMULATED_OFFLINE');
    }
    if (_SIM_SLOW) {
      debugPrint('ApiClient: Simulating slow network for GET ${url.toString()} (delaying)');
      await Future.delayed(const Duration(seconds: 10));
    }
    final res = await http.get(url, headers: headers).timeout(timeout ?? defaultTimeout);
    if (res.statusCode == 401) {
      try {
        final prefs = await SharedPreferences.getInstance();
        await prefs.remove('api_token');
        await prefs.remove('tech_id');
        debugPrint('ApiClient: 401 Unauthorized - cleared api_token and tech_id');
        try {
          LogoutNotifier.instance.notify();
        } catch (e) {}
      } catch (e) {
        debugPrint('ApiClient: failed to clear stored token: $e');
      }
      throw Exception('UNAUTHORIZED: GET ${url.toString()} returned 401');
    }
    if (res.statusCode >= 200 && res.statusCode < 300) return json.decode(res.body);
    throw Exception('GET ${url.toString()} failed: ${res.statusCode} ${res.body}');
  }

  Future<dynamic> post(String path, Map<String, dynamic> body, {Duration? timeout}) async {
    final url = Uri.parse(baseUrl + path);
    final headers = _headers();
    debugPrint('ApiClient POST: ${url.toString()}');
    debugPrint('ApiClient Headers: $headers');
    if (_SIM_OFFLINE) {
      debugPrint('ApiClient: Simulated OFFLINE for POST ${url.toString()}');
      await Future.delayed(const Duration(milliseconds: 200));
      throw Exception('SIMULATED_OFFLINE');
    }
    if (_SIM_SLOW) {
      debugPrint('ApiClient: Simulating slow network for POST ${url.toString()} (delaying)');
      await Future.delayed(const Duration(seconds: 10));
    }
    try {
      // Create a redacted copy of the body for logging to avoid printing large base64 blobs
      final redacted = Map<String, dynamic>.from(body);
      for (final k in ['photoBase64', 'signatureBase64', 'photoBase64s', 'photo']) {
        if (redacted.containsKey(k) && redacted[k] is String) {
          final s = redacted[k] as String;
          redacted[k] = s.length > 200 ? '${s.substring(0, 200)}...<redacted:${s.length}>' : '<redacted:${s.length}>';
        }
      }
      debugPrint('ApiClient Body: ${json.encode(redacted)}');
    } catch (e) {
      debugPrint('ApiClient Body: <failed to encode for debug>');
    }
    final res = await http.post(url, headers: headers, body: json.encode(body)).timeout(timeout ?? defaultTimeout);
    if (res.statusCode == 401) {
      try {
        final prefs = await SharedPreferences.getInstance();
        await prefs.remove('api_token');
        await prefs.remove('tech_id');
        debugPrint('ApiClient: 401 Unauthorized - cleared api_token and tech_id');
        try {
          LogoutNotifier.instance.notify();
        } catch (e) {}
      } catch (e) {
        debugPrint('ApiClient: failed to clear stored token: $e');
      }
      throw Exception('UNAUTHORIZED: POST ${url.toString()} returned 401');
    }
    if (res.statusCode >= 200 && res.statusCode < 300) return json.decode(res.body);
    throw Exception('POST ${url.toString()} failed: ${res.statusCode} ${res.body}');
  }

  Future<dynamic> patch(String path, Map<String, dynamic> body, {Duration? timeout}) async {
    final url = Uri.parse(baseUrl + path);
    final headers = _headers();
    debugPrint('ApiClient PATCH: ${url.toString()}');
    debugPrint('ApiClient Headers: $headers');
    if (_SIM_OFFLINE) {
      debugPrint('ApiClient: Simulated OFFLINE for PATCH ${url.toString()}');
      await Future.delayed(const Duration(milliseconds: 200));
      throw Exception('SIMULATED_OFFLINE');
    }
    if (_SIM_SLOW) {
      debugPrint('ApiClient: Simulating slow network for PATCH ${url.toString()} (delaying)');
      await Future.delayed(const Duration(seconds: 10));
    }
    // debugPrint('ApiClient Body: ${json.encode(body)}');
    final res = await http.patch(url, headers: headers, body: json.encode(body)).timeout(timeout ?? defaultTimeout);
    if (res.statusCode == 401) {
      try {
        final prefs = await SharedPreferences.getInstance();
        await prefs.remove('api_token');
        await prefs.remove('tech_id');
        debugPrint('ApiClient: 401 Unauthorized - cleared api_token and tech_id');
        try {
          LogoutNotifier.instance.notify();
        } catch (e) {}
      } catch (e) {
        debugPrint('ApiClient: failed to clear stored token: $e');
      }
      throw Exception('UNAUTHORIZED: PATCH ${url.toString()} returned 401');
    }
    if (res.statusCode >= 200 && res.statusCode < 300) return json.decode(res.body);
    throw Exception('PATCH ${url.toString()} failed: ${res.statusCode} ${res.body}');
  }

  Future<dynamic> delete(String path, Map<String, dynamic> body, {Duration? timeout}) async {
    final url = Uri.parse(baseUrl + path);
    final headers = _headers();
    debugPrint('ApiClient DELETE: ${url.toString()}');
    debugPrint('ApiClient Headers: $headers');
    if (_SIM_OFFLINE) {
      debugPrint('ApiClient: Simulated OFFLINE for DELETE ${url.toString()}');
      await Future.delayed(const Duration(milliseconds: 200));
      throw Exception('SIMULATED_OFFLINE');
    }
    if (_SIM_SLOW) {
      debugPrint('ApiClient: Simulating slow network for DELETE ${url.toString()} (delaying)');
      await Future.delayed(const Duration(seconds: 10));
    }
    final res = await http.delete(url, headers: headers, body: json.encode(body)).timeout(timeout ?? defaultTimeout);
    if (res.statusCode == 401) {
      try {
        final prefs = await SharedPreferences.getInstance();
        await prefs.remove('api_token');
        await prefs.remove('tech_id');
        debugPrint('ApiClient: 401 Unauthorized - cleared api_token and tech_id');
        try {
          LogoutNotifier.instance.notify();
        } catch (e) {}
      } catch (e) {
        debugPrint('ApiClient: failed to clear stored token: $e');
      }
      throw Exception('UNAUTHORIZED: DELETE ${url.toString()} returned 401');
    }
    if (res.statusCode >= 200 && res.statusCode < 300) return json.decode(res.body);
    throw Exception('DELETE ${url.toString()} failed: ${res.statusCode} ${res.body}');
  }
}
