/**
 * PM Configuration
 * Configurable via environment variables.
 */

/**
 * Tolerance in engine hours before a PM is considered "late".
 * If the actual engine hour when PM was performed exceeds the scheduled engine hour
 * by no more than this value, the PM is still classified as "tepat_waktu" (on time).
 *
 * Default: 50 hours
 * Override via env: PM_LATE_TOLERANCE_HOURS=<number>
 */
export const PM_LATE_TOLERANCE_HOURS: number = (() => {
  const raw = process.env.PM_LATE_TOLERANCE_HOURS;
  if (raw !== undefined && raw !== '') {
    const parsed = Number(raw);
    if (!isNaN(parsed) && parsed >= 0) return parsed;
  }
  return 50;
})();
