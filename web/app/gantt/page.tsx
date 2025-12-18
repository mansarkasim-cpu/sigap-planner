// app/gantt/page.tsx
import React from 'react';
import GanttChart from '../../components/GanttChart';

export default function Page() {
  return (
    <main style={{ padding: 20, background: '#f7fafc', minHeight: '100vh' }}>
      <GanttChart />
    </main>
  );
}
