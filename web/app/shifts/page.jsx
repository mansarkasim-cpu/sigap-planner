'use client';
import React from 'react';
import ShiftManager from '../../components/ShiftManager';

export default function Page() {
  return (
    <div style={{ padding: 20, fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial' }}>
      <h1 style={{ marginTop: 0 }}>Shift Management</h1>
      <p style={{ color: '#555' }}>Create technician groups and assign them to daily shifts per site.</p>
      <ShiftManager />
    </div>
  );
}
