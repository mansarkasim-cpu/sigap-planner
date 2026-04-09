import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/services.dart';
import '../services/api.dart';
import '../config.dart';

class EquipmentHourMeterScreen extends StatefulWidget {
  const EquipmentHourMeterScreen({super.key});

  @override
  State<EquipmentHourMeterScreen> createState() => _EquipmentHourMeterScreenState();
}

class _EquipmentHourMeterScreenState extends State<EquipmentHourMeterScreen> {
  String _token = '';
  List<dynamic> sites = [];
  List<dynamic> jenis = [];
  List<dynamic> alats = [];
  Set<int> doneToday = {};

  String? siteId;
  String? siteName;
  String? jenisId;
  String? alatId;
  String engineHour = '';
  double? previousEngineHour;
  DateTime? previousRecordedAt;
  DateTime? recordedAt;
  String notes = '';
  bool loading = false;

  @override
  void initState() {
    super.initState();
    recordedAt = DateTime.now();
    _loadPrefs();
  }

  Future<void> _loadPrefs() async {
    final p = await SharedPreferences.getInstance();
    setState(() {
      _token = p.getString('api_token') ?? '';
    });
    await _loadRefs();
    await _loadDoneToday();
  }

  Future<void> _loadRefs() async {
    setState(() => loading = true);
    try {
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      final sres = await api.get('/master/sites');
      final jres = await api.get('/master/jenis-alat');
      final ares = await api.get('/master/alats?page=1&pageSize=1000');
      // try to determine user's site(s) from /auth/me and set default site
      String? defaultSiteId;
      String? defaultSiteName;
      try {
        final meRes = await api.get('/auth/me');
        final user = meRes is Map && meRes['data'] != null ? meRes['data'] : meRes;
        if (user is Map) {
          if (user['site_id'] != null) defaultSiteId = user['site_id'].toString();
          else if (user['site'] is Map && user['site']['id'] != null) defaultSiteId = user['site']['id'].toString();
          else if (user['sites'] is List && user['sites'].isNotEmpty) {
            final s0 = user['sites'][0];
            if (s0 is Map && (s0['id'] != null || s0['site_id'] != null)) defaultSiteId = (s0['id'] ?? s0['site_id']).toString();
          }
          // try to extract a human-friendly site name
          try {
            if (user['site'] is Map && user['site']['name'] != null) defaultSiteName = user['site']['name'].toString();
            else if (user['sites'] is List && user['sites'].isNotEmpty) {
              final s0 = user['sites'][0];
              if (s0 is Map && (s0['name'] != null || s0['nama'] != null)) defaultSiteName = (s0['name'] ?? s0['nama']).toString();
            }
          } catch (_) {}
        }
      } catch (e) {
        debugPrint('equipment: /auth/me lookup failed: $e');
      }
      setState(() {
        sites = sres is List ? sres : (sres is Map ? (sres['data'] ?? []) : []);
        jenis = jres is List ? jres : (jres is Map ? (jres['data'] ?? []) : []);
        alats = ares is List ? ares : (ares is Map ? (ares['data'] ?? []) : []);
        if (defaultSiteId != null) {
          siteId = defaultSiteId;
          siteName = defaultSiteName ?? '';
        }
        debugPrint('equipment: loaded refs sites=${sites.length} jenis=${jenis.length} alats=${alats.length} defaultSiteId=$defaultSiteId siteName=$defaultSiteName');
      });
    } catch (e) {
      debugPrint('equipment: load refs failed: $e');
    } finally {
      setState(() => loading = false);
    }
  }

  Future<void> _loadDoneToday() async {
    try {
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      final today = DateTime.now();
      final dateStr = '${today.year.toString().padLeft(4,'0')}-${today.month.toString().padLeft(2,'0')}-${today.day.toString().padLeft(2,'0')}';
      final res = await api.get('/monitor/equipment-hour-meter?date=${Uri.encodeComponent(dateStr)}&page=1&per_page=1000');
      final rows = res is Map ? (res['items'] ?? res['data'] ?? res) : res;
      final seen = <int>{};
      if (rows is List) {
        for (final r in rows) {
          try {
            final alat = r is Map ? (r['alat'] ?? {}) : {};
            final aid = alat is Map ? (alat['id'] ?? alat['alat_id']) : null;
            if (aid != null) {
              final idn = int.tryParse(aid.toString());
              if (idn != null) seen.add(idn);
            }
          } catch (_) {}
        }
      }
      setState(() => doneToday = seen);
    } catch (e) {
      debugPrint('equipment: load done today failed: $e');
    }
  }

