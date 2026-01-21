// Shared date utilities for mobile app
String formatUtcDisplay(dynamic raw, [String? tzIana]) {
  if (raw == null) return '-';
  final s = raw.toString().trim();
  final sqlRx = RegExp(r'^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?\$');
  final m = sqlRx.firstMatch(s);
  DateTime? dt;
  if (m != null) {
    final yy = int.parse(m.group(1)!);
    final mm = int.parse(m.group(2)!);
    final dd = int.parse(m.group(3)!);
    final hh = m.group(4) != null ? int.parse(m.group(4)!) : 0;
    final mi = m.group(5) != null ? int.parse(m.group(5)!) : 0;
    final ss = m.group(6) != null ? int.parse(m.group(6)!) : 0;
    dt = DateTime.utc(yy, mm, dd, hh, mi, ss);
  } else {
    try {
      dt = DateTime.parse(s);
    } catch (_) {
      return '-';
    }
  }
  final dtUtc = dt.toUtc();
  int? _tzOffsetHours(String? tz) {
    if (tz == null) return null;
    final t = tz.toLowerCase();
    if (t.contains('jakarta') || t.contains('wib')) return 7;
    if (t.contains('makassar') || t.contains('wita')) return 8;
    if (t.contains('jayapura') || t.contains('wit')) return 9;
    return null;
  }
  String _tzAbbrev(String? tz) {
    if (tz == null) return '';
    final t = tz.toLowerCase();
    if (t.contains('jakarta') || t.contains('wib')) return 'WIB';
    if (t.contains('makassar') || t.contains('wita')) return 'WITA';
    if (t.contains('jayapura') || t.contains('wit')) return 'WIT';
    return '';
  }
  final offset = _tzOffsetHours(tzIana);
  final displayDt = (offset != null) ? dtUtc.add(Duration(hours: offset)) : dtUtc;
  final abbrev = _tzAbbrev(tzIana);
  String pad(int n) => n.toString().padLeft(2, '0');
  final out = '${pad(displayDt.day)}/${pad(displayDt.month)}/${displayDt.year} ${pad(displayDt.hour)}:${pad(displayDt.minute)}';
  return abbrev.isNotEmpty ? '$out $abbrev' : out;
}

String? extractTimezone(dynamic obj) {
  try {
    if (obj is Map) {
      if (obj.containsKey('site_timezone')) return obj['site_timezone']?.toString();
      if (obj.containsKey('timezone')) return obj['timezone']?.toString();
      final site = obj['site'] ?? obj['raw']?['site'] ?? obj['vendor_cabang'] ?? obj['location'] ?? null;
      if (site is Map) {
        if (site['timezone'] != null) return site['timezone'].toString();
        if (site['code'] != null && site['code'].toString().isNotEmpty) {
          final s = site['code'].toString().toLowerCase();
          if (s.contains('makassar')) return 'Asia/Makassar';
          if (s.contains('jayapura')) return 'Asia/Jayapura';
          if (s.contains('jakarta')) return 'Asia/Jakarta';
        }
      } else if (site is String && site.isNotEmpty) {
        final s = site.toLowerCase();
        if (s.contains('makassar')) return 'Asia/Makassar';
        if (s.contains('jayapura')) return 'Asia/Jayapura';
        if (s.contains('jakarta')) return 'Asia/Jakarta';
      }
      final raw = obj['raw'];
      if (raw is Map) {
        if (raw['site_timezone'] != null) return raw['site_timezone'].toString();
        if (raw['timezone'] != null) return raw['timezone'].toString();
        final rsite = raw['site'] ?? raw['vendor_cabang'];
        if (rsite is String) {
          final s = rsite.toLowerCase();
          if (s.contains('makassar')) return 'Asia/Makassar';
          if (s.contains('jayapura')) return 'Asia/Jayapura';
          if (s.contains('jakarta')) return 'Asia/Jakarta';
        }
      }
    }
  } catch (e) {}
  return null;
}
