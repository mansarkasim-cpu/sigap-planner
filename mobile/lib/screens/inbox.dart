import 'package:flutter/material.dart';
import '../services/api.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:async';
import 'dart:io';
import 'dart:convert';
import '../config.dart';
import 'wo_detail.dart';
import '../services/retry_uploader.dart';
import '../widgets/app_drawer.dart';

class InboxScreen extends StatefulWidget {
  const InboxScreen({super.key});

  @override
  State<InboxScreen> createState() => _InboxScreenState();
}

class _InboxScreenState extends State<InboxScreen> {
  String? _token;
  bool loading = false;
  List<dynamic> assignments = [];
  Map<String, dynamic> tasksById = {};
  // lead-shift specific
  bool isLeadShift = false;
  List<String> leaderMemberIds = [];
  List<dynamic> pendingRealisasi = [];
  List<dynamic> monitoringWorkOrders = [];
  bool loadingPending = false;
  bool loadingMonitoring = false;
  String currentUserId = '';
  List<String> currentUserIdentifiers = [];
  String leaderGroupId = '';
  Map<String, String> assigneeNames = {};

  Future<void> loadAssignments() async {
    final base = API_BASE;
    final p = await SharedPreferences.getInstance();
    final token = p.getString('api_token') ?? '';
    final techId = p.getString('tech_id') ?? '';
    setState(() { loading = true; });
    try {
      final api = ApiClient(baseUrl: base, token: token);
      // if current user is leader, aggregate assignments for all group members
      List<dynamic> next = [];
      List<dynamic> nextTasks = [];
      if (isLeadShift) {
        // If we have a groupId for the leader, call the single endpoint for group assignments
        final allAssigns = <dynamic>[];
        final allTasks = <dynamic>[];
        if (leaderGroupId.isNotEmpty) {
          try {
            final url = '/assignments/for-group?groupId=${Uri.encodeComponent(leaderGroupId)}';
            final res = await api.get(url);
            if (res is Map) {
              final a = res['assignments'] ?? res['data'] ?? [];
              final t = res['tasks'] ?? [];
              if (a is List) allAssigns.addAll(a);
              if (t is List) allTasks.addAll(t);
            } else if (res is List) {
              allAssigns.addAll(res);
            }
              // Also include the leader's own assignments so a leader sees tasks assigned to them personally
              try {
                // try multiple identifier candidates for the leader (techId, and other identifiers discovered from /auth/me)
                final tried = <String>{};
                final candidates = <String>[];
                if (techId.isNotEmpty) candidates.add(techId);
                candidates.addAll(currentUserIdentifiers);
                for (final cand in candidates) {
                  final cid = cand.toString();
                  if (cid.isEmpty) continue;
                  if (tried.contains(cid)) continue;
                  tried.add(cid);
                  try {
                    // if candidate looks numeric (NIPP/personil id), try resolve to user UUID first
                    String resolvedCid = cid;
                    final numericRe = RegExp(r'^[0-9]+$');
                    if (numericRe.hasMatch(cid)) {
                      try {
                        final ures = await api.get('/users?nipp=${Uri.encodeComponent(cid)}');
                        final ulist = (ures is Map && ures['data'] is List) ? ures['data'] as List : (ures is List ? ures : []);
                        if (ulist.isNotEmpty) {
                          final first = ulist[0];
                          final uid = (first is Map) ? (first['id'] ?? first['user_id'] ?? '')?.toString() ?? '' : '';
                          if (uid.isNotEmpty) resolvedCid = uid;
                        }
                      } catch (e) {
                        // ignore and fallback to original candidate
                      }
                    }
                    final ownUrl = '/assignments/for-tech?user=${Uri.encodeComponent(resolvedCid)}';
                    final ownRes = await api.get(ownUrl);
                    if (ownRes == null) continue;
                    if (ownRes is Map) {
                      final a2 = ownRes['assignments'] ?? ownRes['data'] ?? [];
                      final t2 = ownRes['tasks'] ?? [];
                      if (a2 is List) allAssigns.addAll(a2);
                      if (t2 is List) allTasks.addAll(t2);
                    } else if (ownRes is List) {
                      allAssigns.addAll(ownRes);
                    }
                  } catch (e) {
                    // try next candidate
                  }
                }
              } catch (e) {
                debugPrint('failed to load leader personal assignments: $e');
              }
          } catch (e) {
            debugPrint('failed to load group assignments for group $leaderGroupId: $e');
          }
        } else {
          // fallback: include both group members and the leader's own id so leader sees their own tasks as well
          final memberIdsToFetch = <String>[];
          if (leaderMemberIds.isNotEmpty) memberIdsToFetch.addAll(leaderMemberIds);
          if (techId.isNotEmpty && !memberIdsToFetch.contains(techId)) memberIdsToFetch.add(techId);
          for (final memberId in memberIdsToFetch) {
            try {
              String resolvedMid = memberId.toString();
              final numericRe = RegExp(r'^[0-9]+$');
              if (numericRe.hasMatch(resolvedMid)) {
                try {
                  final ures = await api.get('/users?nipp=${Uri.encodeComponent(resolvedMid)}');
                  final ulist = (ures is Map && ures['data'] is List) ? ures['data'] as List : (ures is List ? ures : []);
                  if (ulist.isNotEmpty) {
                    final first = ulist[0];
                    final uid = (first is Map) ? (first['id'] ?? first['user_id'] ?? '')?.toString() ?? '' : '';
                    if (uid.isNotEmpty) resolvedMid = uid;
                  }
                } catch (_) {}
              }
              final url = '/assignments/for-tech?user=${Uri.encodeComponent(resolvedMid)}';
              final res = await api.get(url);
              if (res is Map) {
                final a = res['assignments'] ?? res['data'] ?? [];
                final t = res['tasks'] ?? [];
                if (a is List) allAssigns.addAll(a);
                if (t is List) allTasks.addAll(t);
              } else if (res is List) {
                allAssigns.addAll(res);
              }
            } catch (e) {
              debugPrint('failed to load assignments for member $memberId: $e');
            }
          }
        }
        // deduplicate by assignment id
        final seen = <String>{};
        for (final a in allAssigns) {
          try {
            final id = (a is Map) ? (a['id'] ?? a['_id'] ?? '') : a.toString();
            final sid = id.toString();
            if (sid.isEmpty) continue;
            if (!seen.contains(sid)) { seen.add(sid); next.add(a); }
          } catch (e) { }
        }
        // dedupe tasks by id
        final seenT = <String>{};
        for (final t in allTasks) {
          try {
            final id = (t is Map) ? (t['id'] ?? t['_id'] ?? t['external_id'] ?? '') : t.toString();
            final sid = id.toString();
            if (sid.isEmpty) continue;
            if (!seenT.contains(sid)) { seenT.add(sid); nextTasks.add(t); }
          } catch (e) {}
        }
      } else {
        // call dedicated endpoint that returns DEPLOYED assignments for this tech
        String resolvedTech = techId;
        final numericRe = RegExp(r'^[0-9]+$');
        if (resolvedTech.isNotEmpty && numericRe.hasMatch(resolvedTech)) {
          try {
            final ures = await api.get('/users?nipp=${Uri.encodeComponent(resolvedTech)}');
            final ulist = (ures is Map && ures['data'] is List) ? ures['data'] as List : (ures is List ? ures : []);
            if (ulist.isNotEmpty) {
              final first = ulist[0];
              final uid = (first is Map) ? (first['id'] ?? first['user_id'] ?? '')?.toString() ?? '' : '';
              if (uid.isNotEmpty) resolvedTech = uid;
            }
          } catch (_) {}
        }
        final url = resolvedTech != '' ? '/assignments/for-tech?user=${Uri.encodeComponent(resolvedTech)}' : '/assignments/for-tech';
        final res = await api.get(url);
        // the endpoint returns { assignments: [...], tasks: [...] }
        next = (res is Map && res['assignments'] != null) ? res['assignments'] : ((res is List) ? res : (res['data'] ?? res));
        nextTasks = (res is Map && res['tasks'] != null) ? (res['tasks'] as List) : [];
      }

      // build tasksById map for quick lookup
      final Map<String, dynamic> nextTasksMap = {};
      for (final t in nextTasks) {
        try {
          final id = (t['id'] ?? t['external_id'] ?? '').toString();
          if (id.isNotEmpty) nextTasksMap[id] = t;
        } catch (e) {}
      }

      // show simple notification if new assignments arrived
      final List<dynamic> filtered = (next is List) ? next : [];
      if (filtered.length > assignments.length) {
        final newCount = filtered.length - assignments.length;
        WidgetsBinding.instance.addPostFrameCallback((_) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('You have $newCount new assignment(s)')));
        });
      }
      setState(() { assignments = filtered; tasksById = nextTasksMap; });

      // Ensure task-level assignment lists match WO Detail by fetching /work-orders/{woId}/tasks
      try {
        final fetchedWo = <String>{};
        final woIds = <String>{};
        for (final a in filtered) {
          try {
            final awo = (a is Map) ? (a['wo'] ?? a['workorder'] ?? a['wo_id'] ?? {}) : {};
            String wid = '';
            if (awo is Map) wid = (awo['id'] ?? awo['doc_no'] ?? '').toString(); else wid = (a['wo_id'] ?? a['wo'] ?? '').toString();
            if (wid.isNotEmpty) woIds.add(wid);
          } catch (_) {}
        }
        bool anyUpdated = false;
        for (final wid in woIds) {
          if (fetchedWo.contains(wid)) continue;
          try {
            final tres = await api.get('/work-orders/${Uri.encodeComponent(wid)}/tasks');
            final tlist = (tres is List) ? tres : (tres is Map && tres['data'] != null ? tres['data'] : tres);
            if (tlist is List && tlist.isNotEmpty) {
              for (final t in tlist) {
                try {
                  final tid = (t is Map) ? ((t['id'] ?? t['external_id'] ?? '')?.toString() ?? '') : '';
                  if (tid.isNotEmpty) {
                    tasksById[tid] = t;
                    anyUpdated = true;
                  }
                } catch (_) {}
              }
            }
            fetchedWo.add(wid);
          } catch (e) {
            debugPrint('failed to fetch tasks for WO $wid: $e');
          }
        }
        if (anyUpdated) {
          try { setState(() { tasksById = Map<String, dynamic>.from(tasksById); }); } catch (_) {}
        }
      } catch (e) {
        debugPrint('failed to enrich tasksById from work-order endpoints: $e');
      }

      // build assignee name map for display: prefer embedded names, then batch-fetch users, fallback to per-user fetch
      try {
        final missing = <String>{};
        for (final a in filtered) {
          try {
            if (a is Map) {
              final candidate = (a['assignee'] ?? a['assigneeId'] ?? a['assignee_id'] ?? a['assigneeName'] ?? a['assignee_name']);
              if (candidate is Map) {
                final id = (candidate['id'] ?? candidate['user_id'] ?? candidate['nipp'] ?? '')?.toString() ?? '';
                final name = (candidate['name'] ?? candidate['full_name'] ?? candidate['displayName'] ?? candidate['personil']?['name'] ?? '')?.toString() ?? '';
                if (id.isNotEmpty && name.isNotEmpty) {
                  assigneeNames[id] = name;
                } else if (id.isNotEmpty && !assigneeNames.containsKey(id)) {
                  missing.add(id);
                } else if (name.isNotEmpty) {
                  assigneeNames[name] = name;
                }
              } else if (candidate != null) {
                final s = candidate.toString();
                if (s.isNotEmpty && !assigneeNames.containsKey(s)) missing.add(s);
              }
            }
          } catch (e) {}
        }

        if (missing.isNotEmpty) {
          try {
            // try a batch fetch first (some backends support `/users?ids=1,2`)
            final allIds = missing.toList().join(',');
            final batchRes = await api.get('/users?ids=${Uri.encodeComponent(allIds)}');

            // Normalize batch response into a list of user objects regardless of shape
            List<dynamic> usersList = [];
            if (batchRes is List) {
              usersList = batchRes;
            } else if (batchRes is Map) {
              if (batchRes['data'] is List) {
                usersList = batchRes['data'];
              } else {
                // Some APIs return a map of id->user object
                try {
                  for (final entry in batchRes.entries) {
                    final k = entry.key?.toString() ?? '';
                    final v = entry.value;
                    if (k.isNotEmpty && (v is Map)) usersList.add(v..['id'] = (v['id'] ?? k));
                  }
                } catch (_) {}
              }
            }

            if (usersList.isNotEmpty) {
              for (final u in usersList) {
                try {
                  final id = (u is Map ? (u['id'] ?? u['user_id'] ?? u['nipp'] ?? '') : u.toString())?.toString() ?? '';
                  final name = (u is Map ? (u['name'] ?? u['personil']?['name'] ?? u['full_name'] ?? u['email'] ?? '') : u.toString())?.toString() ?? '';
                  if (id.isNotEmpty) assigneeNames[id] = name.isNotEmpty ? name : id;
                } catch (e) {}
              }
              missing.removeWhere((id) => assigneeNames.containsKey(id));
            }
          } catch (e) {
            // batch fetch failed — we'll fall back to per-id fetch below
          }
        }

        // fetch remaining missing ids one by one
        for (final id in missing) {
          try {
            final ures = await api.get('/users/${Uri.encodeComponent(id)}');
            final user = (ures is Map && ures['data'] != null) ? ures['data'] : ures;
            String uname = '';
            if (user is Map) {
              uname = (user['name'] ?? user['personil']?['name'] ?? user['full_name'] ?? user['email'] ?? '').toString();
            } else if (ures is String) {
              uname = ures;
            }
            assigneeNames[id] = (uname.isNotEmpty) ? uname : id;
          } catch (e) {
            assigneeNames[id] = id;
          }
        }
      } catch (e) {
        debugPrint('failed to build assignee name map: $e');
      }

      // Make sure UI updates after we've populated the assignee name cache
      try { setState(() {}); } catch (_) {}
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to load: $e')));
    } finally {
      setState(() { loading = false; });
    }
  }

  // Derive a simple display status for a task based on its assignment group or task object
  String _deriveTaskStatusFromGroup(List<dynamic> group, dynamic task) {
    try {
      // Prefer authoritative task-level counters/flags when available
      if (task is Map) {
        final realCount = int.tryParse((task['realisasi_count'] ?? 0).toString()) ?? 0;
        final pendingCount = int.tryParse((task['pending_realisasi_count'] ?? 0).toString()) ?? 0;
        final hasRealisasiFlag = (task['has_realisasi'] == true) || (realCount > 0);
        final hasPendingFlag = (task['has_pending'] == true) || (pendingCount > 0);

        if (hasRealisasiFlag) return 'Realisasi';
        if (hasPendingFlag) return 'Pending';

        // If explicit counters/flags are absent, fall back to inspecting any realisasi list
        final r = (task['realisasi'] ?? task['realisasis'] ?? task['realisasi_list'] ?? task['realisasi_items']);
        if (r is List && r.isNotEmpty) {
          for (final e in r) {
            try {
              final st = (e is Map) ? ((e['status'] ?? e['state'] ?? e['verification_status'] ?? '').toString().toUpperCase()) : '';
              if (st.isNotEmpty && (st.contains('APPROV') || st.contains('VERIF') || st.contains('COMP') || st.contains('DONE') || st.contains('OK'))) return 'Realisasi';
            } catch (_) {}
          }
          return 'Pending';
        }
      }

      // Fallback: inspect assignment-level statuses; if any 'COMPLETED' or 'VERIFIED' treat as Realisasi
      for (final a in group) {
        try {
          if (a is Map) {
            final s = (a['status'] ?? a['state'] ?? '').toString().toUpperCase();
            if (s.isNotEmpty && (s.contains('COMP') || s.contains('VERIF') || s.contains('DONE'))) return 'Realisasi';
            if (s.isNotEmpty && (s.contains('PEND') || s.contains('SUBMIT') || s.contains('WAIT'))) return 'Pending';
          }
        } catch (_) {}
      }

      // Default when nothing done yet
      return 'Belum Realisasi';
    } catch (e) {
      return 'Belum Realisasi';
    }
  }

  Color _statusColorLocal(String s) {
    final u = s.toUpperCase();
    // ensure "Belum Realisasi" matches the grey branch before matching 'REALISASI'
    if (u.contains('BELUM') || u.contains('BELUM REALISASI')) return Colors.grey.shade300;
    if (u.contains('PENDING')) return Colors.orange.shade200;
    if (u.contains('REALISASI')) return Colors.green.shade100;
    return Colors.grey.shade300;
  }

  @override
  void initState() {
    super.initState();
    _loadPrefs();
    // start background uploader to retry queued realisasi
    RetryUploader.instance.start(base: API_BASE);
  }

  Timer? _pollTimer;

  @override
  void dispose() {
    _pollTimer?.cancel();
    RetryUploader.instance.stop();
    super.dispose();
  }

  Future<void> _loadPrefs() async {
    final p = await SharedPreferences.getInstance();
    setState(() {
      _token = p.getString('api_token') ?? '';
    });
    // detect current user role
    try {
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      final me = await api.get('/auth/me');
      final user = (me is Map && me['data'] != null) ? me['data'] : me;
      final role = (user is Map) ? (user['role'] ?? user['roles'] ?? '') : '';
      final String roleStr = role is String ? role : (role is List && role.isNotEmpty ? role[0] : '');

      // Determine leader status:
      // - legacy: if role is 'lead_shift' keep behavior
      // - new: if role is 'technician', consider leader if user id matches shift_group.leader
      String userId = '';
      final ids = <String>[];
      if (user is Map) {
        userId = (user['id'] ?? user['user_id'] ?? '')?.toString() ?? '';
        try {
          final nipp = (user['nipp'] ?? user['nip'] ?? user['username'] ?? '')?.toString() ?? '';
          if (nipp.isNotEmpty) ids.add(nipp);
        } catch (_) {}
        try {
          final personilId = (user['personil'] is Map ? (user['personil']['id'] ?? user['personil']['personil_id']) : null)?.toString() ?? '';
          if (personilId.isNotEmpty) ids.add(personilId);
        } catch (_) {}
        try { if (userId.isNotEmpty) ids.add(userId); } catch (_) {}
      }

      bool leaderFlag = false;
      List<String> members = [];
      if (roleStr.toString().toLowerCase().contains('lead')) {
        leaderFlag = true;
      } else if (roleStr.toString().toLowerCase() == 'technician') {
        try {
          final groupsRes = await api.get('/shift-groups');
          final groups = groupsRes is List ? groupsRes : (groupsRes is Map && groupsRes['data'] != null ? groupsRes['data'] : groupsRes);
          if (groups is List) {
            for (final g in groups) {
              try {
                  final leadRaw = (g is Map) ? (g['leader'] ?? '') : '';
                  String leadId = '';
                  if (leadRaw is Map) {
                    leadId = (leadRaw['id'] ?? leadRaw['user_id'] ?? leadRaw['nipp'] ?? leadRaw['personil']?['id'] ?? leadRaw['personil']?['personil_id'] ?? '').toString();
                  } else {
                    leadId = leadRaw?.toString() ?? '';
                  }
                  if (leadId.isNotEmpty && (leadId == userId || ids.contains(leadId))) {
                  leaderFlag = true;
                  // record this group's id and gather members
                  try {
                    final gid = (g is Map) ? (g['id'] ?? g['group_id'] ?? g['shift_group_id'] ?? '') : '';
                    leaderGroupId = gid?.toString() ?? '';
                  } catch (_) {}
                  final mem = (g is Map && g['members'] is List) ? List.from(g['members']) : [];
                  for (final m in mem) {
                    try {
                      String sid = '';
                      if (m is Map) {
                        sid = (m['id'] ?? m['user_id'] ?? m['nipp'] ?? m['personil']?['id'] ?? '').toString() ?? '';
                      } else {
                        sid = m?.toString() ?? '';
                      }
                      if (sid.isNotEmpty) members.add(sid);
                    } catch (_) {}
                  }
                }
              } catch (e) {}
            }
          }
        } catch (e) {
          debugPrint('failed to check shift group leaders: $e');
        }
      }

      // dedupe members
      final uniq = <String>{};
      final deduped = <String>[];
      for (final m in members) { if (!uniq.contains(m)) { uniq.add(m); deduped.add(m); } }
      // dedupe current user identifiers
      final uniqIds = <String>{};
      final dedupedIds = <String>[];
      for (final v in ids) { if (v.toString().isNotEmpty && !uniqIds.contains(v)) { uniqIds.add(v); dedupedIds.add(v); } }
      setState(() { isLeadShift = leaderFlag; leaderMemberIds = deduped; currentUserId = userId; currentUserIdentifiers = dedupedIds; });
    } catch (e) {
      debugPrint('failed to determine user role: $e');
    }
    // start periodic polling for new assignments
    _pollTimer?.cancel();
    _pollTimer = Timer.periodic(const Duration(seconds: 20), (_) async {
      await loadAssignments();
    });
    // load initial assignments for this technician
    await loadAssignments();
    if (isLeadShift) {
      await _loadPendingRealisasi();
      await _loadMonitoringWorkOrders();
    }
  }

  Future<void> _loadPendingRealisasi() async {
    setState(() { loadingPending = true; });
    try {
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      final res = await api.get('/realisasi/pending');
      final items = res is List ? res : (res['data'] ?? res);
      setState(() { pendingRealisasi = items ?? []; });
    } catch (e) {
      debugPrint('load pending realisasi failed: $e');
    } finally {
      setState(() { loadingPending = false; });
    }
  }

  Future<void> _loadMonitoringWorkOrders() async {
    setState(() { loadingMonitoring = true; });
    try {
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      final res = await api.get('/work-orders?q=&page=1&pageSize=1000');
      final rows = res is Map ? (res['data'] ?? res) : res;
      final list = (rows is List) ? rows : [];
      // filter for DEPLOYED or IN_PROGRESS
      final filtered = list.where((w) {
        final s = (w is Map) ? ((w['status'] ?? w['raw']?['status']) ?? '') : '';
        final ss = s.toString().toUpperCase().replaceAll('-', '_');
        return ss == 'DEPLOYED' || ss == 'IN_PROGRESS';
      }).toList();

      // If current user is a shift leader, restrict monitoring list to WOs assigned to the group
      List<dynamic> finalList = filtered;
      if (isLeadShift) {
        // build allowed WO id set from assignments for the group (prefer server endpoint when group id known)
        final allowedWo = <String>{};
        if (leaderGroupId.isNotEmpty) {
          try {
            final ares = await api.get('/assignments/for-group?groupId=${Uri.encodeComponent(leaderGroupId)}');
            final al = (ares is Map && ares['assignments'] is List) ? ares['assignments'] as List : (ares is List ? ares : []);
            for (final asg in al) {
              try {
                final awo = (asg is Map) ? (asg['wo'] ?? asg['workorder'] ?? asg['work_order'] ?? asg['wo_id'] ?? {}) : {};
                String wid = '';
                if (awo is Map) wid = (awo['id'] ?? awo['doc_no'] ?? '').toString(); else wid = asg['wo_id']?.toString() ?? '';
                if (wid.isNotEmpty) allowedWo.add(wid);
              } catch (e) {}
            }
          } catch (e) {
            debugPrint('failed to load group assignments for monitoring: $e');
          }
        }

        // fallback: use already-loaded assignments state (could have been loaded earlier)
        if (allowedWo.isEmpty && assignments.isNotEmpty) {
          for (final asg in assignments) {
            try {
              final awo = (asg is Map) ? (asg['wo'] ?? asg['workorder'] ?? asg['wo_id'] ?? {}) : {};
              String wid = '';
              if (awo is Map) wid = (awo['id'] ?? awo['doc_no'] ?? '').toString(); else wid = asg['wo_id']?.toString() ?? '';
              if (wid.isNotEmpty) allowedWo.add(wid);
            } catch (e) {}
          }
        }

        if (allowedWo.isNotEmpty) {
          finalList = filtered.where((w) {
            try {
              if (w is Map) {
                final wid = (w['id'] ?? w['doc_no'] ?? '').toString();
                return wid.isNotEmpty && allowedWo.contains(wid);
              }
            } catch (e) {}
            return false;
          }).toList();
        } else {
          // if no allowed WO info, hide all (safer) to avoid showing unrelated WOs
          finalList = [];
        }
      }

      setState(() { monitoringWorkOrders = finalList; });
    } catch (e) {
      debugPrint('load monitoring workorders failed: $e');
    } finally {
      setState(() { loadingMonitoring = false; });
    }
  }

  Future<void> _approvePending(String id) async {
    try {
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      await api.post('/realisasi/$id/approve', {});
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Realisasi approved')));
      // remove the approved item from the local pending list immediately
      setState(() {
        pendingRealisasi.removeWhere((e) {
          try {
            if (e is Map) {
              final cand = (e['id'] ?? e['_id'] ?? e['realisasi_id'] ?? e['realisasiId'] ?? e['id_realisasi'] ?? '').toString();
              return cand == id;
            }
            return e.toString() == id;
          } catch (_) {
            return false;
          }
        });
      });
      // refresh monitoring list to reflect any status updates (IN_PROGRESS items will still appear)
      await _loadMonitoringWorkOrders();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Approve failed: $e')));
    }
  }

  Widget _buildMonitoringSection() {
    if (loadingMonitoring) return const Padding(padding: EdgeInsets.all(12), child: CircularProgressIndicator());
    if (monitoringWorkOrders.isEmpty) return const Padding(padding: EdgeInsets.symmetric(vertical: 8), child: Text('No monitoring work orders', style: TextStyle(color: Colors.grey)));
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: monitoringWorkOrders.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (c, i) {
        final w = monitoringWorkOrders[i];
        final title = (w is Map) ? (w['doc_no'] ?? w['id'] ?? 'WO') : 'WO';
        final prog = (w is Map) ? (w['progress'] ?? 0) : 0;
        final start = (w is Map) ? (w['start_date'] ?? w['raw']?['start_date'] ?? w['start'] ?? '') : '';
        final end = (w is Map) ? (w['end_date'] ?? w['raw']?['end_date'] ?? w['end'] ?? '') : '';
        final desc = (w is Map) ? (w['description'] ?? w['raw']?['description'] ?? '') : '';
        final asset = (w is Map) ? (w['asset_name'] ?? w['asset'] ?? w['raw']?['asset_name'] ?? '') : '';
        final techName = (w is Map) ? (w['assigned_to'] ?? w['technician'] ?? w['raw']?['assigned_to']?['name'] ?? '') : '';
        final location = (w is Map) ? (w['vendor_cabang'] ?? w['raw']?['vendor_cabang'] ?? w['raw']?['site'] ?? '') : '';
        final woType = (w is Map) ? (w['type'] ?? w['work_order_type'] ?? w['wo_type'] ?? w['type_name'] ?? w['raw']?['type'] ?? '') : '';
        final percent = (((prog ?? 0) as num) * 100).round();
        final progressValue = (prog is num) ? (prog).toDouble().clamp(0.0, 1.0) : double.tryParse(prog?.toString() ?? '0') ?? 0.0;
        return Card(
          margin: const EdgeInsets.symmetric(vertical: 0, horizontal: 0),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Expanded(child: Text(title.toString(), style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold))),
                Text('$percent%', style: const TextStyle(color: Colors.grey)),
              ]),
              const SizedBox(height: 6),
              if (desc.isNotEmpty) Text(desc.toString(), maxLines: 2, overflow: TextOverflow.ellipsis),
              const SizedBox(height: 6),
              Row(children: [
                if (asset != null && asset.toString().isNotEmpty)
                  Expanded(child: Row(children: [const Icon(Icons.build, size: 14, color: Colors.grey), const SizedBox(width: 6), Flexible(child: Text(asset.toString(), style: const TextStyle(fontSize: 12, color: Colors.grey), maxLines: 1, overflow: TextOverflow.ellipsis))])),
                const SizedBox(width: 12),
                if (woType != null && woType.toString().isNotEmpty)
                  Padding(padding: const EdgeInsets.only(right: 8.0), child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 120), child: Row(children: [const Icon(Icons.category, size: 14, color: Colors.grey), const SizedBox(width: 6), Flexible(child: Text(woType.toString(), style: const TextStyle(fontSize: 12, color: Colors.grey), maxLines: 1, overflow: TextOverflow.ellipsis))]))),
                const SizedBox(width: 12),
                if (techName != null && techName.toString().isNotEmpty)
                  ConstrainedBox(constraints: const BoxConstraints(maxWidth: 120), child: Row(children: [const Icon(Icons.person, size: 14, color: Colors.grey), const SizedBox(width: 6), Flexible(child: Text(techName.toString(), style: const TextStyle(fontSize: 12, color: Colors.grey), maxLines: 1, overflow: TextOverflow.ellipsis))])),
              ]),
              const SizedBox(height: 8),
              LinearProgressIndicator(value: progressValue),
              const SizedBox(height: 8),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Expanded(
                  child: Row(children: [
                    if (start != null && start.toString().isNotEmpty) ...[const Icon(Icons.event, size: 14, color: Colors.grey), const SizedBox(width: 6), Flexible(child: Text(_formatUtcDisplay(start), style: const TextStyle(fontSize: 12, color: Colors.grey), overflow: TextOverflow.ellipsis))],
                    const SizedBox(width: 12),
                    if (end != null && end.toString().isNotEmpty) ...[const Icon(Icons.event_busy, size: 14, color: Colors.grey), const SizedBox(width: 6), Flexible(child: Text(_formatUtcDisplay(end), style: const TextStyle(fontSize: 12, color: Colors.grey), overflow: TextOverflow.ellipsis))],
                  ]),
                ),
                Row(children: [
                  if (location != null && location.toString().isNotEmpty) ...[const Icon(Icons.location_on, size: 14, color: Colors.grey), const SizedBox(width: 6), Text(location.toString(), style: const TextStyle(fontSize: 12, color: Colors.grey))],
                  const SizedBox(width: 12),
                  TextButton(onPressed: () async {
                      final woIdVal = (w is Map) ? (w['id'] ?? w['doc_no'] ?? '').toString() : '';
                      final related = assignments.where((a) {
                        try {
                          final aw = a['wo'] ?? a['wo_id'] ?? a['work_order'] ?? {};
                          final aWoId = (aw is Map) ? (aw['id'] ?? aw['doc_no'] ?? '') : (a['wo_id'] ?? a['wo'] ?? '');
                          return aWoId.toString() == woIdVal;
                        } catch (_) {
                          return false;
                        }
                      }).toList();

                      await showModalBottomSheet(
                        context: context,
                        isScrollControlled: true,
                        shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(12))),
                        builder: (c) {
                          return DraggableScrollableSheet(
                            expand: false,
                            initialChildSize: 0.7,
                            minChildSize: 0.4,
                            maxChildSize: 0.95,
                            builder: (_, controller) {
                              return SingleChildScrollView(
                                controller: controller,
                                padding: const EdgeInsets.all(16),
                                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                                    Expanded(child: Text(title.toString(), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold))),
                                    IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(c)),
                                  ]),
                                  const SizedBox(height: 8),
                                  if(desc.isNotEmpty) Text('Description: $desc'),
                                  if(woType != null && woType.toString().isNotEmpty) Text('Type: $woType'),
                                  Text('Start: ${_formatUtcDisplay(start)}'),
                                  Text('End: ${_formatUtcDisplay(end)}'),
                                  if(asset.toString().isNotEmpty) Text('Asset: $asset'),
                                  if(techName.toString().isNotEmpty) Text('Technician: $techName'),
                                  if(location.toString().isNotEmpty) Text('Location: $location'),
                                  const SizedBox(height: 8),
                                  Text('Progress: $percent%'),
                                  const SizedBox(height: 12),
                                  const Text('Tasks', style: TextStyle(fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 8),
                                  if (related.isEmpty) const Text('No tasks/assignments found', style: TextStyle(color: Colors.grey)),
                                  if (related.isNotEmpty)
                                    Column(crossAxisAlignment: CrossAxisAlignment.start, children: related.map<Widget>((ra) {
                                      final tId = (ra['task_id'] ?? ra['task'] ?? '')?.toString() ?? '';
                                      final t = tId.isNotEmpty ? (tasksById[tId] ?? {}) : (ra['task'] ?? {});
                                      final tName = (t is Map) ? (t['name'] ?? t['task_name'] ?? '') : (ra['task_name'] ?? '');
                                      final assDisplay = _getAssigneeDisplay(ra);
                                      final dur = (t is Map) ? (t['duration_min'] ?? t['task_duration'] ?? t['duration'] ?? '') : '';
                                      return Padding(
                                        padding: const EdgeInsets.symmetric(vertical: 6.0),
                                        child: Row(children: [
                                          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                                            // show task name (or assignee if name missing)
                                            Text(
                                              tName.toString().isNotEmpty ? tName.toString() : (assDisplay.isNotEmpty ? assDisplay : '—'),
                                              style: const TextStyle(fontWeight: FontWeight.w600),
                                            ),
                                            // show assigned technician under the task name
                                            if (assDisplay.isNotEmpty && (tName == null || tName.toString().isEmpty))
                                              Padding(padding: const EdgeInsets.only(top:4.0), child: Text(assDisplay, style: const TextStyle(color: Colors.grey, fontSize: 12))),
                                            if (assDisplay.isNotEmpty && (tName != null && tName.toString().isNotEmpty))
                                              Padding(padding: const EdgeInsets.only(top:4.0), child: Text(assDisplay, style: const TextStyle(color: Colors.grey, fontSize: 12))),
                                            if (dur != null && dur.toString().isNotEmpty)
                                              Padding(padding: const EdgeInsets.only(top:4.0), child: Text('Duration: ${dur.toString()} min', style: const TextStyle(color: Colors.grey, fontSize: 12))),
                                          ])),
                                        ]),
                                      );
                                    }).toList()),
                                  const SizedBox(height: 24),
                                ]),
                              );
                            }
                          );
                        }
                      );
                    }, child: const Text('Details')),
                ])
              ])
            ]),
          ),
        );
      },
    );
  }

  Widget _buildPendingSection() {
    if (loadingPending) return const Padding(padding: EdgeInsets.all(12), child: CircularProgressIndicator());
    if (pendingRealisasi.isEmpty) return const Padding(padding: EdgeInsets.symmetric(vertical: 8), child: Text('No pending realisasi', style: TextStyle(color: Colors.grey)));
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: pendingRealisasi.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (c, i) {
        final it = pendingRealisasi[i];
        final woDoc = it['woDoc'] ?? it['woId'] ?? it['wo'] ?? '';
        final notes = (it['notes'] ?? '').toString();
        final photo = (it['photoUrl'] ?? '').toString();
        final tech = (it['technician'] ?? it['tech'] ?? it['user'] ?? '')?.toString() ?? '';
        final start = it['start_date'] ?? it['start'] ?? it['scheduledAt'] ?? '';
        final end = it['end_date'] ?? it['end'] ?? '';
        final location = it['location'] ?? it['site'] ?? it['vendor_cabang'] ?? '';
        return Card(
          margin: const EdgeInsets.symmetric(vertical: 0, horizontal: 0),
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Expanded(child: Text('WO: ${woDoc}', style: const TextStyle(fontWeight: FontWeight.bold))),
                if (tech.isNotEmpty) Text(tech, style: const TextStyle(color: Colors.grey)),
              ]),
              const SizedBox(height: 8),
              if (notes.isNotEmpty) Text('Notes: $notes'),
              if (photo.isNotEmpty) ...[
                const SizedBox(height: 8),
                GestureDetector(
                  onTap: () {
                    showDialog(context: context, builder: (c) => Dialog(
                      child: GestureDetector(
                        onTap: () => Navigator.pop(c),
                        child: InteractiveViewer(child: _buildImage(photo)),
                      ),
                    ));
                  },
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: SizedBox(
                      width: 140,
                      height: 96,
                      child: _buildImage(photo, width: 140, height: 96, fit: BoxFit.cover),
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 8),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Expanded(
                  child: Row(children: [
                    if (start != null && start.toString().isNotEmpty) ...[const Icon(Icons.event, size: 14, color: Colors.grey), const SizedBox(width: 6), Flexible(child: Text(_formatUtcDisplay(start), style: const TextStyle(fontSize: 12, color: Colors.grey), overflow: TextOverflow.ellipsis))],
                    const SizedBox(width: 12),
                    if (end != null && end.toString().isNotEmpty) ...[const Icon(Icons.event_busy, size: 14, color: Colors.grey), const SizedBox(width: 6), Flexible(child: Text(_formatUtcDisplay(end), style: const TextStyle(fontSize: 12, color: Colors.grey), overflow: TextOverflow.ellipsis))],
                  ]),
                ),
                Row(children: [
                  if (location != null && location.toString().isNotEmpty) ...[const Icon(Icons.location_on, size: 14, color: Colors.grey), const SizedBox(width: 6), Text(location.toString(), style: const TextStyle(fontSize: 12, color: Colors.grey))],
                  const SizedBox(width: 12),
                  SizedBox(
                    width: 160,
                    child: ElevatedButton(onPressed: () async {
                    final confirmed = await showDialog<bool>(
                      context: context,
                      builder: (c) => AlertDialog(
                        title: const Text('Confirm Approve'),
                        content: const Text('Approve this realisasi? This action will create a realisasi and update work order status.'),
                        actions: [TextButton(onPressed: () => Navigator.pop(c, false), child: const Text('Cancel')), TextButton(onPressed: () => Navigator.pop(c, true), child: const Text('Approve'))],
                      ),
                    );
                    if (confirmed == true) await _approvePending(it['id'].toString());
                  }, child: const Text('Approve')),
                  )
                ])
              ])
            ]),
          ),
        );
      },
    );
  }

  Widget _sectionHeader(String title, [int count = 0]) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        children: [
          Expanded(child: Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold))),
          if (count > 0)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(color: Theme.of(context).colorScheme.primary, borderRadius: BorderRadius.circular(12)),
              child: Text(count.toString(), style: const TextStyle(color: Colors.white, fontSize: 12)),
            ),
        ],
      ),
    );
  }

  Widget _buildImage(String src, {double? width, double? height, BoxFit? fit}) {
    final s = src.toString();
    if (s.trim().isEmpty) return const SizedBox.shrink();
    final uri = Uri.tryParse(s);
    try {
      if (uri != null && uri.hasScheme) {
        final scheme = uri.scheme.toLowerCase();
        if (scheme == 'http' || scheme == 'https') return Image.network(s, width: width, height: height, fit: fit);
        if (scheme == 'file') return Image.file(File(uri.toFilePath()), width: width, height: height, fit: fit);
      }
    } catch (_) {}
    // no scheme — treat as relative path on server
    final base = API_BASE.endsWith('/') ? API_BASE.substring(0, API_BASE.length - 1) : API_BASE;
    final path = s.startsWith('/') ? s : '/$s';
    // if API_BASE includes '/api' but uploads are served from the root '/uploads',
    // prefer the root base when path starts with '/uploads'
    if (base.endsWith('/api') && path.startsWith('/uploads')) {
      final rootBase = base.replaceFirst(RegExp(r'/api$'), '');
      return Image.network(rootBase + path, width: width, height: height, fit: fit);
    }
    return Image.network(base + path, width: width, height: height, fit: fit);
  }

  String _formatUtcDisplay(dynamic raw) {
    if (raw == null) return '-';
    final s = raw.toString().trim();
    final sqlRx = RegExp(r'^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?\$');
    final m = sqlRx.firstMatch(s);
    DateTime? dt;
    if (m != null) {
      final yy = int.parse(m.group(1)!);
      final mm = int.parse(m.group(2)!);
      final dd = int.parse(m.group(3)!);
      final hh = m.group(4) != null ? int.parse(m.group(4)!) : 0;
      final mi = m.group(5) != null ? int.parse(m.group(5)!) : 0;
      final ss = m.group(6) != null ? int.parse(m.group(6)!) : 0;
      dt = DateTime.utc(yy, mm, dd, hh, mi, ss);
    } else {
      try {
        dt = DateTime.parse(s);
      } catch (_) {
        return '-';
      }
    }
    final dtUtc = dt.toUtc();
    String pad(int n) => n.toString().padLeft(2, '0');
    return '${pad(dtUtc.day)}/${pad(dtUtc.month)}/${dtUtc.year} ${pad(dtUtc.hour)}:${pad(dtUtc.minute)}';
  }

  // Resolve a human-friendly assignee display name from an assignment or raw assignee value.
  // Uses the `assigneeNames` cache when possible and tolerates multiple API shapes.
  String _getAssigneeDisplay(dynamic ra) {
      try {
        // Quick checks for explicit name fields on the root assignment object
        if (ra is Map) {
          final explicit = (ra['assigneeName'] ?? ra['assignee_name'] ?? ra['assignee_display'] ?? ra['assigneeLabel'] ?? ra['label'])?.toString() ?? '';
          if (explicit.isNotEmpty) return explicit;

          // If there is a direct assignee id field, prefer resolving it from cache
          final directId = (ra['assigneeId'] ?? ra['assignee_id'] ?? ra['assignee_uuid'] ?? ra['assignee'])?.toString() ?? '';
          if (directId.isNotEmpty && !(directId.startsWith('{') || directId.startsWith('['))) {
            if (assigneeNames.containsKey(directId)) return assigneeNames[directId]!;
            return directId;
          }
        }

        

        // Fallback: accept multiple possible keys for assignees
        dynamic candidate;
        if (ra is Map) {
          candidate = ra['assignees'] ?? ra['assignee_list'] ?? ra['assignee'] ?? ra['assigneeName'] ?? ra['assignee_name'] ?? ra['assignee_id'] ?? ra['assigneeId'] ?? '';
        } else {
          candidate = ra;
        }
        if (candidate == null) return '';

        // If candidate is a JSON-encoded string, try to decode and re-process
        if (candidate is String) {
          final sraw = candidate.trim();
          if (sraw.isEmpty) return '';
          if (sraw.startsWith('{') || sraw.startsWith('[')) {
            try {
              final dec = jsonDecode(sraw);
              return _getAssigneeDisplay(dec);
            } catch (_) {}
          }
        }

        // List handling: map each element to name
        if (candidate is List) {
          final parts = <String>[];
          for (final c in candidate) {
            if (c == null) continue;
            if (c is Map) {
              final id = (c['id'] ?? c['user_id'] ?? c['nipp'] ?? c['nipp_id'] ?? '')?.toString() ?? '';
              final name = (c['name'] ?? c['full_name'] ?? c['displayName'] ?? c['personil']?['name'] ?? c['label'] ?? '')?.toString() ?? '';
              if (name.isNotEmpty) parts.add(name);
              else if (id.isNotEmpty) parts.add(assigneeNames.containsKey(id) ? assigneeNames[id]! : id);
              else parts.add(c.toString());
            } else {
              final s = c.toString();
              if (s.isEmpty) continue;
              parts.add(assigneeNames.containsKey(s) ? assigneeNames[s]! : s);
            }
          }
          return parts.join(', ');
        }

        // Map object candidate
        if (candidate is Map) {
          final id = (candidate['id'] ?? candidate['user_id'] ?? candidate['nipp'] ?? candidate['nipp_id'] ?? '')?.toString() ?? '';
          final name = (candidate['name'] ?? candidate['full_name'] ?? candidate['displayName'] ?? candidate['personil']?['name'] ?? candidate['label'] ?? '')?.toString() ?? '';
          if (id.isNotEmpty && name.isNotEmpty) {
            assigneeNames[id] = name;
            return name;
          }
          if (name.isNotEmpty) return name;
          if (id.isNotEmpty && assigneeNames.containsKey(id)) return assigneeNames[id]!;
          if (id.isNotEmpty) return id;
          return candidate.toString();
        }

        // Primitive string candidate (single id or name)
        var s = candidate.toString();
        if (s.isEmpty) return '';
        if (s.contains(',') || s.contains(';')) {
          final parts = s.split(RegExp(r'[;,]')).map((p) => p.trim()).where((p) => p.isNotEmpty).toList();
          final resolved = parts.map((p) => assigneeNames.containsKey(p) ? assigneeNames[p]! : p).toList();
          return resolved.join(', ');
        }
        if (assigneeNames.containsKey(s)) return assigneeNames[s]!;
        return s;
      } catch (e) {
        return '';
      }
    }

  Widget _buildAssignmentsGrouped() {
    if (loading) return const Center(child: CircularProgressIndicator());
    if (assignments.isEmpty) return const Padding(padding: EdgeInsets.symmetric(vertical: 8), child: Text('No assignments', style: TextStyle(color: Colors.grey)));

    // group assignments by work order id
    final Map<String, List<dynamic>> groups = {};
    for (final a in assignments) {
      try {
        final wo = a['wo'] ?? a['wo_id'] ?? a['work_order'] ?? {};
        final woId = (wo is Map) ? (wo['id'] ?? wo['doc_no'] ?? '').toString() : (a['wo_id'] ?? a['wo'] ?? '').toString();
        final key = woId.isNotEmpty ? woId : '__no_wo__';
        groups.putIfAbsent(key, () => []).add(a);
      } catch (_) {
        groups.putIfAbsent('__no_wo__', () => []).add(a);
      }
    }

    final entries = groups.entries.toList();

    return ListView.separated(
      padding: const EdgeInsets.only(bottom: 24),
      itemCount: entries.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (c, gi) {
        final woKey = entries[gi].key;
        final items = entries[gi].value;
        // derive a display title from first assignment's wo
        final first = items.isNotEmpty ? items.first : null;
        final wo = first != null ? (first['wo'] ?? first['wo_id'] ?? {}) : {};
        final title = (wo is Map) ? (wo['doc_no'] ?? wo['id'] ?? woKey) : woKey;

        // derive WO-level fields for header display
        final assetName = (wo is Map) ? (wo['asset_name'] ?? wo['asset'] ?? wo['raw']?['asset_name'] ?? '') : '';
        final status = (wo is Map) ? (wo['status'] ?? wo['raw']?['status'] ?? '') : '';
        final startField = (wo is Map) ? (wo['start_date'] ?? wo['raw']?['start_date'] ?? wo['start']) : null;
        final endField = (wo is Map) ? (wo['end_date'] ?? wo['raw']?['end_date'] ?? wo['end']) : null;
        final locationField = (wo is Map) ? (wo['vendor_cabang'] ?? wo['raw']?['vendor_cabang'] ?? wo['raw']?['site'] ?? '') : '';
        final prog = (wo is Map) ? (wo['progress'] ?? 0) : 0;
        final percent = ((prog is num) ? (prog * 100).round() : (int.tryParse(prog?.toString() ?? '0') ?? 0));
        final woType = (wo is Map) ? (wo['type'] ?? wo['work_order_type'] ?? wo['wo_type'] ?? wo['type_name'] ?? wo['raw']?['type'] ?? '') : '';

        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 0),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Expanded(child: Text(title.toString(), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold))),
                Text('${items.length} assignment(s)', style: const TextStyle(color: Colors.grey)),
              ]),
              const SizedBox(height: 8),
              // WO info row (constrained to avoid overflow on narrow screens)
              Row(children: [
                if (assetName != null && assetName.toString().isNotEmpty)
                  Expanded(child: Text(assetName.toString(), style: const TextStyle(color: Colors.black87), maxLines: 1, overflow: TextOverflow.ellipsis)),
                if (woType != null && woType.toString().isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(left: 8.0),
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 120),
                      child: Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(6)), child: Text(woType.toString(), style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12), overflow: TextOverflow.ellipsis, maxLines: 1)),
                    ),
                  ),
                if (status != null && status.toString().isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(left: 8.0),
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 100),
                      child: Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(6)), child: Text(status.toString(), style: const TextStyle(fontWeight: FontWeight.w600), overflow: TextOverflow.ellipsis, maxLines: 1)),
                    ),
                  ),
                const SizedBox(width: 8),
                SizedBox(width: 48, child: Text('$percent%', style: const TextStyle(color: Colors.grey), textAlign: TextAlign.right)),
              ]),
              const SizedBox(height: 6),
              // Use Wrap so these meta fields can wrap on narrow screens instead of overflowing
              Wrap(spacing: 12, runSpacing: 6, children: [
                if (startField != null && startField.toString().isNotEmpty)
                  Row(mainAxisSize: MainAxisSize.min, children: [const Icon(Icons.event, size: 14, color: Colors.grey), const SizedBox(width: 6), ConstrainedBox(constraints: BoxConstraints(maxWidth: 200), child: Text(_formatUtcDisplay(startField), style: const TextStyle(fontSize: 12, color: Colors.grey), overflow: TextOverflow.ellipsis))]),
                if (endField != null && endField.toString().isNotEmpty)
                  Row(mainAxisSize: MainAxisSize.min, children: [const Icon(Icons.event_busy, size: 14, color: Colors.grey), const SizedBox(width: 6), ConstrainedBox(constraints: BoxConstraints(maxWidth: 200), child: Text(_formatUtcDisplay(endField), style: const TextStyle(fontSize: 12, color: Colors.grey), overflow: TextOverflow.ellipsis))]),
                if (locationField != null && locationField.toString().isNotEmpty)
                  Row(mainAxisSize: MainAxisSize.min, children: [const Icon(Icons.location_on, size: 14, color: Colors.grey), const SizedBox(width: 6), ConstrainedBox(constraints: BoxConstraints(maxWidth: 200), child: Text(locationField.toString(), style: const TextStyle(fontSize: 12, color: Colors.grey), overflow: TextOverflow.ellipsis))]),
              ]),
              const SizedBox(height: 8),
              // show description (if available)
              if (wo is Map)
                Builder(builder: (_) {
                  final desc = (wo['description'] ?? wo['raw']?['description'] ?? '').toString();
                  if (desc.isNotEmpty) return Padding(padding: const EdgeInsets.only(bottom: 8.0), child: Text(desc, maxLines: 2, overflow: TextOverflow.ellipsis, style: const TextStyle(color: Colors.black87)));
                  return const SizedBox.shrink();
                }),
              // Group assignments by task within this work order so mobile mirrors web view
              Builder(builder: (_) {
                final Map<String, List<dynamic>> taskGroups = {};
                for (final a in items) {
                  try {
                    final tId = (a['task_id'] ?? a['task'] ?? '')?.toString() ?? '';
                    final key = tId.isNotEmpty ? tId : ('__no_task__' + (a['id']?.toString() ?? ''));
                    taskGroups.putIfAbsent(key, () => []).add(a);
                  } catch (_) {
                    taskGroups.putIfAbsent('__no_task__', () => []).add(a);
                  }
                }

                final tgEntries = taskGroups.entries.toList();
                return Column(children: tgEntries.asMap().entries.map<Widget>((entry) {
                  final idx = entry.key;
                  final group = entry.value.value;
                  final firstAssign = group.isNotEmpty ? group.first : null;
                  final taskId = (firstAssign != null) ? ((firstAssign['task_id'] ?? firstAssign['task'] ?? '')?.toString() ?? '') : '';
                  final task = taskId.isNotEmpty ? (tasksById[taskId] ?? {}) : (firstAssign != null ? (firstAssign['task'] ?? {}) : {});
                  final taskName = (task is Map) ? (task['name'] ?? task['task_name'] ?? '') : '';
                  final duration = (task is Map) ? (task['duration_min'] ?? task['task_duration'] ?? '') : '';

                  // collect distinct assignee displays for this task
                  final seenAssignees = <String>{};
                  final assignees = <String>[];
                  // Prefer task-level assignment list (richer user objects) when available
                  try {
                    dynamic taskAssigns = (task is Map) ? (task['assignments'] ?? task['assigns'] ?? task['assigned'] ?? task['assigned_to'] ?? null) : null;
                    if (taskAssigns is List && taskAssigns.isNotEmpty) {
                      for (final as in taskAssigns) {
                        try {
                          String name = '';
                          if (as is Map) {
                            final u = as['user'] ?? as['assigned_to'] ?? as['assignee'] ?? as;
                            if (u is Map) {
                              name = (u['name'] ?? u['full_name'] ?? u['displayName'] ?? u['personil']?['name'] ?? u['label'] ?? '').toString();
                              if (name.isEmpty) {
                                final id = (u['id'] ?? u['user_id'] ?? u['nipp'] ?? '').toString();
                                if (id.isNotEmpty && assigneeNames.containsKey(id)) name = assigneeNames[id]!;
                              }
                                } else {
                              name = (as['name'] ?? as['label'] ?? as.toString() ?? '').toString();
                            }
                          } else {
                            name = as.toString();
                            if (assigneeNames.containsKey(name)) name = assigneeNames[name]!;
                          }
                          if (name.isNotEmpty && !seenAssignees.contains(name)) { seenAssignees.add(name); assignees.add(name); }
                        } catch (_) {}
                      }
                    } else {
                      // fallback to assignment objects from group
                      for (final a in group) {
                        final ad = _getAssigneeDisplay(a);
                        if (ad.isNotEmpty && !seenAssignees.contains(ad)) { seenAssignees.add(ad); assignees.add(ad); }
                      }
                    }
                  } catch (_) {
                    for (final a in group) {
                      final ad = _getAssigneeDisplay(a);
                      if (ad.isNotEmpty && !seenAssignees.contains(ad)) { seenAssignees.add(ad); assignees.add(ad); }
                    }
                  }

                  final firstAssignmentId = firstAssign != null ? (firstAssign['id'] ?? '') : '';
                  final statusLabel = _deriveTaskStatusFromGroup(group, task);

                  return Card(
                    margin: const EdgeInsets.symmetric(vertical: 6),
                    color: Colors.grey.shade50,
                    child: ListTile(
                      leading: CircleAvatar(radius: 18, backgroundColor: Theme.of(context).colorScheme.primary, child: Text('${idx+1}', style: const TextStyle(color: Colors.white))),
                      title: Text(
                        taskName.isNotEmpty ? taskName : 'Assignment',
                        style: const TextStyle(fontWeight: FontWeight.w700),
                        overflow: TextOverflow.ellipsis,
                        maxLines: 1,
                      ),
                      subtitle: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            // first line: duration (status badge moved to trailing)
                            Row(children: [
                              if (duration != null && duration.toString().isNotEmpty)
                                Padding(padding: const EdgeInsets.only(right: 8.0), child: Text('${duration.toString()} min', style: const TextStyle(color: Colors.grey))),
                            ]),
                            const SizedBox(height: 6),
                            // second line: assignee chips
                            if (assignees.isNotEmpty)
                              Wrap(spacing: 6, children: assignees.map((n) => Container(padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(8)), child: Text(n, style: const TextStyle(fontSize: 12)))).toList()),
                          ]),
                      trailing: Chip(label: Text(statusLabel, style: const TextStyle(fontSize: 12)), backgroundColor: _statusColorLocal(statusLabel)),
                      onTap: () { if ((wo is Map ? (wo['id'] ?? wo['doc_no']) : woKey) != null) Navigator.push(context, MaterialPageRoute(builder: (_) => WODetailScreen(woId: (wo is Map ? (wo['id'] ?? wo['doc_no']).toString() : woKey), assignmentId: firstAssignmentId.toString(), baseUrl: API_BASE, token: _token ?? ''))); },
                    ),
                  );
                }).toList());
              }),
            ]),
          ),
        );
      },
    );
  }

  

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Inbox Assignments'), actions: [
        IconButton(
          icon: const Icon(Icons.refresh),
          tooltip: 'Refresh lists',
          onPressed: () async {
            // refresh assignments for current user
            await loadAssignments();
            // if lead-shift, also refresh pending and monitoring lists
            if (isLeadShift) {
              await _loadPendingRealisasi();
              await _loadMonitoringWorkOrders();
            }
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Lists refreshed')));
          },
        ),
      ]),
      drawer: const AppDrawer(),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            const SizedBox(height: 8),
            Expanded(
              child: isLeadShift
                  ? DefaultTabController(
                      length: 2,
                      child: Column(children: [
                        TabBar(tabs: [
                          const Tab(text: 'Tasks'),
                          Tab(child: Row(mainAxisSize: MainAxisSize.min, children: [
                            const Text('Monitoring'),
                            const SizedBox(width: 8),
                            if (pendingRealisasi.isNotEmpty) Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(color: Colors.red.shade600, borderRadius: BorderRadius.circular(12)),
                              child: Text('${pendingRealisasi.length}', style: const TextStyle(color: Colors.white, fontSize: 12)),
                            )
                          ])),
                        ]),
                        Expanded(
                          child: TabBarView(children: [
                            // Tasks tab: leader should see assignments (their own + group)
                            loading
                              ? const Center(child: CircularProgressIndicator())
                              : Padding(padding: const EdgeInsets.only(bottom: 24), child: _buildAssignmentsGrouped()),
                            // Monitoring tab: monitoring WOs + pending approvals
                            SingleChildScrollView(
                              padding: const EdgeInsets.only(bottom: 24),
                              child: Column(children: [
                                const SizedBox(height: 8),
                                const Text('Monitoring Realisasi (Work Orders)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                                const SizedBox(height: 8),
                                _buildMonitoringSection(),
                                const SizedBox(height: 12),
                                _sectionHeader('Pending Realisasi Approvals', pendingRealisasi.length),
                                _buildPendingSection(),
                              ]),
                            ),
                          ]),
                        ),
                      ]),
                    )
                  : loading
                      ? const Center(child: CircularProgressIndicator())
                      : _buildAssignmentsGrouped(),
            )
          ],
        ),
      ),
    );
  }
}