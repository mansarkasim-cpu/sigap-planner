import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

class ApiClient {
  final String baseUrl;
  final String? token;

  ApiClient({required this.baseUrl, this.token});

  Map<String, String> _headers() {
    final h = <String, String>{'Content-Type': 'application/json'};
    if (token != null && token!.isNotEmpty) h['Authorization'] = 'Bearer $token';
    return h;
  }

  Future<dynamic> get(String path) async {
    final url = Uri.parse(baseUrl + path);
    final headers = _headers();
    debugPrint('ApiClient GET: ${url.toString()}');
    debugPrint('ApiClient Headers: $headers');
    final res = await http.get(url, headers: headers);
    if (res.statusCode >= 200 && res.statusCode < 300)
      return json.decode(res.body);
    throw Exception(
        'GET ${url.toString()} failed: ${res.statusCode} ${res.body}');
  }

  Future<dynamic> post(String path, Map<String, dynamic> body) async {
    final url = Uri.parse(baseUrl + path);
    final headers = _headers();
    debugPrint('ApiClient POST: ${url.toString()}');
    debugPrint('ApiClient Headers: $headers');
    debugPrint('ApiClient Body: ${json.encode(body)}');
    final res = await http.post(url, headers: headers, body: json.encode(body));
    if (res.statusCode >= 200 && res.statusCode < 300)
      return json.decode(res.body);
    throw Exception(
        'POST ${url.toString()} failed: ${res.statusCode} ${res.body}');
  }

  Future<dynamic> patch(String path, Map<String, dynamic> body) async {
    final url = Uri.parse(baseUrl + path);
    final headers = _headers();
    debugPrint('ApiClient PATCH: ${url.toString()}');
    debugPrint('ApiClient Headers: $headers');
    debugPrint('ApiClient Body: ${json.encode(body)}');
    final res = await http.patch(url, headers: headers, body: json.encode(body));
    if (res.statusCode >= 200 && res.statusCode < 300)
      return json.decode(res.body);
    throw Exception(
        'PATCH ${url.toString()} failed: ${res.statusCode} ${res.body}');
  }
}
