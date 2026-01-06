import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart' as prefs;
import '../services/api.dart';
import '../config.dart';
import 'dart:async';

class ChecklistHistoryScreen extends StatefulWidget {
  const ChecklistHistoryScreen({super.key});

  @override
  State<ChecklistHistoryScreen> createState() => _ChecklistHistoryScreenState();
}

class _ChecklistHistoryScreenState extends State<ChecklistHistoryScreen> {
  bool loading = false;
  List<dynamic> rows = [];
  String _token = '';

  @override
  void initState() {
    super.initState();
    _loadTokenAndFetch();
  }

  Future<void> _loadTokenAndFetch() async {
    setState(() { loading = true; });
    // token from shared prefs
    try {
      final sp = await prefs.SharedPreferences.getInstance();
      final t = sp.getString('api_token') ?? '';
      setState(() { _token = t; });
      await fetchRows();
    } catch (e) {
      debugPrint('load token failed: $e');
    } finally {
      setState(() { loading = false; });
    }
  }

  Future<void> fetchRows() async {
    setState(() { loading = true; });
    try {
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      final res = await api.get('/mobile/checklists?q=&page=1&pageSize=100');
      final data = (res is Map) ? (res['data'] ?? []) : res;
      setState(() { rows = data is List ? data : []; });
    } catch (e) {
      debugPrint('fetch checklists failed: $e');
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to load history: $e')));
    } finally {
      setState(() { loading = false; });
    }
  }

  String _formatDate(dynamic raw) {
    if (raw == null) return '-';
    try {
      final dt = DateTime.parse(raw.toString());
      return '${dt.day}/${dt.month}/${dt.year} ${dt.hour}:${dt.minute.toString().padLeft(2,'0')}';
    } catch (_) { return raw.toString(); }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Checklist History')),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: loading ? const Center(child: CircularProgressIndicator()) : (rows.isEmpty ? const Center(child: Text('No checklists found')) : ListView.separated(
          itemCount: rows.length,
          separatorBuilder: (_,__) => const SizedBox(height: 8),
          itemBuilder: (c,i) {
            final r = rows[i];
            final title = (r is Map) ? ((r['alat'] != null) ? (r['alat']['nama'] ?? r['alat']['kode'] ?? 'Alat') : 'Alat') : 'Alat';
            final performed = (r is Map) ? (r['performed_at'] ?? r['created_at']) : null;
            final tech = (r is Map) ? (r['teknisi_name'] ?? r['teknisi_id'] ?? '') : '';
            return ListTile(
              title: Text(title.toString()),
              subtitle: Text(_formatDate(performed) + (tech.toString().isNotEmpty ? ' • $tech' : '')),
              onTap: () async {
                // open detail
                Navigator.push(context, MaterialPageRoute(builder: (_) => ChecklistDetailScreen(checklistId: (r['id'] ?? r['daily_checklist_id']).toString(), token: _token)));
              },
            );
          }
        )),
      ),
    );
  }
}

class ChecklistDetailScreen extends StatefulWidget {
  final String checklistId;
  final String token;
  const ChecklistDetailScreen({required this.checklistId, required this.token, super.key});

  @override
  State<ChecklistDetailScreen> createState() => _ChecklistDetailScreenState();
}

class _ChecklistDetailScreenState extends State<ChecklistDetailScreen> {
  bool loading = false;
  Map<String,dynamic>? checklist;
  List<dynamic> items = [];

  @override
  void initState() { super.initState(); _fetch(); }

  Future<void> _fetch() async {
    setState(() { loading = true; });
    try {
      final api = ApiClient(baseUrl: API_BASE, token: widget.token);
      final res = await api.get('/mobile/checklists/${Uri.encodeComponent(widget.checklistId)}');
      if (res is Map) {
        setState(() { checklist = (res['checklist'] ?? res['data'] ?? res) as Map<String,dynamic>?; items = (res['items'] ?? []); });
      } else {
        setState(() { checklist = null; items = []; });
      }
    } catch (e) {
      debugPrint('fetch detail failed: $e');
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to load detail: $e')));
    } finally { setState(() { loading = false; }); }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Checklist Detail')),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: loading ? const Center(child: CircularProgressIndicator()) : Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          if (checklist != null) ...[
            Text('Alat: ${checklist!['alat']?['nama'] ?? checklist!['alat']?['kode'] ?? '-'}', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Text('Performed: ${checklist!['performed_at'] ?? checklist!['created_at'] ?? '-'}'),
            const SizedBox(height: 12),
            const Text('Items', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Expanded(child: ListView.separated(
              itemCount: items.length,
              separatorBuilder: (_,__) => const SizedBox(height: 8),
              itemBuilder: (c,i) {
                final it = items[i];
                final q = it['question'] ?? it['question_id'] ?? 'Q';
                final ans = it['answer_text'] ?? it['answer_number'] ?? it['option'] ?? '';
                return ListTile(title: Text(q is Map ? (q['question_text'] ?? 'Q') : q.toString()), subtitle: Text(ans.toString()));
              }
            ))
          ] else Center(child: Text('Not found'))
        ]),
      ),
    );
  }
}
