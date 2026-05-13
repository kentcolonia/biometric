'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { removeToken, getUsername } from '@/lib/auth';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/devices',   label: 'Devices'   },
  { href: '/users',     label: 'Users'     },
  { href: '/logs',      label: 'Logs'      },
];

const hrItems = [
  { href: '/employees', label: 'Employees' },
  { href: '/reports',   label: 'Reports'   },
  { href: '/settings',  label: 'Settings'  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const username = getUsername();

  function handleLogout() {
    removeToken();
    router.push('/login');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-glow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
            <path d="M12 10c-4 0-7 2-7 4.5V16h14v-1.5c0-2.5-3-4.5-7-4.5z"/>
            <path d="M17.5 6.5C18.4 7.6 19 9 19 10.5"/>
            <path d="M6.5 6.5C5.6 7.6 5 9 5 10.5"/>
          </svg>
        </div>
        <div>
          <div className="brand-name">BioTrack</div>
          <div className="brand-sub">Attendance System</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Biometrics</div>
        {navItems.map(item => (
          <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? 'active' : ''}`}>
            {item.label}
            {pathname === item.href && <span className="active-pip" />}
          </Link>
        ))}

        <div className="nav-section-label" style={{ marginTop: 20 }}>HR Management</div>
        {hrItems.map(item => (
          <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? 'active' : ''}`}>
            {item.label}
            {pathname === item.href && <span className="active-pip" />}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{username?.charAt(0).toUpperCase() || 'A'}</div>
          <div>
            <div className="user-name">{username || 'Admin'}</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Sign out
        </button>
      </div>

      <style>{`
        .sidebar {
          width: 228px; height: 100vh;
          background: #18181b;
          border-right: 1px solid #27272a;
          display: flex; flex-direction: column; flex-shrink: 0;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .sidebar-brand {
          display: flex; align-items: center; gap: 12px;
          padding: 22px 18px 18px;
          border-bottom: 1px solid #27272a;
        }
        .brand-glow {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.25);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 12px rgba(16,185,129,0.15);
        }
        .brand-name { font-size: 14px; font-weight: 600; color: #f4f4f5; letter-spacing: -0.3px; }
        .brand-sub { font-size: 10px; color: #52525b; margin-top: 1px; }
        .sidebar-nav {
          flex: 1; padding: 16px 10px;
          display: flex; flex-direction: column; gap: 2px;
          overflow-y: auto;
        }
        .nav-section-label {
          font-size: 10px; font-weight: 500; color: #3f3f46;
          text-transform: uppercase; letter-spacing: 0.8px;
          padding: 4px 10px; margin-bottom: 4px;
        }
        .nav-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 9px 12px; border-radius: 8px;
          color: #71717a; text-decoration: none; font-size: 13px;
          transition: all 0.15s; position: relative;
          border: 1px solid transparent;
        }
        .nav-link:hover { background: #27272a; color: #a1a1aa; }
        .nav-link.active {
          background: rgba(16,185,129,0.1);
          color: #10b981;
          border-color: rgba(16,185,129,0.2);
        }
        .active-pip {
          width: 5px; height: 5px; border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
          flex-shrink: 0;
        }
        .sidebar-footer {
          padding: 14px 10px; border-top: 1px solid #27272a;
          display: flex; flex-direction: column; gap: 6px;
        }
        .user-info { display: flex; align-items: center; gap: 10px; padding: 6px 10px; }
        .user-avatar {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(16,185,129,0.15);
          border: 1px solid rgba(16,185,129,0.3);
          color: #10b981;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 600;
        }
        .user-name { font-size: 13px; color: #d4d4d8; font-weight: 500; }
        .user-role { font-size: 10px; color: #52525b; margin-top: 1px; }
        .logout-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; border-radius: 8px; border: none;
          background: none; color: #52525b; font-size: 13px;
          cursor: pointer; width: 100%;
          transition: all 0.15s; font-family: inherit;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.1); color: #f87171; }
      `}</style>
    </aside>
  );
}
