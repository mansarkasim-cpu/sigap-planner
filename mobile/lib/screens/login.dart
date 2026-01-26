import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/api.dart';
import '../config.dart';
import 'inbox.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _nippController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool loading = false;
  bool _obscurePassword = true;

  @override
  void initState() {
    super.initState();
    _checkSaved();
  }

  Future<void> _checkSaved() async {
    final p = await SharedPreferences.getInstance();
    final token = p.getString('api_token') ?? '';
    final tech = p.getString('tech_id') ?? '';
    if (token.isNotEmpty && tech.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.pushReplacement(
            context, MaterialPageRoute(builder: (_) => InboxScreen()));
      });
    }
  }

  Future<void> _login() async {
    final base = API_BASE;
    final nipp = _nippController.text.trim();
    final pass = _passwordController.text;
    if (base.isEmpty || nipp.isEmpty || pass.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('NIPP and password are required')));
      return;
    }
    setState(() {
      loading = true;
    });
    try {
      final api = ApiClient(baseUrl: base);
      final res =
          await api.post('/auth/login', {'nipp': nipp, 'password': pass});
      final token = res['accessToken'] ?? res['token'] ?? '';
      final user = res['user'] ?? {};
      final userId = (user is Map) ? (user['id'] ?? '') : '';
      final p = await SharedPreferences.getInstance();
      await p.setString('api_token', token.toString());
      await p.setString('tech_id', userId.toString());
      Navigator.pushReplacement(
          context, MaterialPageRoute(builder: (_) => InboxScreen()));
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Login failed: $e')));
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = Theme.of(context).colorScheme.primary;
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircleAvatar(
                radius: 48,
                backgroundColor: color,
                child: const Icon(Icons.build_circle,
                    size: 48, color: Colors.white),
              ),
              const SizedBox(height: 16),
              Text('SIGAP Technician',
                  style: Theme.of(context)
                      .textTheme
                      .headlineSmall
                      ?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Text('Sign in to see your assignments',
                  style: Theme.of(context).textTheme.bodyMedium,
                  textAlign: TextAlign.center),
              const SizedBox(height: 20),
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      TextField(
                        controller: _nippController,
                        decoration: const InputDecoration(
                            labelText: 'NIPP', prefixIcon: Icon(Icons.badge)),
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _passwordController,
                        decoration: InputDecoration(
                          labelText: 'Password',
                          prefixIcon: const Icon(Icons.lock),
                          suffixIcon: IconButton(
                            icon: Icon(_obscurePassword
                                ? Icons.visibility_off
                                : Icons.visibility),
                            onPressed: () => setState(
                                () => _obscurePassword = !_obscurePassword),
                          ),
                        ),
                        obscureText: _obscurePassword,
                      ),
                      const SizedBox(height: 18),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: loading ? null : _login,
                          child: loading
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                      color: Colors.white, strokeWidth: 2))
                              : const Text('Sign in'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () async {
                  // quick help text
                  showAboutDialog(context: context, children: [
                    const Text(
                        'Contact your administrator if you have trouble signing in.')
                  ]);
                },
                child: const Text('Need help?'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