  Future<void> _loadPreviousEntry(String alatIdStr) async {
    try {
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      final res = await api.get('/monitor/equipment-hour-meter?alat_id=${Uri.encodeComponent(alatIdStr)}&page=1&per_page=1');
      final rows = res is Map ? (res['items'] ?? res['data'] ?? res) : res;
      if (rows is List && rows.isNotEmpty) {
        final r = rows.first;
        double? val;
        try {
          final v = r['engine_hour'] ?? r['hour_meter'] ?? r['value'];
          if (v != null) val = double.tryParse(v.toString()) ?? (v is num ? v.toDouble() : null);
        } catch (_) {}
        DateTime? dt;
        try {
          final s = r['recorded_at'] ?? r['created_at'] ?? r['time'];
          if (s != null) dt = DateTime.parse(s.toString()).toLocal();
        } catch (_) {}
        setState(() {
          previousEngineHour = val;
          previousRecordedAt = dt;
        });
      } else {
        setState(() {
          previousEngineHour = null;
          previousRecordedAt = null;
        });
      }
    } catch (e) {
      debugPrint('equipment: loadPreviousEntry failed: $e');
      setState(() {
        previousEngineHour = null;
        previousRecordedAt = null;
      });
    }
  }

  Future<void> _pickDateTime() async {
    final d = await showDatePicker(context: context, initialDate: DateTime.now(), firstDate: DateTime(2000), lastDate: DateTime(2100));
    if (d == null) return;
    final t = await showTimePicker(context: context, initialTime: TimeOfDay.now());
    if (t == null) return;
    setState(() {
      recordedAt = DateTime(d.year, d.month, d.day, t.hour, t.minute);
    });
  }

