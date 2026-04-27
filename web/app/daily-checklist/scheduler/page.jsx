"use client";
import React from 'react';
import MonthlyChecklistScheduler from '../../../components/MonthlyChecklistScheduler';

export default function Page(){
  return (
    <div style={{ padding: 20, fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial' }}>
      <h1 style={{ marginTop: 0 }}>Daily Checklist Scheduler</h1>
      <p style={{ color: '#555' }}>Buat jadwal daily checklist per alat selama sebulan berdasarkan jadwal shift teknisi.</p>
      <MonthlyChecklistScheduler />
    </div>
  );
}
