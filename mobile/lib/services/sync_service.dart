import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import '../utils/image_compress.dart';
import 'package:http/http.dart' as http;

class SyncService {
  final String baseUrl;
  SyncService({required this.baseUrl});

  Future<void> uploadRealisasi(
      {required String assignmentId,
      String? notes,
      File? photo,
      File? signature}) async {
    String? photoBase64;
    String? signatureBase64;
    if (photo != null) {
      final bytes = await photo.readAsBytes();
      final compressed = await compressImageBytes(bytes);
      photoBase64 = base64Encode(compressed);
    }
    if (signature != null) {
      final bytes = await signature.readAsBytes();
      final compressed = await compressImageBytes(bytes);
      signatureBase64 = base64Encode(compressed);
    }

    final body = {
      "assignmentId": assignmentId,
      "notes": notes,
      "photoBase64": photoBase64,
      "signatureBase64": signatureBase64
    };

    final res = await http.post(Uri.parse('$baseUrl/api/realisasi'),
        body: jsonEncode(body), headers: {'Content-Type': 'application/json'});
    if (res.statusCode >= 200 && res.statusCode < 300) {
      // success
    } else {
      // queue for retry (offline)
      throw Exception('Failed to upload');
    }
  }
}
