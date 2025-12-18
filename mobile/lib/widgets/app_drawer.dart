import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api.dart';
import '../config.dart';
import '../screens/profile.dart';
import '../screens/login.dart';

class AppDrawer extends StatefulWidget {
  const AppDrawer({super.key});

  @override
  State<AppDrawer> createState() => _AppDrawerState();
}

class _AppDrawerState extends State<AppDrawer> {
  Map<String, dynamic>? user;
  bool loading = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
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
            ListTile(leading: const Icon(Icons.logout), title: const Text('Logout'), onTap: () async { Navigator.pop(context); await _logout(); }),
          ],
        ),
      ),
    );
  }
}
