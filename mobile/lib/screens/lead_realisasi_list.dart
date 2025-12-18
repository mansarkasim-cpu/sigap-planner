import 'package:flutter/material.dart';
import '../services/api.dart';

class LeadRealisasiList extends StatefulWidget {
  final String baseUrl;
  final String token;
  const LeadRealisasiList({required this.baseUrl, required this.token, super.key});

  @override
  State<LeadRealisasiList> createState() => _LeadRealisasiListState();
}

class _LeadRealisasiListState extends State<LeadRealisasiList> {
  List<dynamic> items = [];
  bool loading = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() { loading = true; });
    try {
      final api = ApiClient(baseUrl: widget.baseUrl, token: widget.token);
      final res = await api.get('/realisasi/pending');
      setState(() { items = res is List ? res : (res['data'] ?? res); });
    } catch (e) {
      debugPrint('load pending failed: $e');
    } finally {
      setState(() { loading = false; });
    }
  }

  Future<void> _approve(String id) async {
    final api = ApiClient(baseUrl: widget.baseUrl, token: widget.token);
    try {
      await api.post('/realisasi/$id/approve', {});
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Realisasi approved')));
      await _load();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Approve failed: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pending Realisasi')),
      body: loading ? const Center(child: CircularProgressIndicator()) : ListView.builder(
        itemCount: items.length,
        itemBuilder: (c, i) {
          final it = items[i];
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('WO: ${it['woDoc'] ?? it['woId']}', style: const TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  if ((it['notes'] ?? '').toString().isNotEmpty) Text('Notes: ${it['notes']}'),
                  if ((it['photoUrl'] ?? '').toString().isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Image.network(it['photoUrl']),
                  ],
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      ElevatedButton(
                        onPressed: () async { await _approve(it['id']); },
                        child: const Text('Approve')
                      )
                    ],
                  )
                ],
              ),
            ),
          );
        }
      ),
    );
  }
}
