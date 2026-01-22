import 'dart:typed_data';

// Stub implementation used on web; stores data in-memory only.
class LocalDB {
  LocalDB._internal();
  static final LocalDB instance = LocalDB._internal();

  final List<Map<String, dynamic>> _checklists = [];
  final List<Map<String, dynamic>> _queued = [];

  Future<void> init() async {}

  Future<void> saveChecklist({required String assignmentId, required String taskId, required Uint8List photoBytes, bool checked = true}) async {
    final id = '${assignmentId}_${taskId}_${DateTime.now().millisecondsSinceEpoch}';
    _checklists.add({
      'id': id,
      'assignmentId': assignmentId,
      'taskId': taskId,
      'photoPath': null,
      'photoBytes': photoBytes,
      'checked': checked ? 1 : 0,
      'createdAt': DateTime.now().millisecondsSinceEpoch,
    });
  }

  Future<void> removeChecklist({required String assignmentId, required String taskId}) async {
    _checklists.removeWhere((r) => r['assignmentId'] == assignmentId && r['taskId'] == taskId);
  }

  Future<List<Map<String, dynamic>>> getChecklistForAssignment(String assignmentId) async {
    return _checklists.where((r) => r['assignmentId'] == assignmentId).toList();
  }

  Future<void> queueRealisasiUpload({required String id, required String assignmentId, String? taskId, String? notes, String? photoPath}) async {
    _queued.removeWhere((r) => r['id'] == id);
    _queued.add({
      'id': id,
      'assignmentId': assignmentId,
      'taskId': taskId,
      'notes': notes,
      'photoPath': photoPath,
      'startTime': null,
      'endTime': null,
      'submitted': 0,
      'createdAt': DateTime.now().millisecondsSinceEpoch
    });
  }

  Future<List<Map<String, dynamic>>> getQueuedRealisasi() async => _queued.where((r) => r['submitted'] == 0).toList();

  Future<void> markRealisasiSubmitted(String id) async {
    final idx = _queued.indexWhere((r) => r['id'] == id);
    if (idx >= 0) _queued[idx]['submitted'] = 1;
  }

  Future<void> setAssignmentStart(String assignmentId, DateTime startedAt) async {
    // store as a simple map in _checklists for stub convenience
    _checklists.removeWhere((r) => r['assignmentId'] == assignmentId && r['taskId'] == '__assignment_meta__');
    _checklists.add({'id': '${assignmentId}__meta', 'assignmentId': assignmentId, 'taskId': '__assignment_meta__', 'photoPath': null, 'photoBytes': null, 'checked': 0, 'createdAt': DateTime.now().millisecondsSinceEpoch, 'startedAt': startedAt.millisecondsSinceEpoch});
  }

  Future<DateTime?> getAssignmentStart(String assignmentId) async {
    final found = _checklists.firstWhere((r) => r['assignmentId'] == assignmentId && r['taskId'] == '__assignment_meta__', orElse: () => <String,dynamic>{});
    if (found.isEmpty) return null;
    final v = found['startedAt'] as int?;
    if (v == null) return null;
    return DateTime.fromMillisecondsSinceEpoch(v);
  }
}
