import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api.dart';
import '../config.dart';
import 'wo_detail.dart';
import 'checklist.dart';

class DailyWorkOrdersScreen extends StatefulWidget {
  const DailyWorkOrdersScreen({super.key});

  @override
  State<DailyWorkOrdersScreen> createState() => _DailyWorkOrdersScreenState();
}

class _DailyWorkOrdersScreenState extends State<DailyWorkOrdersScreen>
    with WidgetsBindingObserver {
  bool loading = false;
  List<dynamic> rows = [];
  String _token = '';
  String _techId = '';
  Timer? _autoRefreshTimer;
  static const Duration _autoRefreshInterval = Duration(seconds: 60);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _loadPrefs();
  }

  Future<void> _loadPrefs() async {
    final p = await SharedPreferences.getInstance();
    setState(() {
      _token = p.getString('api_token') ?? '';
      _techId = p.getString('tech_id') ?? '';
    });
    await _loadList();
    // Start periodic auto-refresh after initial load
    _startAutoRefresh();
  }

  void _startAutoRefresh() {
    // avoid multiple timers
    _autoRefreshTimer?.cancel();
    _autoRefreshTimer = Timer.periodic(_autoRefreshInterval, (t) async {
      try {
        if (!mounted) return;
        if (loading) return;
        await _loadList();
      } catch (_) {}
    });
  }

  void _stopAutoRefresh() {
    try {
      _autoRefreshTimer?.cancel();
    } catch (_) {}
    _autoRefreshTimer = null;
  }

  Future<void> _loadList() async {
    setState(() {
      loading = true;
    });
    try {
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      final today = DateTime.now();
      final dateStr =
          '${today.year.toString().padLeft(4, '0')}-${today.month.toString().padLeft(2, '0')}-${today.day.toString().padLeft(2, '0')}';
      final res = await api.get(
          '/work-orders?page=1&pageSize=100&date=${Uri.encodeComponent(dateStr)}&work_type=DAILY');
      final data = (res is Map) ? (res['data'] ?? res) : res;

      List<dynamic> loaded = [];
      if (data is List)
        loaded = List<dynamic>.from(data);
      else if (data is Map && data['data'] is List)
        loaded = List<dynamic>.from(data['data']);
      else if (res is Map && res['rows'] is List)
        loaded = List<dynamic>.from(res['rows']);

      DateTime? _parseRowDate(dynamic r) {
        if (r == null) return null;
        final keys = [
          'start_date',
          'start',
          'raw.start_date',
          'raw.start',
          'raw.scheduled_start',
          'raw.start_time',
          'raw.scheduled_start_time',
          'end_date',
          'raw.end_date',
          'created_at',
          'raw.created_at'
        ];
        DateTime? out;
        for (final k in keys) {
          try {
            dynamic val;
            if (k.contains('.')) {
              final parts = k.split('.');
              dynamic cur = r;
              for (final p in parts) {
                if (cur is Map && cur.containsKey(p))
                  cur = cur[p];
                else {
                  cur = null;
                  break;
                }
              }
              val = cur;
            } else {
              val = (r is Map) ? r[k] : null;
            }
            if (val == null) continue;
            if (val is int) {
              // assume millis
              out = DateTime.fromMillisecondsSinceEpoch(val).toLocal();
              return out;
            }
            final s = val.toString();
            if (s.trim().isEmpty) continue;
            // Try parsing directly
            final dt = DateTime.tryParse(s);
            if (dt != null) return dt.toLocal();
            // Try appending Z (UTC) if missing timezone
            try {
              final dt2 = DateTime.tryParse(s + 'Z');
              if (dt2 != null) return dt2.toLocal();
            } catch (_) {}
          } catch (_) {}
        }
        return out;
      }

      try {
        loaded.sort((a, b) {
          final aDt = _parseRowDate(a);
          final bDt = _parseRowDate(b);
          if (aDt == null && bDt == null) return 0;
          if (aDt == null) return 1;
          if (bDt == null) return -1;
          return aDt.compareTo(bDt);
        });
      } catch (_) {}

      // Only show work orders with status 'DEPLOYED' and assigned to current user
      try {
        final techId = _techId ?? '';
        loaded = loaded.where((r) {
          try {
            final s = ((r is Map)
                        ? (r['status'] ??
                            r['raw']?['status'] ??
                            r['raw']?['work_status'])
                        : '')
                    ?.toString() ??
                '';
            if (!s.toString().toUpperCase().contains('DEPLOYED')) return false;

            // If no tech id available, keep deployed items
            if (techId.isEmpty) return true;

            bool assigned = false;
            if (r is Map) {
              // check assigned users list
              final au = r['assigned_users'] ??
                  r['assigned'] ??
                  r['assignees'] ??
                  r['assigned_to'];
              if (au is List) {
                for (final u in au) {
                  try {
                    if (u == null) continue;
                    if (u is Map) {
                      final id =
                          (u['id'] ?? u['user_id'] ?? u['nipp'] ?? u['nipp_id'])
                                  ?.toString() ??
                              '';
                      if (id.isNotEmpty && id == techId) {
                        assigned = true;
                        break;
                      }
                      final uname =
                          (u['name'] ?? u['username'] ?? '')?.toString() ?? '';
                      if (uname.isNotEmpty && uname == techId) {
                        assigned = true;
                        break;
                      }
                    } else {
                      if (u.toString() == techId) {
                        assigned = true;
                        break;
                      }
                    }
                  } catch (_) {}
                }
              }

              if (!assigned) {
                final at = r['assigned_to'] ?? r['assignee'] ?? r['assigned'];
                if (at != null) {
                  if (at is Map) {
                    final id =
                        (at['id'] ?? at['user_id'] ?? at['nipp'])?.toString() ??
                            '';
                    if (id.isNotEmpty && id == techId) assigned = true;
                    final name = (at['name'] ?? '')?.toString() ?? '';
                    if (!assigned && name.isNotEmpty && name == techId)
                      assigned = true;
                  } else {
                    if (at.toString() == techId) assigned = true;
                  }
                }
              }

              if (!assigned) {
                try {
                  final raw = r['raw'] ?? {};
                  final rau = raw['assigned_users'] ??
                      raw['assigned_to'] ??
                      raw['assignees'];
                  if (rau is List) {
                    for (final u in rau) {
                      try {
                        if (u is Map) {
                          final id = (u['id'] ?? u['user_id'] ?? u['nipp'])
                                  ?.toString() ??
                              '';
                          if (id == techId) {
                            assigned = true;
                            break;
                          }
                        } else if (u.toString() == techId) {
                          assigned = true;
                          break;
                        }
                      } catch (_) {}
                    }
                  }
                  final rat = raw['assigned_to'] ?? raw['assignee'];
                  if (!assigned && rat != null) {
                    if (rat is Map) {
                      final id = (rat['id'] ?? rat['user_id'] ?? rat['nipp'])
                              ?.toString() ??
                          '';
                      if (id == techId) assigned = true;
                    } else if (rat.toString() == techId) assigned = true;
                  }
                } catch (_) {}
              }
            }

            return assigned;
          } catch (_) {
            return false;
          }
        }).toList();
      } catch (_) {}

      setState(() {
        rows = loaded;
      });
    } catch (e) {
      debugPrint('load daily work orders failed: $e');
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  Widget _buildRow(dynamic r) {
    final id = (r['id'] ?? r['wo_id'] ?? '').toString();
    final doc = (r['doc_no'] ?? r['docNo'] ?? '').toString();
    final asset = (r['asset_name'] ?? r['asset'] ?? '').toString();
    final start = ((r['start_date'] ?? r['start']) ?? '').toString();
    final status =
        (r['status'] ?? r['raw']?['status'] ?? r['raw']?['work_status'] ?? '')
                ?.toString() ??
            '';
    String assigned = '';
    try {
      if (r['assigned_users'] is List &&
          (r['assigned_users'] as List).isNotEmpty) {
        assigned = (r['assigned_users'] as List)
            .map((u) => ((u is Map)
                ? ((u['name'] ?? u['user_name']) ?? '')
                : u?.toString() ?? ''))
            .where((s) => s != null && s.toString().isNotEmpty)
            .join(', ');
      }
    } catch (_) {
      assigned = '';
    }

    final site = (r['vendor_cabang'] ??
                r['raw']?['vendor_cabang'] ??
                r['raw']?['site'] ??
                '')
            ?.toString() ??
        '';
    double progressValue = 0.0;
    try {
      final prog = (r['progress'] ?? r['raw']?['progress']);
      if (prog is num)
        progressValue = (prog as num).toDouble().clamp(0.0, 1.0);
      else
        progressValue =
            double.tryParse(prog?.toString() ?? '0')?.clamp(0.0, 1.0) ?? 0.0;
    } catch (_) {
      progressValue = 0.0;
    }

    // Format start time
    String startDisplay = start;
    DateTime? startDt;
    try {
      startDt = DateTime.tryParse(start)?.toLocal();
    } catch (_) {
      startDt = null;
    }
    if (startDt != null) {
      final hh = startDt.hour.toString().padLeft(2, '0');
      final mm = startDt.minute.toString().padLeft(2, '0');
      startDisplay = '$hh:$mm';
    }

    // Build status chip color (match web-like mapping)
    Color statusColor = Colors.grey.shade400;
    final st = status.toUpperCase();
    if (st.contains('DEPLOYED'))
      statusColor = const Color(0xFFE91E63); // magenta for deployed
    else if (st.contains('IN_PROGRESS') || st.contains('ONGOING'))
      statusColor = const Color(0xFF43A047); // green
    else if (st.contains('COMPLETED') ||
        st.contains('DONE') ||
        st.contains('FINISHED'))
      statusColor = const Color(0xFF1976D2); // blue
    else if (st.contains('PENDING') ||
        st.contains('OPEN') ||
        st.contains('SCHEDULED'))
      statusColor = const Color(0xFFF57C00); // orange
    else if (st.contains('CANCEL') ||
        st.contains('REJECT') ||
        st.contains('FAILED'))
      statusColor = const Color(0xFFD32F2F); // red
    else
      statusColor = Colors.grey.shade500;

    // initials for leading avatar
    String initials = '';
    final label = asset.isNotEmpty ? asset : (doc.isNotEmpty ? doc : 'WO');
    try {
      final parts = label.trim().split(RegExp(r'\s+'));
      if (parts.length == 1)
        initials = parts.first.substring(0, 1).toUpperCase();
      else
        initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } catch (_) {
      initials = 'W';
    }

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: ListTile(
        dense: true,
        leading: CircleAvatar(
            backgroundColor: Theme.of(context).colorScheme.primary,
            child: Text(initials, style: const TextStyle(color: Colors.white))),
        title: Text(asset.isNotEmpty ? asset : doc,
            style: const TextStyle(fontWeight: FontWeight.w600)),
        subtitle:
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Expanded(
                child: Text(startDisplay,
                    style:
                        const TextStyle(fontSize: 13, color: Colors.black87))),
            if (status.isNotEmpty)
              Chip(
                label: Text(status,
                    style: const TextStyle(color: Colors.white, fontSize: 12)),
                backgroundColor: statusColor,
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 0),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
              ),
          ]),
          const SizedBox(height: 6),
          Text('Assigned: ${assigned.isNotEmpty ? assigned : '-'}',
              style: const TextStyle(fontSize: 13, color: Colors.black54)),
          if (site.isNotEmpty)
            Padding(
                padding: const EdgeInsets.only(top: 6.0),
                child: Text(site,
                    style: const TextStyle(fontSize: 12, color: Colors.grey))),
          if (progressValue > 0)
            Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: LinearProgressIndicator(value: progressValue)),
        ]),
        isThreeLine: assigned.isNotEmpty || progressValue > 0,
        onTap: () async {
          await _showChecklistForWorkOrder(r);
        },
      ),
    );
  }

  Future<void> _showChecklistForWorkOrder(dynamic r) async {
    List<dynamic> questions = [];
    final woId = (r is Map) ? (r['id'] ?? r['wo_id'] ?? '') : '';
    try {
      // Try to read checklist from the work order raw payload
      if (r is Map) {
        final raw = r['raw'] ?? {};
        questions = (raw['checklist_template'] is List)
            ? List<dynamic>.from(raw['checklist_template'])
            : (raw['checklist'] is List
                ? List<dynamic>.from(raw['checklist'])
                : []);
      }
    } catch (_) {
      questions = [];
    }

    // If not found in payload, try fetching the work order detail
    if (questions.isEmpty) {
      try {
        final p = await SharedPreferences.getInstance();
        final token = p.getString('api_token') ?? '';
        if (token.isNotEmpty) {
          final api = ApiClient(baseUrl: API_BASE, token: token);
          if (woId != null && woId.toString().isNotEmpty) {
            final res = await api
                .get('/work-orders/${Uri.encodeComponent(woId.toString())}');
            final w = res is Map ? (res['data'] ?? res) : res;
            if (w is Map) {
              final raw = w['raw'] ?? {};
              questions = (raw['checklist_template'] is List)
                  ? List<dynamic>.from(raw['checklist_template'])
                  : (raw['checklist'] is List
                      ? List<dynamic>.from(raw['checklist'])
                      : []);
            }
          }
        }
      } catch (e) {
        debugPrint('failed fetching work order detail for checklist: $e');
      }
    }

    if (questions.isEmpty) {
      // no checklist found
      if (!mounted) return;
      showModalBottomSheet(
          context: context,
          builder: (c) => Padding(
              padding: const EdgeInsets.all(16),
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                const Text('No checklist available for this work order'),
                const SizedBox(height: 12),
                TextButton(
                    onPressed: () => Navigator.pop(c),
                    child: const Text('Close'))
              ])));
      return;
    }

    // Navigate to ChecklistScreen with the loaded questions
    if (!mounted) return;
    final initialAlat = (r is Map)
        ? (r['asset'] ??
            r['alat'] ??
            r['raw']?['asset'] ??
            r['raw']?['alat'] ??
            {
              'id': r['asset_id'] ?? r['alat_id'],
              'name': (r['asset_name'] ?? r['asset'] ?? r['doc_no'])
            })
        : null;
    final result = await Navigator.push(
        context,
        MaterialPageRoute(
            builder: (_) => ChecklistScreen(
                initialChecklist: questions,
                initialAlat: initialAlat is Map
                    ? Map<String, dynamic>.from(initialAlat)
                    : null,
                initialWorkOrderId: (woId != null && woId.toString().isNotEmpty)
                    ? woId.toString()
                    : null)));
    try {
      if (result == true) await _loadList();
    } catch (_) {}
  }

  @override
  void dispose() {
    _stopAutoRefresh();
    try {
      WidgetsBinding.instance.removeObserver(this);
    } catch (_) {}
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    if (state == AppLifecycleState.resumed) {
      // refresh when app comes back to foreground
      try {
        if (mounted) _loadList();
      } catch (_) {}
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Daily Work Orders'),
        actions: [
          IconButton(
            onPressed: loading
                ? null
                : () async {
                    await _loadList();
                  },
            icon: loading
                ? Padding(
                    padding: EdgeInsets.all(12),
                    child: SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2)))
                : const Icon(Icons.refresh),
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadList,
              child: rows.isEmpty
                  ? ListView(children: const [
                      Padding(
                          padding: EdgeInsets.all(24),
                          child: Text('No daily work orders found'))
                    ])
                  : ListView.builder(
                      itemCount: rows.length,
                      itemBuilder: (c, i) => _buildRow(rows[i]),
                    ),
            ),
    );
  }
}
