'use client';

import WorkOrderForm from '../../components/WorkOrderForm';
import WorkOrderList from '../../components/WorkOrderList';
import { useRef } from 'react';

export default function Page() {
  // expose refresh function from list via ref
  const refreshRef = useRef<(() => Promise<void>) | null>(null);
  const WorkOrderListAny = WorkOrderList as any;

  return (
    <main style={{ padding: 24, fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial' }}>
      <h1 style={{ marginBottom: 12 }}>Work Orders</h1>

      <section style={{ marginBottom: 20 }}>
        <WorkOrderForm onCreated={() => refreshRef.current?.()} />
      </section>

      <section>
        <WorkOrderListAny onRefreshRequested={(fn: any) => { return refreshRef.current = fn; }} />
      </section>
    </main>
  );
}
