import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';
import '../services/local_db.dart';
import 'dart:convert';
import '../services/api.dart';
import '../widgets/app_drawer.dart';
import '../utils/date_utils.dart';
import '../utils/image_compress.dart';

class WODetailScreen extends StatefulWidget {
  final String woId;
  final String assignmentId;
  final String baseUrl;
  final String token;
  const WODetailScreen(
      {required this.woId,
      required this.assignmentId,
      required this.baseUrl,
      required this.token,
      super.key});

  @override
  State<WODetailScreen> createState() => _WODetailScreenState();
}

class _WODetailScreenState extends State<WODetailScreen>
    with SingleTickerProviderStateMixin {
  Map<String, dynamic>? woDetail;
  List<dynamic> tasks = [];
  Map<String, dynamic>? assignmentDetail;
  String? assignmentStatus;
  String? assignmentStart;
  String? _techId;
  bool _isLead = false;
  late AnimationController _swipeController;
  late Animation<Offset> _swipeOffset;
  // set of task ids checked in the checklist
  final Set<String> checkedTasks = <String>{};
  String? _selectedTaskId;
  // local map of taskId -> photo bytes (from camera)
  final Map<String, Uint8List> taskPhotoBytes = {};
  bool loading = false;
  bool submitting = false;
  String? _keterangan;

  @override
  void initState() {
    super.initState();
    _loadPrefs().then((_) => _loadAll());
    // swipe hint animation: slight left slide to indicate swipe direction
    _swipeController = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 900));
    _swipeOffset =
        Tween<Offset>(begin: Offset.zero, end: const Offset(-0.06, 0))
            .chain(CurveTween(curve: Curves.easeInOut))
            .animate(_swipeController);
    _swipeController.repeat(reverse: true);
  }

  @override
  void dispose() {
    _swipeController.dispose();
    super.dispose();
  }

  Future<void> _loadPrefs() async {
    try {
      final p = await SharedPreferences.getInstance();
      setState(() {
        _techId = p.getString('tech_id') ?? '';
      });
    } catch (_) {
      setState(() {
        _techId = '';
      });
    }
    // detect if current user is a lead_shift (so they can auto-approve their own submissions)
    try {
      final api = ApiClient(baseUrl: widget.baseUrl, token: widget.token);
      final me = await api.get('/auth/me');
      final user = (me is Map && me['data'] != null) ? me['data'] : me;
      final role = (user is Map) ? (user['role'] ?? user['roles'] ?? '') : '';
      final String roleStr = role is String
          ? role
          : (role is List && role.isNotEmpty ? role[0] : '');
      bool leaderFlag = false;
      if (roleStr.toString().toLowerCase().contains('lead')) leaderFlag = true;
      // also consider technician with shift_group.leader equal to user id (some backends use this pattern)
      if (!leaderFlag && user is Map) {
        try {
          final userId =
              (user['id'] ?? user['user_id'] ?? '')?.toString() ?? '';
          final groupsRes = await api.get('/shift-groups');
          final groups = groupsRes is List
              ? groupsRes
              : (groupsRes is Map && groupsRes['data'] != null
                  ? groupsRes['data']
                  : groupsRes);
          if (groups is List) {
            for (final g in groups) {
              try {
                final lead = (g is Map) ? (g['leader'] ?? '') : '';
                if (lead != null && lead.toString() == userId) {
                  leaderFlag = true;
                  break;
                }
              } catch (_) {}
            }
          }
        } catch (_) {}
      }
      setState(() {
        _isLead = leaderFlag;
      });
    } catch (_) {}
  }

  Future<void> _loadAll() async {
    setState(() {
      loading = true;
    });
    await Future.wait([
      _loadDetail(),
      _loadTasks(),
      _loadAssignmentStatus(),
      _loadAssignmentDetail()
    ]);
    await _loadLocalChecklist();
    setState(() {
      loading = false;
    });
  }

  Future<void> _loadAssignmentDetail() async {
    try {
      final api = ApiClient(baseUrl: widget.baseUrl, token: widget.token);
      final res = await api.get('/assignments');
      final list = (res is List) ? res : (res['data'] ?? res);
      if (list is List) {
        final found = list.firstWhere(
            (e) => (e['id'] ?? '')?.toString() == widget.assignmentId,
            orElse: () => null);
        if (found != null) {
          final tid =
              (found['task_id'] ?? found['task'] ?? '')?.toString() ?? '';
          if (tid.isNotEmpty) {
            setState(() {
              _selectedTaskId = tid;
              assignmentDetail =
                  (found is Map) ? Map<String, dynamic>.from(found) : null;
              // prefer explicit start fields from assignment if available
              try {
                final s = (found['start_date'] ??
                    found['start_time'] ??
                    found['start'] ??
                    found['startTime']);
                if (s != null) {
                  try {
                    final dt = DateTime.parse(s.toString());
                    assignmentStart = dt.toUtc().toIso8601String();
                  } catch (_) {
                    assignmentStart = s.toString();
                  }
                }
              } catch (_) {}
            });
            // also try LocalDB stored start time (swipe timestamp)
            try {
              final localStart = await LocalDB.instance
                  .getAssignmentStart(widget.assignmentId);
              if (localStart != null)
                setState(() {
                  assignmentStart = localStart.toUtc().toIso8601String();
                });
            } catch (_) {}
            return;
          }
        }
      }
      setState(() {
        _selectedTaskId = null;
        assignmentDetail = null;
      });
    } catch (e) {
      debugPrint('load assignment detail failed: $e');
      setState(() {
        _selectedTaskId = null;
        assignmentDetail = null;
      });
    }
  }

  Future<void> _loadLocalChecklist() async {
    try {
      await LocalDB.instance.init();
      final saved =
          await LocalDB.instance.getChecklistForAssignment(widget.assignmentId);
      final Set<String> loadedChecked = {};
      final Map<String, Uint8List> loadedPhotos = {};
      for (final r in saved) {
        final tId = (r['taskId'] ?? '').toString();
        if (tId.isNotEmpty) {
          if ((r['checked'] ?? 0) == 1) loadedChecked.add(tId);
          final bytes = r['photoBytes'] as Uint8List?;
          if (bytes != null) loadedPhotos[tId] = bytes;
        }
      }
      setState(() {
        checkedTasks.addAll(loadedChecked);
        taskPhotoBytes.addAll(loadedPhotos);
      });
    } catch (e) {
      debugPrint('load local checklist failed: $e');
    }
  }

  Future<void> _loadDetail() async {
    try {
      final api = ApiClient(baseUrl: widget.baseUrl, token: widget.token);
      final res =
          await api.get('/work-orders/${Uri.encodeComponent(widget.woId)}');
      // Unwrap common API envelope { data: {...} } if present
      dynamic payload = res;
      if (res is Map && res.containsKey('data')) payload = res['data'];
      setState(() {
        woDetail = (payload is Map) ? Map<String, dynamic>.from(payload) : null;
        _keterangan = payload['keterangan'] ?? '';
      });
    } catch (e) {
      debugPrint('load detail error: $e');
    }
  }

  Future<void> _submitRealisasi() async {
    if (submitting) return;
    setState(() {
      submitting = true;
    });
    final api = ApiClient(baseUrl: widget.baseUrl, token: widget.token);
    try {
      Uint8List? bytes;
      if (taskPhotoBytes.isNotEmpty) {
        bytes = taskPhotoBytes.values.first;
      }
      // include startTime (when work started) and endTime (now)
      DateTime? startTime;
      try {
        if (assignmentStart != null && assignmentStart!.isNotEmpty) {
          try {
            startTime = DateTime.parse(assignmentStart!).toUtc();
          } catch (_) {
            startTime = null;
          }
        }
        if (startTime == null) {
          final dt =
              await LocalDB.instance.getAssignmentStart(widget.assignmentId);
          if (dt != null) startTime = dt.toUtc();
        }
      } catch (_) {
        startTime = null;
      }
      final endTime = DateTime.now().toUtc();
      final qTaskId = (_selectedTaskId ??
              (assignmentDetail != null
                  ? (assignmentDetail!['task_id'] ?? assignmentDetail!['task'])
                  : null))
          ?.toString();

      // Persist submission locally first (photo file + queued record) to mitigate offline.
      await LocalDB.instance.init();
      final qid =
          '${widget.assignmentId}_${DateTime.now().millisecondsSinceEpoch}';
      String? photoPath;
      if (bytes != null) {
        try {
          photoPath = await LocalDB.instance
              .savePhotoFile(bytes, filename: 'queued_${qid}.jpg');
        } catch (_) {
          photoPath = null;
        }
      }
      final int? startMs = startTime?.millisecondsSinceEpoch;
      final int endMs = endTime.millisecondsSinceEpoch;
      try {
        await LocalDB.instance.queueRealisasiUpload(
            id: qid,
            assignmentId: widget.assignmentId,
            taskId: qTaskId,
            notes: _keterangan?.trim(),
            photoPath: photoPath,
            startTime: startMs,
            endTime: endMs);
      } catch (qe) {
        debugPrint('Failed to queue local realisasi record: $qe');
      }

      final body = {
        'assignmentId': widget.assignmentId,
        'taskId': qTaskId,
        'notes': _keterangan?.trim() ?? null,
        'photoBase64': bytes != null ? base64Encode(bytes) : null,
        'startTime': startTime?.toIso8601String(),
        'endTime': endTime.toIso8601String(),
      };

      // submit to lead-shift for approval (backend will reject duplicates)
      final res = await api.post('/realisasi/submit', body);
      // mark queued record as submitted (server id may be saved later if available)
      try {
        await LocalDB.instance.markRealisasiSubmitted(qid);
      } catch (_) {}
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Realisasi submitted for approval')));
      // If current user is a lead, try to automatically approve the pending realisasi.
      try {
        debugPrint('WODetail: _isLead=$_isLead submitRes=$res');
        String? pendingId;
        if (res is String)
          pendingId = res;
        else if (res is Map) {
          if (res['id'] != null)
            pendingId = res['id'].toString();
          else if (res['data'] is Map && res['data']['id'] != null)
            pendingId = res['data']['id'].toString();
          // try deep search for pending id in arbitrary shapes
          if ((pendingId == null || pendingId.isEmpty)) {
            final found = _deepFindPendingId(res);
            if (found != null && found.isNotEmpty) pendingId = found;
          }
        }

        // fallback: if submit didn't return an id, query pending list and match by assignmentId
        if ((pendingId == null || pendingId.isEmpty) && _isLead) {
          try {
            final pendRes = await api.get('/realisasi/pending');
            final list = (pendRes is List)
                ? pendRes
                : (pendRes is Map && pendRes['data'] != null
                    ? pendRes['data']
                    : pendRes);
            if (list is List) {
              for (final p in list) {
                try {
                  // Try matching by assignment id (legacy)
                  final aid = (p is Map)
                      ? (p['assignmentId'] ??
                          p['assignment']?['id'] ??
                          p['assignmentId'] ??
                          p['assignment_id'])
                      : null;
                  if (aid != null && aid.toString() == widget.assignmentId) {
                    pendingId = (p['id'] ??
                                p['_id'] ??
                                p['pendingId'] ??
                                p['pending_id'])
                            ?.toString() ??
                        pendingId;
                    break;
                  }

                  // Try matching by task id (safer: pending records link to tasks)
                  final ourTaskId = (_selectedTaskId ??
                          (assignmentDetail != null
                              ? (assignmentDetail!['task_id'] ??
                                  assignmentDetail!['task'])
                              : null))
                      ?.toString();
                  if (p is Map) {
                    final ptid = (p['taskId'] ??
                                p['task_id'] ??
                                p['task']?['id'] ??
                                p['task']?['task_id'])
                            ?.toString() ??
                        '';
                    // build candidate ids from current assignment/task list (cover numeric id, uuid, external ids)
                    final candidates = <String>{};
                    if (ourTaskId != null && ourTaskId.isNotEmpty)
                      candidates.add(ourTaskId);
                    try {
                      final aid = (assignmentDetail != null
                              ? (assignmentDetail!['task_id'] ??
                                  assignmentDetail!['task'])
                              : null)
                          ?.toString();
                      if (aid != null && aid.isNotEmpty) candidates.add(aid);
                    } catch (_) {}
                    try {
                      for (final t in tasks) {
                        if (t == null) continue;
                        try {
                          final List keys = [
                            'id',
                            'task_id',
                            'taskId',
                            'external_id',
                            'externalId',
                            'externalId'
                          ];
                          for (final k in keys) {
                            try {
                              final v = t[k];
                              if (v != null) candidates.add(v.toString());
                            } catch (_) {}
                          }
                        } catch (_) {}
                      }
                    } catch (_) {}

                    if (ptid.isNotEmpty) {
                      if (candidates.contains(ptid)) {
                        pendingId = (p['id'] ??
                                    p['_id'] ??
                                    p['pendingId'] ??
                                    p['pending_id'])
                                ?.toString() ??
                            pendingId;
                        break;
                      }
                    }
                  }

                  // if no assignment/task match, try deep search inside this pending item
                  final deep = _deepFindPendingId(p);
                  if (deep != null && deep.isNotEmpty) {
                    pendingId = deep;
                    break;
                  }
                } catch (_) {}
              }
            }
          } catch (e) {
            debugPrint('failed to fetch pending list for fallback: $e');
          }
        }

        if (_isLead && pendingId != null && pendingId.isNotEmpty) {
          try {
            debugPrint('Attempting auto-approve for pendingId=$pendingId');
            await api.post(
                '/realisasi/${Uri.encodeComponent(pendingId)}/approve', {});
            ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Realisasi auto-approved')));
          } catch (e) {
            debugPrint('auto-approve failed: $e');
          }
        } else {
          debugPrint(
              'auto-approve skipped: isLead=$_isLead pendingId=$pendingId');
        }
        // Persist server-side pending id back to local queue for future reference
        try {
          if (pendingId != null && pendingId.isNotEmpty) {
            await LocalDB.instance.markRealisasiSubmitted(qid, serverId: pendingId);
          }
        } catch (_) {}
      } catch (e) {
        debugPrint('auto-approve block failed: $e');
      }
      // Per policy: do not modify WorkOrder start_date/end_date on submit.
      debugPrint(
          'Skipping work order date update on submit (handled by server/leader only)');
      // on success navigate back to main screen
      Navigator.of(context).popUntil((route) => route.isFirst);
      return;
    } catch (e) {
      // if duplicate, inform user and navigate back
      try {
        final msg = e.toString() ?? 'Submit failed';
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('Submit failed: $msg')));
        if (msg.contains('already')) {
          Navigator.of(context).popUntil((route) => route.isFirst);
          return;
        }

        // submission failed after queue attempt — local record already created earlier,
        // inform the user that data is saved locally for later retry
        try {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
              content: Text(
                  'Gagal mengirim, data disimpan secara lokal dan akan dikirim ulang nanti.')));
        } catch (_) {}
      } catch (_) {}
    } finally {
      setState(() {
        submitting = false;
      });
    }
  }

  Future<void> _loadTasks() async {
    try {
      final api = ApiClient(baseUrl: widget.baseUrl, token: widget.token);
      final tres = await api
          .get('/work-orders/${Uri.encodeComponent(widget.woId)}/tasks');
      setState(() {
        tasks = (tres is List) ? tres : (tres['data'] ?? tres);
      });
    } catch (e) {
      debugPrint('load tasks error: $e');
    }
  }

  // Try to find a pending realisasi id inside arbitrary response shapes.
  String? _deepFindPendingId(dynamic node) {
    try {
      if (node == null) return null;
      if (node is Map) {
        // direct id fields
        final pid = (node['id'] ??
            node['_id'] ??
            node['pendingId'] ??
            node['pending_id']);
        // check if this node references our assignment
        final aid = (node['assignmentId'] ??
            node['assignment_id'] ??
            node['assignment']?['id'] ??
            node['assignment']?['assignmentId']);
        if (aid != null && aid.toString() == widget.assignmentId && pid != null)
          return pid.toString();
        // some responses nest data -> pending
        if (node.containsKey('data')) {
          final d = node['data'];
          final found = _deepFindPendingId(d);
          if (found != null) return found;
        }
        // if this node looks like a pending object (has id and maybe assignment) but assignment not present, still prefer id
        if (pid != null && aid == null) return pid.toString();
        // recurse into children
        for (final v in node.values) {
          try {
            final f = _deepFindPendingId(v);
            if (f != null) return f;
          } catch (_) {}
        }
      } else if (node is List) {
        for (final e in node) {
          final f = _deepFindPendingId(e);
          if (f != null) return f;
        }
      }
    } catch (e) {
      debugPrint('deepFind error: $e');
    }
    return null;
  }

  Future<void> _loadAssignmentStatus() async {
    try {
      final api = ApiClient(baseUrl: widget.baseUrl, token: widget.token);
      // Try dedicated for-tech endpoint with explicit user id (handles leaders who fetch group assignments elsewhere)
      try {
        if (_techId != null && _techId!.isNotEmpty) {
          try {
            final res = await api.get(
                '/assignments/for-tech?user=${Uri.encodeComponent(_techId!)}');
            final list = (res is Map && res['assignments'] != null)
                ? res['assignments']
                : ((res is List) ? res : (res['data'] ?? res));
            if (list is List) {
              final found = list.firstWhere(
                  (e) => (e['id'] ?? '').toString() == widget.assignmentId,
                  orElse: () => <String, dynamic>{});
              setState(() {
                assignmentStatus =
                    found.isNotEmpty ? (found['status'] ?? '') : null;
              });
              if (assignmentStatus != null) return;
            }
          } catch (_) {}
        }

        // prefer dedicated for-tech endpoint without user param but fallback to /assignments
        try {
          final res = await api.get('/assignments/for-tech');
          final list = (res is Map && res['assignments'] != null)
              ? res['assignments']
              : ((res is List) ? res : (res['data'] ?? res));
          if (list is List) {
            final found = list.firstWhere(
                (e) => (e['id'] ?? '').toString() == widget.assignmentId,
                orElse: () => <String, dynamic>{});
            setState(() {
              assignmentStatus =
                  found.isNotEmpty ? (found['status'] ?? '') : null;
            });
            if (assignmentStatus != null) return;
          }
        } catch (_) {}

        final res2 = await api.get('/assignments');
        final list2 = (res2 is List) ? res2 : (res2['data'] ?? res2);
        if (list2 is List) {
          final found = list2.firstWhere(
              (e) => (e['id'] ?? '').toString() == widget.assignmentId,
              orElse: () => <String, dynamic>{});
          setState(() {
            assignmentStatus =
                found.isNotEmpty ? (found['status'] ?? '') : null;
          });
        }
      } catch (e) {
        debugPrint('failed to load assignment status: $e');
      }
    } catch (e) {
      debugPrint('failed to load assignment status: $e');
    }
  }

  Future<void> _acceptAssignment() async {
    final api = ApiClient(baseUrl: widget.baseUrl, token: widget.token);
    try {
      await api.patch(
          '/assignments/${Uri.encodeComponent(widget.assignmentId)}',
          {'status': 'PREPARATION'});
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Assignment accepted')));
      await _loadAll();
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Accept failed: $e')));
      // load local checklist entries (if any)
      try {
        await LocalDB.instance.init();
        final saved = await LocalDB.instance
            .getChecklistForAssignment(widget.assignmentId);
        final Set<String> loadedChecked = {};
        final Map<String, Uint8List> loadedPhotos = {};
        for (final r in saved) {
          final tId = (r['taskId'] ?? '').toString();
          if (tId.isNotEmpty) {
            if ((r['checked'] ?? 0) == 1) loadedChecked.add(tId);
            final bytes = r['photoBytes'] as Uint8List?;
            if (bytes != null) loadedPhotos[tId] = bytes;
          }
        }
        setState(() {
          checkedTasks.addAll(loadedChecked);
          taskPhotoBytes.addAll(loadedPhotos);
        });
      } catch (_) {}
    }
  }

  Future<void> _startWork() async {
    final api = ApiClient(baseUrl: widget.baseUrl, token: widget.token);
    try {
      // record swipe time (UTC) and send to server so it can be used as realisasi start
      final swipeTime = DateTime.now().toUtc();
      await api.patch(
          '/assignments/${Uri.encodeComponent(widget.assignmentId)}',
          {'status': 'IN_PROGRESS', 'startTime': swipeTime.toIso8601String()});
      // also set workorder status to IN_PROGRESS
      try {
        await api.patch('/work-orders/${Uri.encodeComponent(widget.woId)}',
            {'status': 'IN_PROGRESS'});
      } catch (e) {
        debugPrint('failed to set workorder status: $e');
      }
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Work started')));
      setState(() {
        assignmentStatus = 'IN_PROGRESS';
        checkedTasks.clear();
      });
      // record start time locally for this assignment
      try {
        await LocalDB.instance.init();
        await LocalDB.instance
            .setAssignmentStart(widget.assignmentId, swipeTime);
        setState(() {
          assignmentStart = swipeTime.toIso8601String();
        });
        if (kDebugMode) {
          try {
            final check =
                await LocalDB.instance.getAssignmentStart(widget.assignmentId);
            debugPrint(
                'WODetail debug: after setAssignmentStart local value=$check');
          } catch (e) {
            debugPrint(
                'WODetail debug: after setAssignmentStart read failed: $e');
          }
        }
      } catch (e) {
        debugPrint('setAssignmentStart failed: $e');
      }
      await _loadAll();
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Start failed: $e')));
    }
  }

  double _taskDuration(dynamic t) {
    if (t == null) return 0.0;
    try {
      final v = t['duration_min'] ??
          t['task_duration'] ??
          t['duration'] ??
          t['dur'] ??
          t['estimate'] ??
          t['estimated_minutes'];
      if (v == null) return 0.0;
      if (v is num) return v.toDouble();
      final s = v.toString();
      return double.tryParse(s) ?? 0.0;
    } catch (_) {
      return 0.0;
    }
  }

  String _deriveTaskStatus(dynamic t, String taskId) {
    try {
      if (checkedTasks.contains(taskId)) return 'Input (you)';

      // look for explicit realisasi entries on the task
      final r = t['realisasi'] ??
          t['realisasis'] ??
          t['realisasi_list'] ??
          t['realisasi_items'] ??
          t['realisasiEntries'];
      if (r is List && r.isNotEmpty) {
        try {
          final first = r.first;
          final st = (first is Map)
              ? (first['status'] ??
                  first['state'] ??
                  first['verification_status'] ??
                  '')
              : '';
          final s = st?.toString().toUpperCase() ?? '';
          if (s.contains('PEND') ||
              s.contains('SUBMIT') ||
              s.contains('VERIFY') ||
              s.contains('WAIT')) return 'Pending verification';
          if (s.contains('APPROV') ||
              s.contains('COMP') ||
              s.contains('VERIFIED') ||
              s.contains('OK')) return 'Verified';
        } catch (_) {}
        return 'Pending verification';
      }

      // sometimes task itself has status flags
      final ts = (t['status'] ?? t['state'] ?? '').toString();
      final uts = ts.toUpperCase();
      if (uts.contains('PEND') ||
          uts.contains('SUBMIT') ||
          uts.contains('VERIFY')) return 'Pending verification';
      if (uts.contains('COMP') || uts.contains('DONE') || uts.contains('VERIF'))
        return 'Verified';
    } catch (_) {}
    return 'Not input';
  }

  Color _statusColor(String s) {
    final u = s.toUpperCase();
    if (u.contains('INPUT') || u.contains('VERIF') && u.contains('YOU'))
      return Colors.green.shade200;
    if (u.contains('PEND') || u.contains('VERIFY'))
      return Colors.orange.shade200;
    if (u.contains('VERIFIED') || u.contains('COMP') || u.contains('DONE'))
      return Colors.green.shade100;
    return Colors.grey.shade200;
  }

  void _toggleTaskChecked(String id) {
    // Deprecated: use _onTaskCheckboxPressed which opens camera
  }

  Future<void> _onTaskCheckboxPressed(String id) async {
    // If already checked, ask to remove photo/unchecked
    if (checkedTasks.contains(id)) {
      final remove = await showDialog<bool>(
          context: context,
          builder: (c) => AlertDialog(
                title: const Text('Unmark task?'),
                content: const Text('Remove the photo and uncheck this task?'),
                actions: [
                  TextButton(
                      onPressed: () => Navigator.pop(c, false),
                      child: const Text('Cancel')),
                  TextButton(
                      onPressed: () => Navigator.pop(c, true),
                      child: const Text('Remove')),
                ],
              ));
      if (remove == true) {
        setState(() {
          checkedTasks.remove(id);
          taskPhotoBytes.remove(id);
        });
        try {
          await LocalDB.instance.init();
          await LocalDB.instance
              .removeChecklist(assignmentId: widget.assignmentId, taskId: id);
        } catch (_) {}
      }
      return;
    }

    // Open camera to capture photo; only mark checked when photo taken
    try {
      final picker = ImagePicker();
      XFile? photo;

      // Show dialog to choose between camera and gallery
      final imageSource = await showDialog<ImageSource>(
          context: context,
          builder: (c) => AlertDialog(
                title: const Text('Pilih Sumber Foto'),
                content: const Text(
                    'Ambil foto dari kamera atau pilih dari galeri?'),
                actions: [
                  TextButton(
                      onPressed: () => Navigator.pop(c, null),
                      child: const Text('Batal')),
                  TextButton(
                      onPressed: () => Navigator.pop(c, ImageSource.gallery),
                      child: const Text('Galeri')),
                  TextButton(
                      onPressed: () => Navigator.pop(c, ImageSource.camera),
                      child: const Text('Kamera')),
                ],
              ));

      if (imageSource == null) return;

      // Pick image from the selected source
      photo = await picker.pickImage(
          source: imageSource, imageQuality: 75, maxWidth: 1600);

      if (photo != null) {
        final raw = await photo.readAsBytes();
        final bytes = await compressImageBytes(raw, quality: 80, maxWidth: 1280);
        setState(() {
          taskPhotoBytes[id] = bytes;
          checkedTasks.add(id);
        });

        // persist to local DB
        try {
          await LocalDB.instance.init();
          await LocalDB.instance.saveChecklist(
              assignmentId: widget.assignmentId,
              taskId: id,
              photoBytes: bytes,
              checked: true);
        } catch (e) {
          debugPrint('saveChecklist failed: $e');
        }

        // NOTE: Do NOT auto-submit realisasi when a task checkbox is checked.
        // The photo + checked state is persisted locally via `LocalDB.saveChecklist()` above
        // and will be uploaded only when the user explicitly presses "Submit Realisasi".
      } else {
        // user cancelled camera/picker, do nothing
      }
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Camera failed: $e')));
    }
  }

  void _showImage({Uint8List? bytes}) {
    if (bytes == null) return;
    showDialog(
        context: context,
        builder: (c) => Dialog(
              child: GestureDetector(
                onTap: () => Navigator.pop(c),
                child: InteractiveViewer(child: Image.memory(bytes)),
              ),
            ));
  }

  bool _isWorkInProgress() {
    try {
      final s = (assignmentStatus ??
          woDetail?['status'] ??
          woDetail?['raw']?['status']);
      if (s == null) return false;
      final norm =
          s.toString().toUpperCase().replaceAll('-', '_').replaceAll(' ', '_');
      return norm == 'IN_PROGRESS' || norm == 'INPROGRESS';
    } catch (_) {
      return false;
    }
  }

  bool _assignedToCurrent() {
    try {
      if (_techId == null || _techId!.isEmpty) return false;
      final cur = _techId!.toString();
      if (assignmentDetail == null) return false;
      final a = assignmentDetail!;
      // check common single-assignee fields
      final candidate = (a['assignee'] ??
          a['assigneeId'] ??
          a['assignee_id'] ??
          a['assigned_to'] ??
          a['user'] ??
          a['assignedTo']);
      if (candidate != null) {
        if (candidate is String) {
          if (candidate == cur) return true;
        } else if (candidate is Map) {
          final id = (candidate['id'] ??
                      candidate['user_id'] ??
                      candidate['nipp'] ??
                      candidate['external_id'])
                  ?.toString() ??
              '';
          if (id.isNotEmpty && id == cur) return true;
        }
      }
      // check multi-assignee lists
      final listCand = (a['assignees'] ??
          a['assigned'] ??
          a['assigned_to_list'] ??
          a['assignment_users']);
      if (listCand is List) {
        for (final it in listCand) {
          try {
            if (it == null) continue;
            if (it is String) {
              if (it == cur) return true;
            } else if (it is Map) {
              final id =
                  (it['id'] ?? it['user_id'] ?? it['nipp'] ?? it['external_id'])
                          ?.toString() ??
                      '';
              if (id.isNotEmpty && id == cur) return true;
            }
          } catch (_) {}
        }
      }
      return false;
    } catch (_) {
      return false;
    }
  }

  // use shared date_utils

  List<Map<String, String>> _extractAttachments() {
    final List<Map<String, String>> out = [];
    if (woDetail == null) return out;
    dynamic src;
    // common fields to check
    final candidates = ['attachments', 'files'];
    for (final c in candidates) {
      src = woDetail?[c] ?? woDetail?['raw']?[c];
      if (src is List) {
        for (final it in src) {
          try {
            if (it == null) continue;
            if (it is String) {
              out.add({'name': it, 'url': it});
            } else if (it is Map) {
              final name = (it['name'] ??
                      it['filename'] ??
                      it['title'] ??
                      it['path'] ??
                      it['url'] ??
                      '')
                  .toString();
              final url =
                  (it['url'] ?? it['path'] ?? it['file'] ?? it['source'] ?? '')
                      .toString();
              if (name.isNotEmpty || url.isNotEmpty)
                out.add({'name': name.isNotEmpty ? name : url, 'url': url});
            }
          } catch (_) {}
        }
      }
    }
    // also check single field 'attachment'
    final single = woDetail?['attachment'] ?? woDetail?['raw']?['attachment'];
    if (single != null) {
      if (single is String)
        out.add({'name': single, 'url': single});
      else if (single is Map) {
        final name = (single['name'] ?? single['filename'] ?? '').toString();
        final url = (single['url'] ?? single['path'] ?? '').toString();
        out.add({'name': name.isNotEmpty ? name : url, 'url': url});
      }
    }
    return out;
  }

  List<Map<String, String>> _extractTools() {
    final List<Map<String, String>> out = [];
    if (woDetail == null) return out;
    dynamic src = woDetail?['tools'] ??
        woDetail?['raw']?['tools'] ??
        woDetail?['raw']?['required_tools'];
    if (src is List) {
      for (final it in src) {
        try {
          if (it == null) continue;
          if (it is String) {
            out.add({'name': it, 'qty': '', 'unit': ''});
          } else if (it is Map) {
            final name =
                (it['name'] ?? it['tool'] ?? it['title'] ?? '').toString();
            final qty = (it['qty'] ??
                    it['quantity'] ??
                    it['count'] ??
                    it['amount'] ??
                    '')
                .toString();
            final unit = (it['unit'] ??
                    it['uom'] ??
                    it['satuan'] ??
                    it['unit_name'] ??
                    '')
                .toString();
            out.add({
              'name': name.isNotEmpty ? name : (it['tool']?.toString() ?? ''),
              'qty': qty,
              'unit': unit
            });
          }
        } catch (_) {}
      }
    }
    return out;
  }

  List<Map<String, String>> _extractServices() {
    final List<Map<String, String>> out = [];
    if (woDetail == null) return out;
    dynamic src = woDetail?['services'] ??
        woDetail?['raw']?['services'] ??
        woDetail?['raw']?['required_services'];
    if (src is List) {
      for (final it in src) {
        try {
          if (it == null) continue;
          if (it is String) {
            out.add({'name': it, 'note': ''});
          } else if (it is Map) {
            final name =
                (it['name'] ?? it['service'] ?? it['title'] ?? '').toString();
            final note =
                (it['note'] ?? it['description'] ?? it['remarks'] ?? '')
                    .toString();
            out.add({
              'name':
                  name.isNotEmpty ? name : (it['service']?.toString() ?? ''),
              'note': note
            });
          }
        } catch (_) {}
      }
    }
    return out;
  }

  List<Map<String, String>> _extractSpareparts() {
    final List<Map<String, String>> out = [];
    if (woDetail == null) return out;
    dynamic src = woDetail?['spareparts'] ??
        woDetail?['raw']?['spareparts'] ??
        woDetail?['raw']?['parts'];
    if (src is List) {
      for (final it in src) {
        try {
          if (it == null) continue;
          if (it is String) {
            out.add({
              'name': it,
              'qty': '',
              'unit': '',
              'code': '',
              'warehouse': '',
              'category': '',
              'type': '',
              'oa_no': ''
            });
          } else if (it is Map) {
            final name = (it['sparepart_name'] ??
                    it['sparepartName'] ??
                    it['name'] ??
                    it['part'] ??
                    it['part_name'] ??
                    it['item'] ??
                    '')
                .toString();
            final qty = (it['quantity'] ??
                    it['qty'] ??
                    it['count'] ??
                    it['amount'] ??
                    '')
                .toString();
            final unit =
                (it['uom'] ?? it['unit'] ?? it['satuan'] ?? '').toString();
            final code = (it['code'] ??
                    it['part_code'] ??
                    it['sku'] ??
                    it['item_code'] ??
                    '')
                .toString();
            final warehouse = (it['wh_name'] ??
                    it['whName'] ??
                    it['warehouse'] ??
                    it['warehouse_location'] ??
                    it['stock_location'] ??
                    it['location'] ??
                    it['sloc_code'] ??
                    it['wh_code'] ??
                    '')
                .toString();
            final category =
                (it['category'] ?? it['part_category'] ?? '').toString();
            final type = (it['type'] ?? it['part_type'] ?? '').toString();
            final oa = (it['oa_no'] ??
                    it['no_oa'] ??
                    it['noOA'] ??
                    it['oaNumber'] ??
                    it['order_no'] ??
                    it['oa'] ??
                    '')
                .toString();
            out.add({
              'name': name.isNotEmpty ? name : (it['part']?.toString() ?? ''),
              'qty': qty,
              'unit': unit,
              'code': code,
              'warehouse': warehouse,
              'category': category,
              'type': type,
              'oa_no': oa,
            });
          }
        } catch (_) {}
      }
    }
    return out;
  }

  @override
  Widget build(BuildContext context) {
    final bool _canStart =
        (assignmentStatus == 'PREPARATION' || assignmentStatus == 'DEPLOYED');
    final bool _selectedHasRealisasi = (() {
      try {
        if (_selectedTaskId == null) return false;
        final sel = tasks.firstWhere((t) {
          final tid =
              (t['id'] ?? t['_id'] ?? t['taskId'] ?? '')?.toString() ?? '';
          return tid == _selectedTaskId;
        }, orElse: () => null);
        if (sel == null) return false;
        final rCount = int.tryParse((sel['realisasi_count'] ??
                    sel['realisasiCount'] ??
                    sel['realisasi']?.length ??
                    0)
                .toString()) ??
            0;
        final pCount = int.tryParse((sel['pending_realisasi_count'] ??
                    sel['pendingRealisasiCount'] ??
                    sel['pending_realisasi']?.length ??
                    sel['pending']?.length ??
                    0)
                .toString()) ??
            0;
        final hasFlag = (sel['has_realisasi'] == true) || (rCount > 0);
        final pendingFlag =
            (sel['has_pending_realisasi'] == true) || (pCount > 0);
        final st = (assignmentStatus ?? '').toString().toUpperCase();
        final assignCompleted = (st.contains('COMP') ||
            st.contains('VERIF') ||
            st.contains('DONE') ||
            st.contains('APPROV') ||
            st.contains('OK') ||
            st.contains('REALISASI'));
        return hasFlag || pendingFlag || assignCompleted;
      } catch (_) {
        return false;
      }
    })();
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).maybePop(),
        ),
        title: Text(woDetail?['doc_no']?.toString() ?? widget.woId),
      ),
      drawer: const AppDrawer(),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : Stack(
              children: [
                SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(12, 12, 12, 110),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Card(
                        margin: EdgeInsets.zero,
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                      child: Text(
                                          'WO: ${woDetail?['doc_no'] ?? widget.woId}',
                                          style: const TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.bold))),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                            color: Colors.blue.shade50,
                                            borderRadius:
                                                BorderRadius.circular(6)),
                                        child: Text(
                                            (woDetail?['status'] ??
                                                    woDetail?['raw']
                                                        ?['status'] ??
                                                    '')
                                                .toString(),
                                            style: const TextStyle(
                                                fontWeight: FontWeight.w600)),
                                      ),
                                      const SizedBox(height: 6),
                                      if ((woDetail?['work_type'] ??
                                              woDetail?['raw']?['work_type'] ??
                                              woDetail?['raw']?['type_work']) !=
                                          null)
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                              color: Colors.purple.shade50,
                                              borderRadius:
                                                  BorderRadius.circular(6)),
                                          child: Text(
                                              (woDetail?['work_type'] ??
                                                      woDetail?['raw']
                                                          ?['work_type'] ??
                                                      woDetail?['raw']
                                                          ?['type_work'])
                                                  .toString(),
                                              style: const TextStyle(
                                                  fontWeight: FontWeight.w600,
                                                  color: Colors.purple)),
                                        ),
                                    ],
                                  )
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text('Asset: ${woDetail?['asset_name'] ?? '-'}',
                                  style: const TextStyle(fontSize: 14)),
                              const SizedBox(height: 6),
                              // debug: why is '(swiped)' not appearing?
                              (() {
                                final bool isInProgress = ((assignmentStatus !=
                                            null &&
                                        assignmentStatus!
                                            .toString()
                                            .toUpperCase()
                                            .contains("IN_PROGRESS")) ||
                                    (((woDetail?['status'] ??
                                                    woDetail?['raw']?['status'])
                                                ?.toString() ??
                                            '')
                                        .toUpperCase()
                                        .contains("IN_PROGRESS")));
                                if (kDebugMode) {
                                  debugPrint(
                                      'WODetail debug: assignmentStart=${assignmentStart ?? '<null>'} assignmentStatus=${assignmentStatus ?? '<null>'} woStatus=${(woDetail?['status'] ?? woDetail?['raw']?['status']) ?? '<null>'} isInProgress=$isInProgress');
                                }
                                return Text(
                                  'Start: ${formatUtcDisplay((isInProgress && assignmentStart != null) ? assignmentStart : woDetail?['start_date'], extractTimezone(woDetail))}${(isInProgress && assignmentStart != null) ? ' (swiped)' : ''}',
                                  style:
                                      (isInProgress && assignmentStart != null)
                                          ? const TextStyle(
                                              color: Colors.green,
                                              fontWeight: FontWeight.w600)
                                          : const TextStyle(color: Colors.grey),
                                );
                              })(),
                              const SizedBox(height: 6),
                              Text(
                                  'Location: ${woDetail?['vendor_cabang'] ?? woDetail?['raw']?['vendor_cabang'] ?? woDetail?['raw']?['site'] ?? '-'}',
                                  style: const TextStyle(color: Colors.grey)),
                              const SizedBox(height: 8),
                              Text(woDetail?['description'] ?? '-',
                                  maxLines: 3, overflow: TextOverflow.ellipsis),
                              const SizedBox(height: 12),
                              // determine if the selected task or assignment already has realisasi/completed
                              // Tools
                              Builder(builder: (_) {
                                final tools = _extractTools();
                                if (tools.isNotEmpty) {
                                  return Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text('Required Tools',
                                            style: TextStyle(
                                                fontWeight: FontWeight.w700)),
                                        const SizedBox(height: 8),
                                        Wrap(
                                            spacing: 8,
                                            runSpacing: 6,
                                            children: tools.map((t) {
                                              final name = t['name'] ?? 'tool';
                                              final qty =
                                                  (t['qty'] ?? '').toString();
                                              final unit =
                                                  (t['unit'] ?? '').toString();
                                              final label = qty.isNotEmpty
                                                  ? (unit.isNotEmpty
                                                      ? '$name • $qty $unit'
                                                      : '$name • $qty')
                                                  : name.toString();
                                              return Chip(label: Text(label));
                                            }).toList()),
                                        const SizedBox(height: 12),
                                      ]);
                                }
                                return const SizedBox.shrink();
                              }),

                              // Services
                              Builder(builder: (_) {
                                final services = _extractServices();
                                if (services.isNotEmpty) {
                                  return Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text('Services',
                                            style: TextStyle(
                                                fontWeight: FontWeight.w700)),
                                        const SizedBox(height: 8),
                                        Column(
                                            children: services.map((s) {
                                          final name = s['name'] ?? 'service';
                                          final note =
                                              (s['note'] ?? '').toString();
                                          return ListTile(
                                            contentPadding: EdgeInsets.zero,
                                            title: Text(name.toString(),
                                                style: const TextStyle(
                                                    fontWeight:
                                                        FontWeight.w600)),
                                            subtitle: note.isNotEmpty
                                                ? Text(note,
                                                    style: const TextStyle(
                                                        color: Colors.grey))
                                                : null,
                                          );
                                        }).toList()),
                                        const SizedBox(height: 12),
                                      ]);
                                }
                                return const SizedBox.shrink();
                              }),

                              // Spareparts
                              Builder(builder: (_) {
                                final parts = _extractSpareparts();
                                if (parts.isNotEmpty) {
                                  return Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        const Text('Spareparts',
                                            style: TextStyle(
                                                fontWeight: FontWeight.w700)),
                                        const SizedBox(height: 8),
                                        Column(
                                            children: parts.map((p) {
                                          final name = p['name'] ?? 'part';
                                          final code =
                                              (p['code'] ?? '').toString();
                                          final qty =
                                              (p['qty'] ?? '').toString();
                                          final unit =
                                              (p['unit'] ?? '').toString();
                                          final warehouse =
                                              (p['warehouse'] ?? '').toString();
                                          final category =
                                              (p['category'] ?? '').toString();
                                          final type =
                                              (p['type'] ?? '').toString();
                                          final oa =
                                              (p['oa_no'] ?? '').toString();
                                          final subtitleParts = <String>[];
                                          if (warehouse.isNotEmpty)
                                            subtitleParts.add('WH: $warehouse');
                                          if (category.isNotEmpty)
                                            subtitleParts.add('Cat: $category');
                                          if (type.isNotEmpty)
                                            subtitleParts.add('Type: $type');
                                          if (oa.isNotEmpty)
                                            subtitleParts.add('OA: $oa');
                                          final subtitle =
                                              subtitleParts.join(' • ');
                                          final trailing = qty.isNotEmpty
                                              ? (unit.isNotEmpty
                                                  ? '$qty $unit'
                                                  : qty)
                                              : '';
                                          final nameStr = name.toString();
                                          final displayName = nameStr.isNotEmpty
                                              ? nameStr
                                              : (code.isNotEmpty
                                                  ? code
                                                  : 'part');
                                          final titleText = (code.isNotEmpty &&
                                                  nameStr.isNotEmpty)
                                              ? '$displayName ($code)'
                                              : displayName;

                                          // Build subtitle showing metadata and warehouse name
                                          Widget? subtitleWidget;
                                          final metaLines = <String>[];
                                          if (subtitle.isNotEmpty)
                                            metaLines.add(subtitle);
                                          if (warehouse.isNotEmpty)
                                            metaLines
                                                .add('Warehouse: $warehouse');
                                          if (metaLines.isNotEmpty) {
                                            subtitleWidget = Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                for (final line in metaLines)
                                                  Padding(
                                                      padding:
                                                          const EdgeInsets.only(
                                                              bottom: 2),
                                                      child: Text(line,
                                                          style:
                                                              const TextStyle(
                                                                  color: Colors
                                                                      .grey))),
                                              ],
                                            );
                                          } else {
                                            subtitleWidget = null;
                                          }

                                          return ListTile(
                                            contentPadding: EdgeInsets.zero,
                                            title: Text(titleText,
                                                style: const TextStyle(
                                                    fontWeight:
                                                        FontWeight.w600)),
                                            subtitle: subtitleWidget,
                                            trailing: trailing.isNotEmpty
                                                ? Text(trailing,
                                                    style: const TextStyle(
                                                        fontWeight:
                                                            FontWeight.w700))
                                                : null,
                                          );
                                        }).toList()),
                                        const SizedBox(height: 12),
                                      ]);
                                }
                                return const SizedBox.shrink();
                              }),

                              // Attachments
                              Builder(builder: (_) {
                                final atts = _extractAttachments();
                                if (atts.isEmpty)
                                  return const SizedBox.shrink();
                                return Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text('Attachments',
                                          style: TextStyle(
                                              fontWeight: FontWeight.w700)),
                                      const SizedBox(height: 8),
                                      Wrap(
                                          spacing: 8,
                                          runSpacing: 6,
                                          children: atts.map((a) {
                                            final name =
                                                a['name'] ?? a['url'] ?? 'file';
                                            final url = a['url'] ?? '';
                                            return ActionChip(
                                              label: Text(name.toString()),
                                              onPressed: () async {
                                                if (url.isNotEmpty) {
                                                  final Uri uri =
                                                      Uri.parse(url);
                                                  // try to launch; if fails, show dialog with copy option
                                                  try {
                                                    if (await canLaunchUrl(
                                                        uri)) {
                                                      await launchUrl(uri,
                                                          mode: LaunchMode
                                                              .externalApplication);
                                                      return;
                                                    }
                                                  } catch (_) {}
                                                  // fallback dialog with copy
                                                  showDialog(
                                                      context: context,
                                                      builder:
                                                          (c) => AlertDialog(
                                                                title: Text(name
                                                                    .toString()),
                                                                content:
                                                                    Text(url),
                                                                actions: [
                                                                  TextButton(
                                                                      onPressed:
                                                                          () {
                                                                        Navigator
                                                                            .pop(c);
                                                                      },
                                                                      child: const Text(
                                                                          'Close')),
                                                                  TextButton(
                                                                      onPressed:
                                                                          () async {
                                                                        await Clipboard.setData(ClipboardData(
                                                                            text:
                                                                                url));
                                                                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                                                                            content:
                                                                                Text('URL copied')));
                                                                        Navigator
                                                                            .pop(c);
                                                                      },
                                                                      child: const Text(
                                                                          'Copy URL')),
                                                                ],
                                                              ));
                                                } else {
                                                  showDialog(
                                                      context: context,
                                                      builder: (c) =>
                                                          AlertDialog(
                                                            title: Text(name
                                                                .toString()),
                                                            content: const Text(
                                                                'No URL available'),
                                                            actions: [
                                                              TextButton(
                                                                  onPressed:
                                                                      () {
                                                                    Navigator
                                                                        .pop(c);
                                                                  },
                                                                  child: const Text(
                                                                      'Close'))
                                                            ],
                                                          ));
                                                }
                                              },
                                            );
                                          }).toList()),
                                      const SizedBox(height: 12),
                                    ]);
                              }),

                              // Note: Accept button removed. Swipe-to-start is available when
                              // assignmentStatus is DEPLOYED or PREPARATION.
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      const Text('Tasks',
                          style: TextStyle(
                              fontWeight: FontWeight.w600, fontSize: 16)),
                      const SizedBox(height: 8),
                      Builder(builder: (_) {
                        if (tasks.isEmpty)
                          return const Text('No tasks available',
                              style: TextStyle(color: Colors.grey));
                        // filter tasks to only those selected from Inbox when available
                        final filteredTasks = (tasks.where((t) {
                          if (_selectedTaskId == null) return true;
                          final id =
                              (t['id'] ?? t['external_id'] ?? '')?.toString() ??
                                  '';
                          return id == _selectedTaskId;
                        })).toList();

                        // compute weighted progress
                        double total = 0.0;
                        double checked = 0.0;
                        for (final t in filteredTasks) {
                          final id =
                              (t['id'] ?? t['external_id'] ?? '').toString();
                          final d = _taskDuration(t);
                          total += d > 0 ? d : 1.0;
                          if (checkedTasks.contains(id))
                            checked += (d > 0 ? d : 1.0);
                        }
                        final progress = total > 0 ? (checked / total) : 0.0;

                        return Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Padding(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 8.0),
                                child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      LinearProgressIndicator(
                                          value: progress, minHeight: 8),
                                      const SizedBox(height: 6),
                                      Text(
                                          '${(progress * 100).toStringAsFixed(0)}% complete',
                                          style: const TextStyle(
                                              fontSize: 12,
                                              color: Colors.grey)),
                                    ]),
                              ),

                              ...filteredTasks.map((t) {
                                final taskId =
                                    (t['id'] ?? t['external_id'] ?? '')
                                        .toString();
                                final taskName =
                                    t['name'] ?? t['task_name'] ?? '-';
                                final dur = _taskDuration(t).toStringAsFixed(0);
                                final assigns = (t['assignments'] is List)
                                    ? List.from(t['assignments'])
                                    : <dynamic>[];
                                final checkedState =
                                    checkedTasks.contains(taskId);

                                return Card(
                                  margin:
                                      const EdgeInsets.symmetric(vertical: 6),
                                  child: Padding(
                                    padding: const EdgeInsets.all(10),
                                    child: Row(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Checkbox(
                                            value: checkedState,
                                            onChanged: (() {
                                              // determine if this task is assigned to current technician
                                              try {
                                                final assigns =
                                                    (t['assignments'] is List)
                                                        ? List.from(
                                                            t['assignments'])
                                                        : <dynamic>[];
                                                bool assignedToCurrent = false;
                                                if (assigns.isEmpty)
                                                  assignedToCurrent = true;
                                                if (!assignedToCurrent &&
                                                    _techId != null &&
                                                    _techId!.isNotEmpty) {
                                                  for (final as in assigns) {
                                                    try {
                                                      // try common id fields
                                                      final candidates =
                                                          <String>[];
                                                      if (as is Map) {
                                                        final u = as['user'] ??
                                                            as['assigned_to'] ??
                                                            as['assignee'] ??
                                                            as;
                                                        if (u is Map) {
                                                          for (final k in [
                                                            'id',
                                                            'user_id',
                                                            'userId',
                                                            'nipp',
                                                            'external_id',
                                                            'username'
                                                          ]) {
                                                            try {
                                                              final v = u[k];
                                                              if (v != null)
                                                                candidates.add(v
                                                                    .toString());
                                                            } catch (_) {}
                                                          }
                                                        } else {
                                                          for (final k in [
                                                            'assignee',
                                                            'assignee_id',
                                                            'assigneeId',
                                                            'assigned_to',
                                                            'user_id'
                                                          ]) {
                                                            try {
                                                              final v = as[k];
                                                              if (v != null)
                                                                candidates.add(v
                                                                    .toString());
                                                            } catch (_) {}
                                                          }
                                                        }
                                                      }
                                                      if (candidates.any((c) =>
                                                          c == _techId)) {
                                                        assignedToCurrent =
                                                            true;
                                                        break;
                                                      }
                                                    } catch (_) {}
                                                  }
                                                }
                                                final enabled =
                                                    _isWorkInProgress() &&
                                                        (assigns.isEmpty ||
                                                            assignedToCurrent);
                                                return enabled
                                                    ? (_) {
                                                        _onTaskCheckboxPressed(
                                                            taskId);
                                                      }
                                                    : null;
                                              } catch (_) {
                                                return _isWorkInProgress()
                                                    ? (_) {
                                                        _onTaskCheckboxPressed(
                                                            taskId);
                                                      }
                                                    : null;
                                              }
                                            })(),
                                          ),
                                          const SizedBox(width: 8),
                                          // thumbnail (if present)
                                          if (taskPhotoBytes
                                              .containsKey(taskId))
                                            GestureDetector(
                                              onTap: () => _showImage(
                                                  bytes:
                                                      taskPhotoBytes[taskId]),
                                              child: Container(
                                                width: 80,
                                                margin: const EdgeInsets.only(
                                                    right: 8),
                                                decoration: BoxDecoration(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            4),
                                                    color:
                                                        Colors.grey.shade200),
                                                child: ClipRRect(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            4),
                                                    child: Image.memory(
                                                        taskPhotoBytes[taskId]!,
                                                        fit: BoxFit.cover)),
                                              ),
                                            )
                                          else
                                            const SizedBox(width: 0),

                                          Expanded(
                                              child: Column(
                                                  crossAxisAlignment:
                                                      CrossAxisAlignment.start,
                                                  children: [
                                                Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .spaceBetween,
                                                    children: [
                                                      Expanded(
                                                          child: Text(
                                                              '$taskName',
                                                              style: const TextStyle(
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .w700))),
                                                      Builder(builder: (_) {
                                                        final statusText =
                                                            _deriveTaskStatus(
                                                                t, taskId);
                                                        return Container(
                                                          padding:
                                                              const EdgeInsets
                                                                  .symmetric(
                                                                  horizontal: 8,
                                                                  vertical: 4),
                                                          decoration: BoxDecoration(
                                                              color: _statusColor(
                                                                  statusText),
                                                              borderRadius:
                                                                  BorderRadius
                                                                      .circular(
                                                                          6)),
                                                          child: Text(
                                                              statusText,
                                                              style:
                                                                  const TextStyle(
                                                                      fontSize:
                                                                          12)),
                                                        );
                                                      })
                                                    ]),
                                                const SizedBox(height: 6),
                                                Text('Duration: $dur min',
                                                    style: const TextStyle(
                                                        color: Colors.grey,
                                                        fontSize: 13)),
                                                const SizedBox(height: 8),
                                                if (assigns.isNotEmpty)
                                                  Wrap(
                                                      spacing: 8,
                                                      runSpacing: 6,
                                                      children: assigns
                                                          .map<Widget>((as) {
                                                        final name = as['user']
                                                                ?['name'] ??
                                                            as['user']
                                                                ?['nipp'] ??
                                                            as['assigned_to'] ??
                                                            as['user_id'] ??
                                                            'Unknown';
                                                        return Chip(
                                                            label: Text(name
                                                                .toString()));
                                                      }).toList())
                                                else
                                                  const Text(
                                                      'No assigned technicians',
                                                      style: TextStyle(
                                                          color: Colors.grey))
                                              ]))
                                        ]),
                                  ),
                                );
                              }).toList(),

                              const SizedBox(height: 12),
                              // Keterangan input for Submit Realisasi (optional)
                              Padding(
                                padding:
                                    const EdgeInsets.symmetric(vertical: 6.0),
                                child: TextField(
                                  decoration: const InputDecoration(
                                    labelText: 'Keterangan (opsional)',
                                    hintText: 'Alasan atau catatan perubahan',
                                  ),
                                  maxLines: 3,
                                  onChanged: (v) => setState(() {
                                    _keterangan = v;
                                  }),
                                ),
                              ),
                              // Submit Realisasi button (enabled when progress reaches 100%)
                              if (!_selectedHasRealisasi)
                                Padding(
                                  padding:
                                      const EdgeInsets.symmetric(vertical: 12),
                                  child: ElevatedButton(
                                    onPressed: (progress >= 0.999)
                                        ? () async {
                                            final confirm =
                                                await showDialog<bool>(
                                              context: context,
                                              builder: (c) => AlertDialog(
                                                title: const Text(
                                                    'Konfirmasi Submit'),
                                                content: const Text(
                                                    'Anda yakin ingin submit realisasi? Data akan dikirim untuk approval.'),
                                                actions: [
                                                  TextButton(
                                                    onPressed: () =>
                                                        Navigator.pop(c, false),
                                                    child: const Text('Batal'),
                                                  ),
                                                  TextButton(
                                                    onPressed: () =>
                                                        Navigator.pop(c, true),
                                                    child: const Text('Submit'),
                                                  ),
                                                ],
                                              ),
                                            );
                                            if (confirm == true) {
                                              await _submitRealisasi();
                                            }
                                          }
                                        : null,
                                    child: const Text('Submit Realisasi'),
                                  ),
                                ),
                            ]);
                      }),
                      const SizedBox(height: 8),
                      // removed inline swipe control (floating one is positioned)
                    ],
                  ),
                ),
                // Floating swipe control (only visible when available)
                if (_canStart && !_selectedHasRealisasi)
                  Positioned(
                    bottom: 16,
                    left: 16,
                    right: 16,
                    child: Material(
                      elevation: 8,
                      borderRadius: BorderRadius.circular(8),
                      child: Dismissible(
                        key: Key('start-${widget.assignmentId}'),
                        direction: DismissDirection.endToStart,
                        background: Container(
                            decoration: BoxDecoration(
                                color: Colors.green,
                                borderRadius: BorderRadius.circular(8)),
                            alignment: Alignment.centerRight,
                            padding: const EdgeInsets.only(right: 20),
                            child: const Icon(Icons.play_arrow,
                                color: Colors.white)),
                        confirmDismiss: (dir) async {
                          final ok = await showDialog<bool>(
                              context: context,
                              builder: (c) => AlertDialog(
                                      title: const Text('Start work?'),
                                      content: const Text(
                                          'Swipe to confirm starting work'),
                                      actions: [
                                        TextButton(
                                            onPressed: () =>
                                                Navigator.pop(c, false),
                                            child: const Text('Cancel')),
                                        TextButton(
                                            onPressed: () =>
                                                Navigator.pop(c, true),
                                            child: const Text('Start'))
                                      ]));
                          return ok == true;
                        },
                        onDismissed: (dir) async {
                          await _startWork();
                        },
                        child: SlideTransition(
                          position: _swipeOffset,
                          child: Container(
                            height: 72,
                            alignment: Alignment.center,
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            decoration: BoxDecoration(
                              color: Colors.green.shade600,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text('Swipe left to START',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16)),
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
    );
  }
}