  Future<void> _submit() async {
    if (alatId == null || alatId!.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Silakan pilih alat')));
      return;
    }
    if (engineHour.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Masukkan nilai engine/hour')));
      return;
    }
    final aidn = int.tryParse(alatId!);
    if (aidn != null && doneToday.contains(aidn)) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Alat ini sudah diinput hari ini')));
      return;
    }
    setState(() => loading = true);
    try {
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      final payload = <String, dynamic>{
        'site_id': siteId != null && siteId!.isNotEmpty ? siteId : null,
        'alat_id': alatId,
        'jenis_alat_id': jenisId != null && jenisId!.isNotEmpty ? jenisId : null,
        'engine_hour': double.tryParse(engineHour),
        'recorded_at': recordedAt?.toUtc().toIso8601String(),
        'notes': notes,
      };
      // validate against previousEngineHour if exists
      try {
        final newVal = double.tryParse(engineHour);
        if (newVal != null && previousEngineHour != null && newVal < previousEngineHour!) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Engine/hour value cannot be smaller than previous recorded value')));
          setState(() => loading = false);
          return;
        }
      } catch (_) {}
      await api.post('/monitor/equipment-hour-meter', payload);
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Entry created')));
      await _loadDoneToday();
      // reset form
      setState(() {
        alatId = null;
        engineHour = '';
        notes = '';
        recordedAt = DateTime.now();
      });
    } catch (e) {
      final msg = e.toString();
      if (msg.contains('409')) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Entry for this equipment already exists for the selected date')));
        await _loadDoneToday();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to create entry: $e')));
      }
    } finally {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final filteredAlats = alats.where((a) {
      try {
        if (a == null) return false;
        if (siteId != null && siteId!.isNotEmpty) {
          String sid = '';
          if (a is Map) {
            if (a['site'] is Map) sid = (a['site']['id'] ?? a['site']['site_id'] ?? '').toString();
            if (sid.isEmpty && a['site_id'] != null) sid = a['site_id'].toString();
            if (sid.isEmpty && a['raw'] is Map) sid = (a['raw']['site_id'] ?? '').toString();
          }
          if (sid.isNotEmpty && sid != siteId) return false;
        }
        if (jenisId != null && jenisId!.isNotEmpty) {
          String jid = '';
          if (a is Map) {
            if (a['jenis_alat'] is Map) jid = (a['jenis_alat']['id'] ?? a['jenis_alat']['jenis_alat_id'] ?? '').toString();
            if (jid.isEmpty && a['jenis_alat_id'] != null) jid = a['jenis_alat_id'].toString();
          }
          if (jid.isNotEmpty && jid != jenisId) return false;
        }
        return true;
      } catch (_) { return false; }
    }).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('Equipment Hour Meter')),
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: loading
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // show user's site as read-only (user does not need to pick site)
                    TextFormField(
                      enabled: false,
                      decoration: const InputDecoration(labelText: 'Site'),
                      initialValue: siteName ?? '',
                    ),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: jenisId,
                      decoration: const InputDecoration(labelText: 'Jenis Alat'),
                      items: [const DropdownMenuItem(value: '', child: Text('All Types'))] + jenis.map((j) {
                        final id = (j is Map) ? (j['id'] ?? j['jenis_alat_id']) : null;
                        final name = (j is Map) ? (j['name'] ?? j['nama'] ?? id?.toString() ?? '') : '';
                        // try common description keys
                        String desc = '';
                        if (j is Map) {
                          desc = (j['description'] ?? j['desc'] ?? j['keterangan'] ?? j['deskripsi'] ?? j['note'] ?? '')?.toString() ?? '';
                        }
                        final label = desc.isNotEmpty ? '$name — $desc' : name;
                        return DropdownMenuItem(value: id?.toString() ?? '', child: Text(label));
                      }).toList(),
                      onChanged: (v) => setState(() => jenisId = (v != null && v.isNotEmpty) ? v : null),
                    ),
                    const SizedBox(height: 6),
                    // show description of selected jenis
                    Builder(builder: (ctx) {
                      try {
                        if (jenisId == null) return const SizedBox.shrink();
                        final sel = jenis.firstWhere((j) {
                          try {
                            final id = (j is Map) ? (j['id'] ?? j['jenis_alat_id']) : null;
                            return id != null && id.toString() == jenisId.toString();
                          } catch (_) { return false; }
                        }, orElse: () => null);
                        if (sel == null) return const SizedBox.shrink();
                        String desc = '';
                        if (sel is Map) desc = (sel['description'] ?? sel['desc'] ?? sel['keterangan'] ?? sel['deskripsi'] ?? sel['note'] ?? '')?.toString() ?? '';
                        if (desc.isEmpty) return const SizedBox.shrink();
                        return Text(desc, style: TextStyle(color: Theme.of(context).textTheme.bodySmall?.color ?? Colors.grey, fontSize: 12));
                      } catch (_) { return const SizedBox.shrink(); }
                    }),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: alatId,
                      decoration: const InputDecoration(labelText: 'Alat'),
                      items: [const DropdownMenuItem(value: '', child: Text('-- Select alat --'))] + filteredAlats.map((a) {
                        final id = (a is Map) ? (a['id'] ?? a['alat_id']) : null;
                        final name = (a is Map) ? (a['nama'] ?? a['name'] ?? a['kode'] ?? id?.toString() ?? '') : '';
                        final disabled = id != null && doneToday.contains(int.tryParse(id.toString() ?? '0'));
                        return DropdownMenuItem(value: id?.toString() ?? '', enabled: !disabled, child: Text(disabled ? '$name (done today)' : name));
                      }).toList(),
                      onChanged: (v) async {
                        final nv = (v != null && v.isNotEmpty) ? v : null;
                        setState(() => alatId = nv);
                        if (nv != null) await _loadPreviousEntry(nv);
                        else setState(() { previousEngineHour = null; previousRecordedAt = null; });
                      },
                    ),
                    if (previousEngineHour != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 6.0, bottom: 6.0),
                        child: Text(
                          'Previous hour meter: ${previousEngineHour!.toString()} (${previousRecordedAt != null ? previousRecordedAt!.toLocal().toString() : 'unknown'})',
                          style: TextStyle(color: Theme.of(context).textTheme.bodySmall?.color ?? Colors.grey, fontSize: 12),
                        ),
                      ),
                    if (previousEngineHour == null)
                      Padding(
                        padding: const EdgeInsets.only(top: 6.0, bottom: 6.0),
                        child: Text(
                          'No previous hour meter found for selected alat.',
                          style: TextStyle(color: Theme.of(context).textTheme.bodySmall?.color ?? Colors.grey, fontSize: 12),
                        ),
                      ),

                    if (filteredAlats.isEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 8.0, bottom: 8.0),
                        child: Text('No alat available for your site. Loaded ${alats.length} alats total.', style: TextStyle(color: Theme.of(context).colorScheme.error)),
                      ),
                    const SizedBox(height: 8),
                    TextFormField(
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      inputFormatters: [
                        FilteringTextInputFormatter.allow(RegExp(r'[0-9\.]')),
                        // prevent multiple decimal points
                        TextInputFormatter.withFunction((oldValue, newValue) {
                          final text = newValue.text;
                          if (text.indexOf('.') != text.lastIndexOf('.')) return oldValue;
                          return newValue;
                        }),
                      ],
                      decoration: const InputDecoration(labelText: 'Engine/Hour Meter'),
                      onChanged: (v) => setState(() => engineHour = v),
                      initialValue: engineHour,
                    ),
                    const SizedBox(height: 8),
                    Row(children: [
                      Expanded(child: Text(recordedAt == null ? 'No date/time selected' : recordedAt!.toLocal().toString())),
                      TextButton(onPressed: _pickDateTime, child: const Text('Pick'))
                    ]),
                    const SizedBox(height: 8),
                    TextFormField(
                      decoration: const InputDecoration(labelText: 'Notes'),
                      onChanged: (v) => setState(() => notes = v),
                      initialValue: notes,
                      minLines: 2,
                      maxLines: 4,
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton(onPressed: _submit, child: const Text('Save'))
                  ],
                ),
              ),
      ),
    );
  }
}
