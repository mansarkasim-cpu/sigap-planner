import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api.dart';
import '../config.dart';
import 'checklist.dart';

class DailyWorkOrdersScreen extends StatefulWidget {
  const DailyWorkOrdersScreen({super.key});

  @override
  State<DailyWorkOrdersScreen> createState() => _DailyWorkOrdersScreenState();
}

class _DailyWorkOrdersScreenState extends State<DailyWorkOrdersScreen>
    with WidgetsBindingObserver {
  bool loading = false;

  /// Flattened list of daily checklist assignments for the current user today.
  List<Map<String, dynamic>> rows = [];

  String _token = '';
  String _userId = '';
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
      _userId = p.getString('tech_id') ?? '';
    });
    await _loadList();
    _startAutoRefresh();
  }

  void _startAutoRefresh() {
    _autoRefreshTimer?.cancel();
    _autoRefreshTimer = Timer.periodic(_autoRefreshInterval, (_) async {
      if (!mounted || loading) return;
      await _loadList();
    });
  }

  void _stopAutoRefresh() {
    _autoRefreshTimer?.cancel();
    _autoRefreshTimer = null;
  }

  Future<void> _loadList() async {
    if (!mounted) return;
    setState(() => loading = true);
    try {
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      final today = DateTime.now();
      final dateStr =
          '${today.year.toString().padLeft(4, '0')}-${today.month.toString().padLeft(2, '0')}-${today.day.toString().padLeft(2, '0')}';

      final res = await api
          .get('/daily-checklist-schedules?date=${Uri.encodeComponent(dateStr)}');

      final schedules = res is List
          ? res
          : (res is Map ? (res['data'] ?? []) : []);

      final List<Map<String, dynamic>> flat = [];
      for (final schedule in (schedules is List ? schedules : [])) {
        if (schedule is! Map) continue;
        final siteName = (schedule['site'] is Map
                ? (schedule['site']['name'] ??
                    schedule['site']['site_name'] ??
                    '')
                : '')
            .toString();
        final assignments = schedule['assignments'];
        if (assignments is! List) continue;
        for (final a in assignments) {
          if (a is! Map) continue;
          final assigneeId = (a['user'] is Map
                  ? (a['user']['id'] ?? '')
                  : (a['user_id'] ?? ''))
              .toString();
          if (_userId.isNotEmpty && assigneeId != _userId) continue;

          final assetName = (a['asset'] is Map
                  ? (a['asset']['nama'] ??
                      a['asset']['name'] ??
                      a['asset']['asset_name'] ??
                      a['asset']['kode'] ??
                      a['asset']['serial_no'] ??
                      '')
                  : '')
              .toString();

          flat.add({
            'id': a['id']?.toString() ?? '',
            'status': (a['status'] ?? 'PENDING').toString(),
            'notes': a['notes']?.toString() ?? '',
            'completedAt': a['completedAt']?.toString() ??
                a['completed_at']?.toString() ??
                '',
            'asset': a['asset'] is Map
                ? Map<String, dynamic>.from(a['asset'] as Map)
                : <String, dynamic>{},
            'assetName': assetName,
            'user': a['user'] is Map
                ? Map<String, dynamic>.from(a['user'] as Map)
                : <String, dynamic>{},
            'siteName': siteName,
            'scheduleId': schedule['id']?.toString() ?? '',
            'scheduleDate': schedule['date']?.toString() ?? dateStr,
          });
        }
      }

      if (mounted) setState(() => rows = flat);
    } catch (e) {
      debugPrint('[DailyChecklistScreen] load failed: $e');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  Future<void> _updateAssignmentStatus(
      String assignmentId, String newStatus) async {
    try {
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      await api.patch('/daily-checklist-assignments/$assignmentId/status',
          {'status': newStatus});
      await _loadList();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('Failed to update: $e')));
      }
    }
  }

  void _showDetail(Map<String, dynamic> item) {
    final id = item['id'] as String;
    final assetName = item['assetName'] as String;
    final status = item['status'] as String;
    final siteName = item['siteName'] as String;
    final completedAt = item['completedAt'] as String;
    final notes = item['notes'] as String;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(16))),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(2)),
                ),
              ),
              Row(children: [
                const Icon(Icons.checklist_rtl, size: 20),
                const SizedBox(width: 8),
                Expanded(
                    child: Text(assetName,
                        style: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.bold))),
              ]),
              const SizedBox(height: 8),
              if (siteName.isNotEmpty)
                Text(siteName,
                    style:
                        const TextStyle(color: Colors.grey, fontSize: 13)),
              const SizedBox(height: 12),
              Row(children: [
                _statusChip(status),
                if (completedAt.isNotEmpty) ...[
                  const SizedBox(width: 8),
                  Text(_fmtDate(completedAt),
                      style: const TextStyle(
                          fontSize: 12, color: Colors.grey)),
                ]
              ]),
              if (notes.isNotEmpty) ...[
                const SizedBox(height: 8),
                Text('Notes: $notes',
                    style: const TextStyle(
                        fontSize: 13, color: Colors.black87)),
              ],
              const SizedBox(height: 20),
              if (status == 'PENDING') ...[
                Row(children: [
                  Expanded(
                    child: FilledButton.icon(
                      icon: const Icon(Icons.check_circle_outline),
                      label: const Text('Mark Done'),
                      style: FilledButton.styleFrom(
                          backgroundColor: Colors.green.shade600),
                      onPressed: () async {
                        Navigator.pop(ctx);
                        await _updateAssignmentStatus(id, 'DONE');
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton.icon(
                      icon: const Icon(Icons.cancel_outlined),
                      label: const Text('Skip'),
                      style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.orange.shade700),
                      onPressed: () async {
                        Navigator.pop(ctx);
                        await _updateAssignmentStatus(id, 'SKIPPED');
                      },
                    ),
                  ),
                ]),
              ] else
                OutlinedButton.icon(
                  icon: const Icon(Icons.undo),
                  label: const Text('Reset to Pending'),
                  onPressed: () async {
                    Navigator.pop(ctx);
                    await _updateAssignmentStatus(id, 'PENDING');
                  },
                ),
            ],
          ),
        );
      },
    );
  }

  String _fmtDate(String raw) {
    try {
      final dt = DateTime.tryParse(raw)?.toLocal();
      if (dt == null) return raw;
      return '${dt.day.toString().padLeft(2, '0')}/${dt.month.toString().padLeft(2, '0')} '
          '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return raw;
    }
  }

  Widget _statusChip(String status) {
    Color bg;
    IconData icon;
    switch (status.toUpperCase()) {
      case 'DONE':
        bg = Colors.green.shade600;
        icon = Icons.check_circle;
        break;
      case 'SKIPPED':
        bg = Colors.orange.shade700;
        icon = Icons.cancel;
        break;
      default:
        bg = Colors.blueGrey.shade400;
        icon = Icons.hourglass_empty;
    }
    return Chip(
      avatar: Icon(icon, color: Colors.white, size: 16),
      label: Text(status,
          style: const TextStyle(color: Colors.white, fontSize: 12)),
      backgroundColor: bg,
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 0),
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
    );
  }

  Widget _buildRow(Map<String, dynamic> item) {
    final assetName = item['assetName'] as String;
    final status = item['status'] as String;
    final siteName = item['siteName'] as String;

    String initials = 'A';
    try {
      final parts = assetName.trim().split(RegExp(r'\s+'));
      if (parts.length == 1)
        initials = parts.first.substring(0, 1).toUpperCase();
      else
        initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } catch (_) {}

    Color avatarColor;
    switch (status.toUpperCase()) {
      case 'DONE':
        avatarColor = Colors.green.shade600;
        break;
      case 'SKIPPED':
        avatarColor = Colors.orange.shade700;
        break;
      default:
        avatarColor = Theme.of(context).colorScheme.primary;
    }

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: Colors.grey.shade200)),
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      child: ListTile(
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: CircleAvatar(
          backgroundColor: avatarColor,
          child: Text(initials,
              style:
                  const TextStyle(color: Colors.white, fontSize: 14)),
        ),
        title: Text(
          assetName.isNotEmpty ? assetName : 'Unknown Asset',
          style:
              const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            if (siteName.isNotEmpty)
              Text(siteName,
                  style: const TextStyle(
                      fontSize: 12, color: Colors.black54)),
            const SizedBox(height: 4),
            _statusChip(status),
          ],
        ),
        isThreeLine: siteName.isNotEmpty,
        trailing: status == 'DONE'
            ? const Icon(Icons.check_circle, color: Colors.green)
            : status == 'SKIPPED'
                ? const Icon(Icons.cancel, color: Colors.orange)
                : const Icon(Icons.chevron_right),
        onTap: status != 'PENDING'
            ? null
            : () async {
                final asset = item['asset'] as Map<String, dynamic>;
                final assignmentId = item['id'] as String;
                final result = await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => ChecklistScreen(
                      initialAlat: asset,
                      initialWorkOrderId: assignmentId,
                    ),
                  ),
                );
                if (result == true) {
                  await _updateAssignmentStatus(assignmentId, 'DONE');
                }
              },
      ),
    );
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
    if (state == AppLifecycleState.resumed && mounted) {
      _loadList();
    }
  }

  @override
  Widget build(BuildContext context) {
    final today = DateTime.now();
    final todayLabel =
        '${today.day.toString().padLeft(2, '0')}/${today.month.toString().padLeft(2, '0')}/${today.year}';

    final total = rows.length;
    final done = rows.where((r) => r['status'] == 'DONE').length;
    final skipped = rows.where((r) => r['status'] == 'SKIPPED').length;
    final pending = total - done - skipped;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Daily Checklist',
                style:
                    TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            Text(todayLabel,
                style: const TextStyle(
                    fontSize: 12, fontWeight: FontWeight.normal)),
          ],
        ),
        actions: [
          IconButton(
            onPressed: loading ? null : _loadList,
            icon: loading
                ? const Padding(
                    padding: EdgeInsets.all(12),
                    child: SizedBox(
                        width: 20,
                        height: 20,
                        child:
                            CircularProgressIndicator(strokeWidth: 2)))
                : const Icon(Icons.refresh),
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: Column(
        children: [
          if (!loading && total > 0)
            Container(
              color: Theme.of(context)
                  .colorScheme
                  .surfaceContainerHighest,
              padding: const EdgeInsets.symmetric(
                  horizontal: 16, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _summaryItem('Total', total, Colors.blueGrey),
                  _summaryItem('Pending', pending,
                      Colors.blueGrey.shade400),
                  _summaryItem(
                      'Done', done, Colors.green.shade600),
                  _summaryItem(
                      'Skipped', skipped, Colors.orange.shade700),
                ],
              ),
            ),
          Expanded(
            child: loading
                ? const Center(child: CircularProgressIndicator())
                : RefreshIndicator(
                    onRefresh: _loadList,
                    child: rows.isEmpty
                        ? ListView(children: const [
                            Padding(
                              padding: EdgeInsets.all(32),
                              child: Column(children: [
                                Icon(Icons.checklist_rtl,
                                    size: 48, color: Colors.grey),
                                SizedBox(height: 12),
                                Text(
                                    'No daily checklist assignments today',
                                    textAlign: TextAlign.center,
                                    style:
                                        TextStyle(color: Colors.grey)),
                              ]),
                            )
                          ])
                        : ListView.builder(
                            padding: const EdgeInsets.only(
                                top: 8, bottom: 16),
                            itemCount: rows.length,
                            itemBuilder: (_, i) =>
                                _buildRow(rows[i]),
                          ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _summaryItem(String label, int count, Color color) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          '$count',
          style: TextStyle(
              fontSize: 18, fontWeight: FontWeight.bold, color: color),
        ),
        Text(label,
            style: const TextStyle(
                fontSize: 11, color: Colors.black54)),
      ],
    );
  }
}
