'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', height: '100vh', background: '#09090b', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: 'auto', background: '#09090b' }}>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
