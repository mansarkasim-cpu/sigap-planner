#!/usr/bin/env node
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function loadServiceAccount() {
  const envVal = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  let raw;
  if (envVal && envVal.trim()) {
    try {
      // try parse as JSON
      return JSON.parse(envVal);
    } catch (e) {
      // treat as file path
      const p = path.isAbsolute(envVal) ? envVal : path.join(process.cwd(), envVal);
      if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON set but not a valid JSON nor path: ' + envVal);
    }
  }
  // default path relative to repo
  const def = path.join(__dirname, '..', 'secrets', 'firebase-sa.json');
  if (!fs.existsSync(def)) throw new Error('Service account file not found at ' + def);
  return JSON.parse(fs.readFileSync(def, 'utf8'));
}

async function main() {
  try {
    const cred = loadServiceAccount();
    console.log('Using service account project_id=', cred.project_id);
    admin.initializeApp({ credential: admin.credential.cert(cred) });
    console.log('Firebase admin initialized');

    const token = process.argv[2];
    if (!token) {
      console.error('Usage: node backend/tools/test-fcm.js <fcm-token>');
      process.exit(2);
    }

    const message = {
      token,
      notification: { title: 'SIGAP Test', body: 'Test push from backend/tools/test-fcm.js' },
      data: { source: 'sigap-test' },
    };

    console.log('Sending test message to token (first 20 chars):', token.slice(0, 20));
    const resp = await admin.messaging().send(message);
    console.log('send() success:', resp);
  } catch (err) {
    console.error('test-fcm error:', err);
    if (err && err.errorInfo) console.error('errorInfo:', err.errorInfo);
    process.exitCode = 1;
  }
}

main();
