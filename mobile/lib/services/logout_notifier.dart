import 'dart:async';

class LogoutNotifier {
  LogoutNotifier._internal();
  static final LogoutNotifier instance = LogoutNotifier._internal();

  final StreamController<void> _ctrl = StreamController<void>.broadcast();

  void notify() => _ctrl.add(null);

  Stream<void> get stream => _ctrl.stream;

  void dispose() {
    _ctrl.close();
  }
}
