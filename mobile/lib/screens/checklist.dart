import 'package:flutter/material.dart';
import '../services/api.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'dart:convert';
import '../config.dart';

// Minimal fallback for location functionality to avoid requiring the
// external 'location' package; replace with the real package in production.
enum PermissionStatus { granted, denied }

class Location {
  Future<PermissionStatus> hasPermission() async => PermissionStatus.granted;
  Future<PermissionStatus> requestPermission() async => PermissionStatus.granted;
  Future<bool> serviceEnabled() async => true;
  Future<bool> requestService() async => true;
  Future<LocationData> getLocation() async => LocationData(latitude: 0.0, longitude: 0.0);
}

class LocationData {
  final double? latitude;
  final double? longitude;
  LocationData({this.latitude, this.longitude});
}

class ChecklistScreen extends StatefulWidget {
  const ChecklistScreen({super.key});

  @override
  State<ChecklistScreen> createState() => _ChecklistScreenState();
}

class _ChecklistScreenState extends State<ChecklistScreen> {
  String _token = '';
  bool loading = false;
  List<dynamic> alats = [];
  List<dynamic> jenis = [];
  List<dynamic> questions = [];
  Set<int> doneTodayAlatIds = {};

  dynamic selectedAlat;
  dynamic selectedJenis;
  String notes = '';
  double? latitude;
  double? longitude;

  @override
  void initState() {
    super.initState();
    _loadPrefs();
  }

  Future<void> _loadPrefs() async {
    final p = await SharedPreferences.getInstance();
    setState(() { _token = p.getString('api_token') ?? ''; });
    await loadRefs();
  }

  Future<void> loadRefs() async {
    setState(() { loading = true; });
    try {
      // validate required fields
      final missing = <int, List<String>>{};
      for (var i = 0; i < questions.length; i++) {
        final q = questions[i];
        try {
          final bool isRequired = (q['required'] == null) ? true : (q['required'] == true || q['required'].toString() == '1');
          final qtype = (q['input_type'] ?? 'boolean').toString();
          final answer = q['answer'];
          final errs = <String>[];
          if (isRequired) {
            if (qtype == 'boolean') {
              if (answer == null) errs.add('jawaban');
              // if answered No, require note and photo as evidence
              if (answer == false) {
                final note = (q['note'] ?? '').toString().trim();
                final photo = q['photo'];
                if (note.isEmpty) errs.add('keterangan');
                if (photo == null) errs.add('foto');
              }
            } else if (qtype == 'select' || qtype == 'multiselect') {
              if (answer == null || (answer is String && answer.trim().isEmpty) || (answer is List && answer.isEmpty)) errs.add('jawaban');
            } else if (qtype == 'text' || qtype == 'number' || qtype == 'datetime') {
              if (answer == null || answer.toString().trim().isEmpty) errs.add('jawaban');
            }
          } else {
            // optional: if answered No for boolean, still require evidence
            if (qtype == 'boolean' && answer == false) {
              final note = (q['note'] ?? '').toString().trim();
              final photo = q['photo'];
              if (note.isEmpty) errs.add('keterangan');
              if (photo == null) errs.add('foto');
            }
          }
          if (errs.isNotEmpty) missing[i+1] = errs;
        } catch (_) {}
      }
      if (missing.isNotEmpty) {
        final parts = missing.entries.map((e) => 'Q${e.key}: ' + e.value.join(', ')).join('; ');
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Missing required fields — $parts')));
        setState((){ loading = false; });
        return;
      }
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      final ares = await api.get('/master/alats');
      final jres = await api.get('/master/jenis-alat');

      Future<void> fetchDoneToday() async {
        try {
          final api = ApiClient(baseUrl: API_BASE, token: _token);
          // fetch recent checklists for today (server supports date filter)
          final today = DateTime.now();
          final dateStr = '${today.year.toString().padLeft(4,'0')}-${today.month.toString().padLeft(2,'0')}-${today.day.toString().padLeft(2,'0')}';
          final res = await api.get('/mobile/checklists?date=${Uri.encodeComponent(dateStr)}&page=1&pageSize=500');
          final rows = res is Map ? (res['data'] ?? res) : res;
          final seen = <int>{};
          if (rows is List) {
            for (final r in rows) {
              try {
                final performed = (r is Map) ? (r['performed_at'] ?? r['created_at'] ?? r['performedAt']) : null;
                if (performed == null) continue;
                final dt = DateTime.parse(performed.toString()).toLocal();
                if (dt.year == today.year && dt.month == today.month && dt.day == today.day) {
                  final alat = (r is Map) ? (r['alat'] ?? {}) : {};
                  final aid = (alat is Map) ? (alat['id'] ?? alat['alat_id']) : null;
                  if (aid != null) {
                    final idn = int.tryParse(aid.toString());
                    if (idn != null) seen.add(idn);
                  }
                }
              } catch (_) {}
            }
          }
          setState(() { doneTodayAlatIds = seen; });
          // if currently selected alat is already done today, clear selection
          try {
            if (selectedAlat != null) {
              final curId = (selectedAlat['id'] ?? selectedAlat['alat_id']);
              if (curId != null && seen.contains(int.tryParse(curId.toString()))) {
                setState(() { selectedAlat = null; questions = []; });
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Selected alat already checked today and was cleared.')));
              }
            }
          } catch (_) {}
        } catch (e) {
          debugPrint('fetchDoneToday failed: $e');
        }
      }

      setState(() {
        alats = ares is List ? ares : (ares is Map ? (ares['data'] ?? []) : []);
        jenis = jres is List ? jres : (jres is Map ? (jres['data'] ?? []) : []);
      });
      // also load which alats have been checked today to hide them
      await fetchDoneToday();
    } catch (e) {
      debugPrint('loadRefs failed: $e');
    } finally {
      setState(() { loading = false; });
    }
  }

