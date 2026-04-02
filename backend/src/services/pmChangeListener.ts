import { Client } from 'pg';
import dotenv from 'dotenv';
import pmService from './pmService';

dotenv.config();

let client: Client | null = null;
let debounceTimer: NodeJS.Timeout | null = null;
let running = false;

export async function startPmChangeListener() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.warn('[pmChangeListener] DATABASE_URL not set, skipping listener');
    return;
  }

  client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    await client.query('LISTEN pm_changes');
    console.log('[pmChangeListener] Listening to pm_changes notifications');

    client.on('notification', async (msg) => {
      try {
        // simple debounce to coalesce rapid notifications
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          if (running) return;
          running = true;
          try {
            console.debug('[pmChangeListener] change detected, running updateEquipmentStatusAll');
            await pmService.updateEquipmentStatusAll();
          } catch (err) {
            console.error('[pmChangeListener] error running PM update', err);
          } finally {
            running = false;
          }
        }, 1000);
      } catch (err) {
        console.error('[pmChangeListener] notification handler error', err);
      }
    });
  } catch (err) {
    console.error('[pmChangeListener] failed to start listener', err);
    if (client) {
      try { await client.end(); } catch(e){}
      client = null;
    }
  }
}

export async function stopPmChangeListener() {
  if (client) {
    try { await client.end(); } catch (e) {}
    client = null;
  }
  if (debounceTimer) clearTimeout(debounceTimer);
}

export default { startPmChangeListener, stopPmChangeListener };
