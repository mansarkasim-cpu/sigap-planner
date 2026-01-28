import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/foundation.dart';
import 'local_db.dart';
import 'api.dart';
import '../config.dart';

class RetryUploader {
  RetryUploader._internal();
  static final RetryUploader instance = RetryUploader._internal();

  Timer? _timer;
  bool _running = false;
  String? baseUrl;

  void start({String? base}) {
    baseUrl = base ?? API_BASE;
    _timer?.cancel();
    // run immediately then periodic
    _runOnce();
    _timer = Timer.periodic(const Duration(seconds: 60), (_) => _runOnce());
  }

  void stop() {
    _timer?.cancel();
    _timer = null;
  }

  Future<void> _runOnce() async {
    if (_running) return;
    _running = true;
    try {
      await LocalDB.instance.init();
      final rows = await LocalDB.instance.getQueuedRealisasi();
      if (rows.isEmpty) return;

      // get token from shared prefs each run
      final p = await SharedPreferences.getInstance();
      final token = p.getString('api_token') ?? '';
      final api = ApiClient(baseUrl: baseUrl ?? API_BASE, token: token);

      for (final r in rows) {
        try {
          final id = (r['id'] ?? '').toString();
          final assignmentId = (r['assignmentId'] ?? '').toString();
          String taskId = (r['taskId'] ?? '').toString();
          final notes = (r['notes'] ?? '').toString();
          final photoPath = (r['photoPath'] ?? '').toString();
          Uint8List? bytes;
          if (photoPath.isNotEmpty) {
            final f = File(photoPath);
            if (await f.exists()) {
              bytes = await f.readAsBytes();
            }
          }
          // If queued row didn't store taskId, try to resolve via assignments API.
          if (taskId.isEmpty) {
            try {
              final asRes = await api.get('/assignments');
              final alist = (asRes is List)
                  ? asRes
                  : (asRes is Map && asRes['data'] != null
                      ? asRes['data']
                      : asRes);
              if (alist is List) {
                final found = alist.firstWhere(
                    (a) => ((a['id'] ?? '')?.toString() ?? '') == assignmentId,
                    orElse: () => null);
                if (found != null)
                  taskId =
                      (found['task_id'] ?? found['task'] ?? '')?.toString() ??
                          '';
              }
            } catch (_) {}
          }

          // If we couldn't resolve a taskId, skip sending and leave item in queue
          if (taskId.isEmpty) {
            debugPrint('RetryUploader: skipping queued item $id — taskId unresolved');
            continue;
          }
          final body = {
            'assignmentId': assignmentId,
            'taskId': taskId,
            'notes': notes.isNotEmpty ? notes : null,
            'photoBase64': bytes != null ? base64Encode(bytes) : null,
            'startTime': null,
            'endTime': null,
          };
          await api.post('/realisasi/submit', body);
          await LocalDB.instance.markRealisasiSubmitted(id);
          // delete photo file after success
          if (photoPath.isNotEmpty) {
            try {
              final f = File(photoPath);
              if (await f.exists()) await f.delete();
            } catch (_) {}
          }
        } catch (e) {
          // leave in queue and continue
          // debugPrint('retry upload failed for item: $e');
        }
      }
    } catch (e) {
      // debugPrint('retry uploader error: $e');
    } finally {
      _running = false;
    }
  }
}
