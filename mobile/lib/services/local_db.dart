// Conditional export: choose IO implementation on native, stub on web
export 'local_db_io.dart' if (dart.library.html) 'local_db_stub.dart';