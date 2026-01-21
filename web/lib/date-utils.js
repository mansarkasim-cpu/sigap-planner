// Shared date utilities: parse various date representations and format to IANA timezone
export function parseToUtcDate(input) {
  if (input == null) return null;
  // Firestore-like object { seconds, nanoseconds }
  if (typeof input === 'object' && input.seconds != null) {
    const s = Number(input.seconds) * 1000 + Math.round((input.nanoseconds || 0) / 1000000);
    return new Date(s);
  }
  if (input instanceof Date) return input;
  if (typeof input === 'number') return new Date(input);
  const s = String(input).trim();
  if (s === '') return null;

  // If numeric string (ms since epoch)
  if (/^\d+$/.test(s)) return new Date(Number(s));

  // YYYY-MM-DD or YYYY-MM-DDTHH:mm(:ss) - treat naive SQL/ISO as UTC
  const sqlRx = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?)?$/;
  const m = sqlRx.exec(s);
  if (m) {
    const year = Number(m[1]);
    const month = Number(m[2]) - 1;
    const day = Number(m[3]);
    const hour = Number(m[4] || '0');
    const minute = Number(m[5] || '0');
    const second = Number(m[6] || '0');
    const ms = m[7] ? Math.round(Number('0.' + m[7]) * 1000) : 0;
    return new Date(Date.UTC(year, month, day, hour, minute, second, ms));
  }

  // DD-MM-YYYY
  const dmyRx = /^(\d{2})-(\d{2})-(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;
  const m2 = dmyRx.exec(s);
  if (m2) {
    const day = Number(m2[1]);
    const month = Number(m2[2]) - 1;
    const year = Number(m2[3]);
    const hour = Number(m2[4] || '0');
    const minute = Number(m2[5] || '0');
    const second = Number(m2[6] || '0');
    return new Date(Date.UTC(year, month, day, hour, minute, second, 0));
  }

  // MM/DD/YYYY or other formats - fallback to Date.parse
  const parsed = new Date(s);
  if (!isNaN(parsed.getTime())) return parsed;
  return null;
}

export function formatUtcToZone(dateLike, timeZone, fallback = '-') {
  const s = dateLike == null ? '' : String(dateLike).trim();
  if (!s) return fallback;
  // Determine timezone: prefer provided `timeZone`, otherwise use client's IANA tz when available.
  let tz = timeZone;
  try {
    if (!tz && typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function') {
      const ro = Intl.DateTimeFormat().resolvedOptions();
      if (ro && ro.timeZone) tz = ro.timeZone;
    }
  } catch (e) {
    // ignore
  }
  if (!tz) tz = 'Asia/Jakarta';

  // If input looks like a naive SQL datetime (no timezone indicator), display components as-is
  // YYYY-MM-DD[ HH:MM(:SS)?]
  const naiveSqlRx = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;
  const mNaive = naiveSqlRx.exec(s);
  if (mNaive && !/[Zz]|[+-]\d{2}:?\d{2}$/.test(s)) {
    const year = mNaive[1];
    const month = mNaive[2];
    const day = mNaive[3];
    const hour = (mNaive[4] || '00');
    const minute = (mNaive[5] || '00');
    const abbr = getIndonesiaAbbrev(timeZone, /* date */ null);
    return `${day}/${month}/${year} ${hour}:${minute}${abbr ? ' ' + abbr : ''}`;
  }
  // DD-MM-YYYY naive format
  const naiveDmyRx = /^(\d{2})-(\d{2})-(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;
  const mNaive2 = naiveDmyRx.exec(s);
  if (mNaive2 && !/[Zz]|[+-]\d{2}:?\d{2}$/.test(s)) {
    const day = mNaive2[1];
    const month = mNaive2[2];
    const year = mNaive2[3];
    const hour = (mNaive2[4] || '00');
    const minute = (mNaive2[5] || '00');
    const abbr = getIndonesiaAbbrev(timeZone, /* date */ null);
    return `${day}/${month}/${year} ${hour}:${minute}${abbr ? ' ' + abbr : ''}`;
  }
  
  // helper: compute WIB/WITA/WIT for an IANA timezone and date
  function getIndonesiaAbbrev(tz, date) {
    try {
      // If date is null, use now
      const dt = date ? new Date(date) : new Date();
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(dt);
      const map = {};
      for (const p of parts) map[p.type] = p.value;
      const y = Number(map.year);
      const mo = Number(map.month) - 1;
      const da = Number(map.day);
      const hh = Number(map.hour);
      const mi = Number(map.minute);
      const utcEquivalent = Date.UTC(y, mo, da, hh, mi);
      const offsetHours = Math.round((utcEquivalent - dt.getTime()) / (60 * 60 * 1000));
      if (offsetHours === 7) return 'WIB';
      if (offsetHours === 8) return 'WITA';
      if (offsetHours === 9) return 'WIT';
      return '';
    } catch (e) {
      return '';
    }
  }
  const d = parseToUtcDate(dateLike);
  if (!d) return fallback;
  // Use Intl to render date/time in given IANA timezone
  try {
    const fmt = new Intl.DateTimeFormat('id-ID', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    // formatToParts to extract components reliably
    const parts = fmt.formatToParts(d);
    const map = {};
    for (const p of parts) map[p.type] = p.value;
    const dd = map.day || '00';
    const mm = map.month || '00';
    const yyyy = map.year || '0000';
    const hh = map.hour || '00';
    const mi = map.minute || '00';
    const abbr = getIndonesiaAbbrev(timeZone, d);
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}${abbr ? ' ' + abbr : ''}`;
  } catch (e) {
    // fallback to simple UTC components
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  }
}

export function toInputDatetime(dateLike) {
  if (dateLike == null) return '';
  const s = String(dateLike).trim();
  if (s === '') return '';
  // If naive SQL datetime (no timezone suffix), preserve components as-is for editing
  const naiveSqlRx = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;
  const m = naiveSqlRx.exec(s);
  if (m && !/[Zz]|[+-]\d{2}:?\d{2}$/.test(s)) {
    const yyyy = m[1];
    const mm = m[2];
    const dd = m[3];
    const hh = (m[4] || '00');
    const mi = (m[5] || '00');
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }

  // Otherwise render the value in the client's timezone (or caller-provided tz via Intl resolvedOptions)
  const d = parseToUtcDate(dateLike);
  if (!d) return '';
  let tz;
  try {
    const ro = Intl.DateTimeFormat().resolvedOptions();
    if (ro && ro.timeZone) tz = ro.timeZone;
  } catch (e) { tz = 'Asia/Jakarta'; }
  if (!tz) tz = 'Asia/Jakarta';
  try {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(d);
    const map = {};
    for (const p of parts) map[p.type] = p.value;
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = map.year || '';
    const mm = map.month || '01';
    const dd = map.day || '01';
    const hh = map.hour || '00';
    const mi = map.minute || '00';
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  } catch (e) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
