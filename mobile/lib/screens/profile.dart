import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api.dart';
import '../config.dart';
import 'login.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
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
    try {
      final api = ApiClient(baseUrl: API_BASE, token: token);
      final res = await api.get('/auth/me');
      setState(() { user = (res is Map) ? res : (res['data'] ?? res); });
    } catch (e) {
      debugPrint('failed load profile: $e');
    } finally {
      setState(() { loading = false; });
    }
  }

  Future<void> _logout() async {
    final p = await SharedPreferences.getInstance();
    await p.remove('api_token');
    await p.remove('tech_id');
    Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const LoginScreen()), (r) => false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: loading ? const Center(child: CircularProgressIndicator()) : Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Name: ${user?['username'] ?? user?['name'] ?? '-'}'),
            const SizedBox(height: 8),
            Text('NIPP: ${user?['nipp'] ?? '-'}'),
            const SizedBox(height: 8),
            Text('Email: ${user?['email'] ?? '-'}'),
            const SizedBox(height: 8),
            Text('Role: ${user?['role'] ?? '-'}'),
            const SizedBox(height: 24),
            ElevatedButton.icon(onPressed: _logout, icon: const Icon(Icons.logout), label: const Text('Logout')),
          ],
        ),
      ),
    );
  }
}