  Future<void> loadQuestionsForAlat(int alatId) async {
    setState(() { loading = true; questions = []; });
    try {
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      // fetch questions filtered by jenis_alat if alat has jenis_alat
      final alatJenisId = selectedAlat != null && selectedAlat['jenis_alat'] != null ? (selectedAlat['jenis_alat']['id'] ?? selectedAlat['jenis_alat']['jenis_alat_id']) : null;
      String url = '/master/questions';
      final params = <String, String>{};
      if (alatJenisId != null) params['jenis_alat_id'] = alatJenisId.toString();
      if (params.isNotEmpty) url += '?' + params.entries.map((e) => '${Uri.encodeComponent(e.key)}=${Uri.encodeComponent(e.value)}').join('&');
      final res = await api.get(url);
      final rows = res is Map ? (res['data'] ?? res) : res;
      // normalize options shape (support various backend shapes)
      var normalized = rows is List ? rows.map((r) {
        List opts = [];
        if (r is Map) {
          if (r['options'] is List) opts = r['options'];
          else if (r['master_checklist_options'] is List) opts = r['master_checklist_options'];
          else if (r['choices'] is List) opts = r['choices'];
          else if (r['values'] is List) opts = r['values'];
          // normalize simple string arrays into option objects
          if (opts.isNotEmpty && opts.first is String) {
            opts = opts.asMap().entries.map((e) => {'option_text': e.value, 'option_value': e.value, 'id': e.key}).toList();
          }
        }
        return {...(r is Map ? r : {}), 'options': opts, 'answer': null};
      }).toList() : [];

      setState(() { questions = normalized; });

      // for any select questions with empty options, try fetching options individually
      try {
        for (var i = 0; i < (normalized as List).length; i++) {
          final q = normalized[i];
          final qtype = (q['input_type'] ?? 'boolean').toString();
          final qid = q['id'];
          if ((qtype == 'select' || qtype == 'multiselect') && (q['options'] == null || (q['options'] is List && q['options'].isEmpty)) && qid != null) {
            try {
              final ores = await api.get('/master/options?question_id=${Uri.encodeComponent(qid.toString())}');
              final orows = ores is Map ? (ores['data'] ?? ores) : ores;
              List opts = [];
              if (orows is List) {
                opts = orows.map((o) => (o is Map) ? o : {'option_text': o.toString(), 'option_value': o, 'id': null}).toList();
              }
              // update question
              final newList = List<dynamic>.from(questions);
              final orig = newList[i];
              final copied = (orig is Map) ? Map<String, dynamic>.from(orig) : {'answer': orig};
              copied['options'] = opts;
              newList[i] = copied;
              setState(() { questions = newList; });
            } catch (e) {
              debugPrint('fetch options for q $qid failed: $e');
            }
          }
        }
      } catch (_) {}
    } catch (e) {
      debugPrint('loadQuestions failed: $e');
    } finally {
      setState(() { loading = false; });
    }
  }

