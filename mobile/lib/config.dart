// Centralized configuration for mobile app
// Supports compile-time environment selection via --dart-define
const String _env = String.fromEnvironment('ENV', defaultValue: 'prod');
const String _envApiBase = String.fromEnvironment('API_BASE', defaultValue: '');

enum Flavor { dev, staging, prod }

class Config {
  static Flavor get flavor {
    switch (_env) {
      case 'dev':
        return Flavor.dev;
      case 'staging':
        return Flavor.staging;
      default:
        return Flavor.prod;
    }
  }

  static String get apiBase {
    if (_envApiBase.isNotEmpty) return _envApiBase;
    switch (flavor) {
      case Flavor.dev:
        return 'http://localhost:4000/api';
      case Flavor.staging:
        return 'https://staging.sigap.jasamaritim.co.id/api';
      case Flavor.prod:
      default:
        // Use plain HTTP for production API by default (can be overridden with --dart-define=API_BASE)
        return 'http://sigap.jasamaritim.co.id/api';
    }
  }
}

// Backwards-compatible variable used throughout the app
final String API_BASE = Config.apiBase;
