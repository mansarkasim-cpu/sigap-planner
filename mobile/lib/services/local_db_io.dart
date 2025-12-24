import 'dart:async';
import 'dart:io';
import 'dart:typed_data';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

class LocalDB {
  LocalDB._internal();
  static final LocalDB instance = LocalDB._internal();

  Database? _db;

  Future<void> init() async {
    if (_db != null) return;
    // On desktop platforms, initialize sqflite ffi so openDatabase works
    try {
      if (Platform.isWindows || Platform.isLinux || Platform.isMacOS) {
        sqfliteFfiInit();
        databaseFactory = databaseFactoryFfi;
      }
    } catch (_) {}
    final dir = await getApplicationDocumentsDirectory();
    final path = p.join(dir.path, 'sigap_local.db');
    _db = await openDatabase(path, version: 1, onCreate: (db, v) async {
      await db.execute('''
        CREATE TABLE checklist (
          id TEXT PRIMARY KEY,
          assignmentId TEXT,
          taskId TEXT,
          photoPath TEXT,
          checked INTEGER,
          createdAt INTEGER
        )
      ''');
      await db.execute('''
        CREATE TABLE assignment_meta (
          assignmentId TEXT PRIMARY KEY,
          startedAt INTEGER
        )
      ''');
      await db.execute('''
        CREATE TABLE queued_realisasi (
          id TEXT PRIMARY KEY,
          assignmentId TEXT,
          notes TEXT,
          photoPath TEXT,
          startTime INTEGER,
          endTime INTEGER,
          submitted INTEGER,
          createdAt INTEGER
        )
      ''');
    });
  }

  Future<String> _savePhotoToFile(Uint8List bytes, String filename) async {
    final dir = await getApplicationDocumentsDirectory();
    final file = File(p.join(dir.path, filename));
    await file.writeAsBytes(bytes, flush: true);
    return file.path;
  }

  // Public helper to save photo bytes to a file and return the path.
  Future<String> savePhotoFile(Uint8List bytes, {String? filename}) async {
    final fn = filename ?? 'realisasi_${DateTime.now().millisecondsSinceEpoch}.jpg';
    return await _savePhotoToFile(bytes, fn);
  }

  Future<void> saveChecklist({required String assignmentId, required String taskId, required Uint8List photoBytes, bool checked = true}) async {
    await init();
    final id = '${assignmentId}_$taskId';
    final filename = 'realisasi_${assignmentId}_${taskId}_${DateTime.now().millisecondsSinceEpoch}.jpg';
    final path = await _savePhotoToFile(photoBytes, filename);
    final now = DateTime.now().millisecondsSinceEpoch;
    await _db!.insert('checklist', {
      'id': id,
      'assignmentId': assignmentId,
      'taskId': taskId,
      'photoPath': path,
      'checked': checked ? 1 : 0,
      'createdAt': now
    }, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<void> removeChecklist({required String assignmentId, required String taskId}) async {
    await init();
    final id = '${assignmentId}_$taskId';
    // delete photo file if present
    final rec = (await _db!.query('checklist', where: 'id = ?', whereArgs: [id]));
    if (rec.isNotEmpty) {
      final pth = rec.first['photoPath'] as String?;
      if (pth != null && pth.isNotEmpty) {
        try { final f = File(pth); if (await f.exists()) await f.delete(); } catch (_) {}
      }
    }
    await _db!.delete('checklist', where: 'id = ?', whereArgs: [id]);
  }

  Future<List<Map<String, dynamic>>> getChecklistForAssignment(String assignmentId) async {
    await init();
    final rows = await _db!.query('checklist', where: 'assignmentId = ?', whereArgs: [assignmentId]);
    // attach photo bytes to each row for convenience
    final List<Map<String, dynamic>> out = [];
    for (final r in rows) {
      final Map<String, dynamic> m = Map<String, dynamic>.from(r);
      final pth = r['photoPath'] as String?;
      if (pth != null && pth.isNotEmpty) {
        try {
          final f = File(pth);
          if (await f.exists()) {
            final bytes = await f.readAsBytes();
            m['photoBytes'] = bytes;
          }
        } catch (_) {}
      }
      out.add(m);
    }
    return out;
  }

  Future<void> queueRealisasiUpload({required String id, required String assignmentId, String? notes, String? photoPath}) async {
    await init();
    final now = DateTime.now().millisecondsSinceEpoch;
    await _db!.insert('queued_realisasi', {
      'id': id,
      'assignmentId': assignmentId,
      'notes': notes,
      'photoPath': photoPath,
      'startTime': null,
      'endTime': null,
      'submitted': 0,
      'createdAt': now
    }, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<List<Map<String, dynamic>>> getQueuedRealisasi() async {
    await init();
    return await _db!.query('queued_realisasi', where: 'submitted = ?', whereArgs: [0]);
  }

  Future<void> setAssignmentStart(String assignmentId, DateTime startedAt) async {
    await init();
    await _db!.insert('assignment_meta', {'assignmentId': assignmentId, 'startedAt': startedAt.millisecondsSinceEpoch}, conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<DateTime?> getAssignmentStart(String assignmentId) async {
    await init();
    final rows = await _db!.query('assignment_meta', where: 'assignmentId = ?', whereArgs: [assignmentId]);
    if (rows.isEmpty) return null;
    final v = rows.first['startedAt'] as int?;
    if (v == null) return null;
    return DateTime.fromMillisecondsSinceEpoch(v);
  }

  Future<void> markRealisasiSubmitted(String id) async {
    await init();
    await _db!.update('queued_realisasi', {'submitted': 1}, where: 'id = ?', whereArgs: [id]);
  }
}