  Future<void> captureLocation() async {
    try {
      final loc = Location();
      final hasPerm = await loc.hasPermission();
      if (hasPerm == PermissionStatus.denied) await loc.requestPermission();
      final enabled = await loc.serviceEnabled();
      if (!enabled) await loc.requestService();
      final pos = await loc.getLocation();
      setState(() { latitude = pos.latitude; longitude = pos.longitude; });
    } catch (e) {
      debugPrint('location error: $e');
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to get location: $e')));
    }
  }

  void _setAnswer(int idx, dynamic value) {
    try {
      if (idx < 0 || idx >= questions.length) return;
      final newList = List<dynamic>.from(questions);
      final orig = newList[idx];
      final copied = (orig is Map) ? Map<String, dynamic>.from(orig) : {'answer': orig};
      copied['answer'] = value;
      newList[idx] = copied;
      setState(() { questions = newList; });
    } catch (e) {
      debugPrint('setAnswer failed: $e');
    }
  }

  void _setQuestionField(int idx, String key, dynamic value) {
    try {
      if (idx < 0 || idx >= questions.length) return;
      final newList = List<dynamic>.from(questions);
      final orig = newList[idx];
      final copied = (orig is Map) ? Map<String, dynamic>.from(orig) : {'answer': orig};
      copied[key] = value;
      newList[idx] = copied;
      setState(() { questions = newList; });
    } catch (e) {
      debugPrint('setQuestionField failed: $e');
    }
  }

