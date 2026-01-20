import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:package_info_plus/package_info_plus.dart';
import '../services/api.dart';
import '../config.dart';
import '../screens/profile.dart';
import '../screens/checklist.dart';
import '../screens/checklist_history.dart';
import '../screens/daily_work_orders.dart';
import '../screens/login.dart';

class AppDrawer extends StatefulWidget {
  const AppDrawer({super.key});

  @override
  State<AppDrawer> createState() => _AppDrawerState();
}

class _AppDrawerState extends State<AppDrawer> {
  Map<String, dynamic>? user;
  bool loading = false;
  String _version = '';
  int _dailyCount = 0;
  bool _loadingDailyCount = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
    _loadVersion();
    _loadDailyCount();
  }

  Future<void> _loadVersion() async {
    try {
      final info = await PackageInfo.fromPlatform();
      setState(() { _version = '${info.version}+${info.buildNumber}'; });
    } catch (_) {
      // ignore
    }
  }

  Future<void> _loadProfile() async {
    setState(() { loading = true; });
    final p = await SharedPreferences.getInstance();
    final token = p.getString('api_token') ?? '';
    if (token.isEmpty) { setState(() { loading = false; }); return; }
    try {
      final api = ApiClient(baseUrl: API_BASE, token: token);
      final res = await api.get('/auth/me');
      setState(() { user = (res is Map) ? res : (res['data'] ?? res); });
    } catch (e) {
      debugPrint('AppDrawer: failed to load profile: $e');
    } finally {
      setState(() { loading = false; });
    }
  }

  Future<void> _loadDailyCount() async {
    setState(() { _loadingDailyCount = true; });
    try {
      final p = await SharedPreferences.getInstance();
      final token = p.getString('api_token') ?? '';
      if (token.isEmpty) { setState(() { _loadingDailyCount = false; }); return; }
      final api = ApiClient(baseUrl: API_BASE, token: token);
      final today = DateTime.now();
      final dateStr = '${today.year.toString().padLeft(4,'0')}-${today.month.toString().padLeft(2,'0')}-${today.day.toString().padLeft(2,'0')}';

      // Fetch DAILY work orders for today and count only those with status containing 'DEPLOYED'
      try {
        final techId = p.getString('tech_id') ?? '';
        final r2 = await api.get('/work-orders?page=1&pageSize=1000&date=${Uri.encodeComponent(dateStr)}&work_type=DAILY');
        final rows = r2 is Map ? (r2['data'] ?? r2) : r2;
        int deployedCount = 0;
        if (rows is List) {
          try {
            deployedCount = rows.where((w) {
              try {
                final s = (w is Map) ? ((w['status'] ?? w['raw']?['status'] ?? w['raw']?['work_status']) ?? '') : '';
                if (!s.toString().toUpperCase().contains('DEPLOYED')) return false;

                if (techId.isEmpty) return true;

                // check assigned users / assignees / assigned_to fields
                bool assigned = false;
                if (w is Map) {
                  final au = w['assigned_users'] ?? w['assigned'] ?? w['assignees'] ?? w['assigned_to'];
                  if (au is List) {
                    for (final u in au) {
                      try {
                        if (u == null) continue;
                        if (u is Map) {
                          final id = (u['id'] ?? u['user_id'] ?? u['nipp'] ?? u['nipp_id'])?.toString() ?? '';
                          if (id.isNotEmpty && id == techId) { assigned = true; break; }
                          final uname = (u['name'] ?? u['username'] ?? '')?.toString() ?? '';
                          if (uname.isNotEmpty && uname == techId) { assigned = true; break; }
                        } else {
                          if (u.toString() == techId) { assigned = true; break; }
                        }
                      } catch (_) {}
                    }
                  }

                  if (!assigned) {
                    final at = w['assigned_to'] ?? w['assignee'] ?? w['assigned'];
                    if (at != null) {
                      if (at is Map) {
                        final id = (at['id'] ?? at['user_id'] ?? at['nipp'])?.toString() ?? '';
                        if (id.isNotEmpty && id == techId) assigned = true;
                        final name = (at['name'] ?? '')?.toString() ?? '';
                        if (!assigned && name.isNotEmpty && name == techId) assigned = true;
                      } else {
                        if (at.toString() == techId) assigned = true;
                      }
                    }
                  }

                  if (!assigned) {
                    try {
                      final raw = w['raw'] ?? {};
                      final rau = raw['assigned_users'] ?? raw['assigned_to'] ?? raw['assignees'];
                      if (rau is List) {
                        for (final u in rau) {
                          try {
                            if (u is Map) {
                              final id = (u['id'] ?? u['user_id'] ?? u['nipp'])?.toString() ?? '';
                              if (id == techId) { assigned = true; break; }
                            } else if (u.toString() == techId) { assigned = true; break; }
                          } catch (_) {}
                        }
                      }
                      final rat = raw['assigned_to'] ?? raw['assignee'];
                      if (!assigned && rat != null) {
                        if (rat is Map) {
                          final id = (rat['id'] ?? rat['user_id'] ?? rat['nipp'])?.toString() ?? '';
                          if (id == techId) assigned = true;
                        } else if (rat.toString() == techId) assigned = true;
                      }
                    } catch (_) {}
                  }
                }

                return assigned;
              } catch (_) { return false; }
            }).length;
          } catch (_) { deployedCount = rows.length; }
        }
        setState(() { _dailyCount = deployedCount; });
      } catch (_) {
        // fallback: no count available
        setState(() { _dailyCount = 0; });
      }
    } catch (e) {
      debugPrint('AppDrawer: failed to load daily count: $e');
    } finally {
      setState(() { _loadingDailyCount = false; });
    }
  }

  String _initials(String? name) {
    if (name == null || name.trim().isEmpty) return 'U';
    final parts = name.trim().split(RegExp(r'\s+'));
    if (parts.length == 1) return parts.first.substring(0, 1).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  Future<void> _logout() async {
    final p = await SharedPreferences.getInstance();
    await p.remove('api_token');
    await p.remove('tech_id');
    if (!mounted) return;
    Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const LoginScreen()), (r) => false);
  }

  @override
  Widget build(BuildContext context) {
    final name = user?['username'] ?? user?['name'] ?? '';
    final email = user?['email'] ?? '';
    return Drawer(
      child: SafeArea(
        child: Column(
          children: [
            DrawerHeader(
              decoration: const BoxDecoration(color: Color(0xFF4A148C)),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 36,
                    backgroundColor: Theme.of(context).colorScheme.primary,
                    child: Text(_initials(name), style: TextStyle(color: Theme.of(context).colorScheme.onPrimary, fontSize: 20, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          name.isEmpty ? 'Unknown User' : name,
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          email,
                          style: const TextStyle(fontSize: 12, color: Colors.white70),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            ListTile(
              leading: const Icon(Icons.person),
              title: const Text('Profile'),
              onTap: () async {
                Navigator.pop(context);
                await Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfileScreen()));
                await _loadProfile();
              },
            ),
            ListTile(
              leading: const Icon(Icons.checklist),
              title: const Text('Checklist'),
              onTap: () async {
                Navigator.pop(context);
                await Navigator.push(context, MaterialPageRoute(builder: (_) => const ChecklistScreen()));
              },
            ),
            ListTile(
              leading: const Icon(Icons.today),
              title: const Text('Daily Work Orders'),
              trailing: _loadingDailyCount ? const SizedBox(width:24, height:24, child: CircularProgressIndicator(strokeWidth:2)) : (_dailyCount > 0 ? Container(
                padding: const EdgeInsets.symmetric(horizontal:8, vertical:4),
                decoration: BoxDecoration(color: Theme.of(context).colorScheme.primary, borderRadius: BorderRadius.circular(12)),
                child: Text('$_dailyCount', style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
              ) : null),
              onTap: () async {
                Navigator.pop(context);
                await Navigator.push(context, MaterialPageRoute(builder: (_) => const DailyWorkOrdersScreen()));
                // refresh the count after returning
                await _loadDailyCount();
              },
            ),
            ListTile(
              leading: const Icon(Icons.history),
              title: const Text('Checklist History'),
              onTap: () async {
                Navigator.pop(context);
                await Navigator.push(context, MaterialPageRoute(builder: (_) => const ChecklistHistoryScreen()));
              },
            ),
            ListTile(leading: const Icon(Icons.logout), title: const Text('Logout'), onTap: () async { Navigator.pop(context); await _logout(); }),
            const Spacer(),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 16.0),
              child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                const Text('App version', style: TextStyle(color: Colors.grey)),
                Text(_version.isNotEmpty ? _version : '-', style: const TextStyle(fontSize: 12, color: Colors.grey)),
              ]),
            ),
          ],
        ),
      ),
    );
  }
}