  Future<void> _pickQuestionPhoto(int idx) async {
    try {
      final picker = ImagePicker();
      try {
        final picked = await picker.pickImage(source: ImageSource.camera, maxWidth: 1280);
        if (picked != null) {
          _setQuestionField(idx, 'photo', picked.path);
          return;
        }
      } catch (e) {
        // camera may be unsupported on desktop; fallback to gallery
        debugPrint('camera pick failed, will try gallery: $e');
      }
      // Try gallery next
      try {
        final picked = await picker.pickImage(source: ImageSource.gallery, maxWidth: 1280);
        if (picked != null) {
          _setQuestionField(idx, 'photo', picked.path);
          return;
        }
      } catch (e) {
        debugPrint('gallery pick failed: $e');
      }

      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('No photo selected or camera not available')));
    } catch (e) {
      debugPrint('pick photo failed: $e');
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to pick photo: $e')));
    }
  }

  Widget _buildQuestionRow(dynamic q, int idx) {
    final qtype = (q['input_type'] ?? 'boolean').toString();
    final bool isRequired = (q['required'] == null) ? true : (q['required'] == true || q['required'].toString() == '1');
    final opts = q['options'] is List ? q['options'] as List : [];
    return Card(
      key: ValueKey(q is Map ? (q['id'] ?? idx) : idx),
      margin: const EdgeInsets.symmetric(vertical: 6),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Expanded(child: Text.rich(TextSpan(children: [
              TextSpan(text: '${idx+1}. ${q['question_text']}', style: const TextStyle(fontWeight: FontWeight.w600)),
              if (isRequired) const TextSpan(text: ' *', style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
            ]))),
          ]),
          const SizedBox(height: 8),
          if (qtype == 'boolean') Row(children: [
            ChoiceChip(label: const Text('Yes'), selected: q['answer'] == true, onSelected: (v){ _setAnswer(idx, v ? true : false); }),
            const SizedBox(width:8),
            ChoiceChip(label: const Text('No'), selected: q['answer'] == false, onSelected: (v){ _setAnswer(idx, v ? false : null); }),
          ]),
          if (qtype == 'boolean' && q['answer'] == false) ...[
            const SizedBox(height: 8),
            TextFormField(
              initialValue: q['note']?.toString() ?? '',
              decoration: const InputDecoration(labelText: 'Keterangan (wajib jika "No")'),
              maxLines: 2,
              onChanged: (t) => _setQuestionField(idx, 'note', t),
            ),
            const SizedBox(height: 8),
            Wrap(spacing: 8, crossAxisAlignment: WrapCrossAlignment.center, children: [
              if (q['photo'] != null)
                GestureDetector(
                  onTap: () {
                    try { showDialog(context: context, builder: (c) => Dialog(child: InteractiveViewer(child: Image.file(File(q['photo'])))) ); } catch (_) {}
                  },
                  child: ClipRRect(borderRadius: BorderRadius.circular(6), child: Image.file(File(q['photo']), width: 64, height: 64, fit: BoxFit.cover)),
                ),
              IntrinsicWidth(child: ElevatedButton.icon(onPressed: () => _pickQuestionPhoto(idx), icon: const Icon(Icons.camera_alt), label: const Text('Attach Photo'))),
            ]),
          ],
          if (qtype == 'text') TextField(decoration: const InputDecoration(hintText: 'Answer'), onChanged: (t){ _setAnswer(idx, t); }),
          if (qtype == 'number') TextField(decoration: const InputDecoration(hintText: 'Number'), keyboardType: TextInputType.number, onChanged: (t){ _setAnswer(idx, double.tryParse(t)); }),
          if (qtype == 'select') Column(children: opts.map<Widget>((o) => ListTile(title: Text(o['option_text'] ?? o.toString()), leading: Radio(value: o['id'] ?? o['option_value'] ?? o['option_text'], groupValue: q['answer'], onChanged: (v){ _setAnswer(idx, v); }))).toList()),
        ]),
      ),
    );
  }

  Future<void> submitChecklist() async {
    if (selectedAlat == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Select alat first')));
      return;
    }
    // client-side validation: ensure required questions have answers and evidence when needed
    final missing = <int, List<String>>{};
    for (var i = 0; i < questions.length; i++) {
      final q = questions[i];
      try {
        final bool isRequired = (q['required'] == null) ? true : (q['required'] == true || q['required'].toString() == '1');
        final qtype = (q['input_type'] ?? 'boolean').toString();
        final answer = q['answer'];
        final errs = <String>[];
        if (isRequired) {
          if (qtype == 'boolean') {
            if (answer == null) errs.add('jawaban');
            if (answer == false) {
              final note = (q['note'] ?? '').toString().trim();
              final photo = q['photo'] ?? q['evidence_photo_path'] ?? q['evidence_photo_url'];
              if (note.isEmpty) errs.add('keterangan');
              if (photo == null) errs.add('foto');
            }
          } else if (qtype == 'select' || qtype == 'multiselect') {
            if (answer == null || (answer is String && answer.trim().isEmpty) || (answer is List && answer.isEmpty)) errs.add('jawaban');
          } else if (qtype == 'text' || qtype == 'number' || qtype == 'datetime') {
            if (answer == null || answer.toString().trim().isEmpty) errs.add('jawaban');
          }
        } else {
          // optional: if answered No for boolean, still require evidence
          if (qtype == 'boolean' && answer == false) {
            final note = (q['note'] ?? '').toString().trim();
            final photo = q['photo'] ?? q['evidence_photo_path'] ?? q['evidence_photo_url'];
            if (note.isEmpty) errs.add('keterangan');
            if (photo == null) errs.add('foto');
          }
        }
        if (errs.isNotEmpty) missing[i+1] = errs;
      } catch (_) {}
    }
    if (missing.isNotEmpty) {
      final parts = missing.entries.map((e) => 'Q${e.key}: ' + e.value.join(', ')).join('; ');
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Missing required fields — $parts')));
      return;
    }
    setState(() { loading = true; });
    try {
      // ensure location
      if (latitude == null || longitude == null) await captureLocation();
      final api = ApiClient(baseUrl: API_BASE, token: _token);
      // build items list; include base64 photo when a local photo was attached
      final itemsList = <Map<String,dynamic>>[];
      for (final q in questions) {
        final item = <String, dynamic>{ 'question_id': q['id'] };
        if (q['answer'] != null) {
          if (q['input_type'] == 'number') item['answer_number'] = q['answer'];
          else item['answer_text'] = q['answer'].toString();
        }
        if (q['note'] != null && q['note'].toString().isNotEmpty) item['evidence_note'] = q['note'];
        final photoPath = q['photo'];
        if (photoPath != null) {
          try {
            final f = File(photoPath.toString());
            if (await f.exists()) {
              final bytes = await f.readAsBytes();
              item['evidence_photo_base64'] = base64Encode(bytes);
            } else {
              // if file doesn't exist (could be a URL), send as photo path for server to accept if public
              item['evidence_photo_path'] = photoPath.toString();
            }
          } catch (e) {
            // fallback: include path as-is
            item['evidence_photo_path'] = photoPath.toString();
          }
        }
        itemsList.add(item);
      }

      final payload = {
        'alat_id': selectedAlat['id'],
        'site_id': selectedAlat['site'] != null ? selectedAlat['site']['id'] : null,
        'performed_at': DateTime.now().toIso8601String(),
        'notes': notes,
        'latitude': latitude,
        'longitude': longitude,
        'items': itemsList,
      };
      final res = await api.post('/mobile/checklists', payload);
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Checklist submitted')));
      // clear entire form (immutable) and refresh references so done-today list updates
      setState((){
        selectedAlat = null;
        questions = [];
        notes = '';
        latitude = null;
        longitude = null;
      });
      try {
        await loadRefs();
      } catch (_) {}
    } catch (e) {
      debugPrint('submit failed: $e');
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Submit failed: $e')));
    } finally {
      setState((){ loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Daily Checklist')),
      body: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(children: [
          Row(children: [
            Expanded(child: DropdownButtonFormField<int>(
              value: selectedAlat != null ? selectedAlat['id'] : null,
              items: (alats is List ? alats.where((a) {
                try {
                  final id = a['id'] ?? a['alat_id'];
                  if (id == null) return true;
                  final idn = int.tryParse(id.toString());
                  if (idn == null) return true;
                  return !doneTodayAlatIds.contains(idn);
                } catch (_) { return true; }
              }).toList() : []).map<DropdownMenuItem<int>>((a) => DropdownMenuItem(value: a['id'], child: Text(a['nama'] ?? a['kode'] ?? 'Alat'))).toList(),
              onChanged: (v) {
                if (v == null) {
                  setState(() { selectedAlat = null; questions = []; });
                  return;
                }
                try {
                  final sel = alats.firstWhere((e) => e['id'] == v);
                  setState(() { selectedAlat = sel; });
                  loadQuestionsForAlat(v);
                } catch (e) {
                  debugPrint('failed to select alat: $e');
                }
              },
              decoration: const InputDecoration(labelText: 'Select Alat'),
            )),
          ]),
          const SizedBox(height: 12),
          if (loading) const LinearProgressIndicator(),
          Expanded(child: ListView(children: [
            ...questions.asMap().entries.map((e) => _buildQuestionRow(e.value, e.key)).toList(),
            const SizedBox(height: 8),
            TextField(decoration: const InputDecoration(labelText: 'Notes'), maxLines: 3, onChanged: (t){ notes = t; }),
            const SizedBox(height: 8),
            Wrap(spacing: 12, crossAxisAlignment: WrapCrossAlignment.center, children: [
              IntrinsicWidth(child: ElevatedButton.icon(onPressed: captureLocation, icon: const Icon(Icons.my_location), label: const Text('Capture Location'))),
              if (latitude != null && longitude != null) Text('Lat: ${latitude!.toStringAsFixed(5)}, Lng: ${longitude!.toStringAsFixed(5)}')
            ]),
            const SizedBox(height: 12),
            Align(alignment: Alignment.centerLeft, child: ElevatedButton.icon(onPressed: submitChecklist, icon: const Icon(Icons.send), label: const Text('Submit Checklist')))
          ]))
        ]),
      ),
    );
  }
}
