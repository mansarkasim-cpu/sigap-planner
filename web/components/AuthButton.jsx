'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function AuthButton() {
  const [token, setToken] = useState(null);
  useEffect(() => {
    try {
      const t = localStorage.getItem('token');
      setToken(t);
    } catch (e) {
      setToken(null);
    }
  }, []);
  const menuRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [hovered, setHovered] = useState(null);

  function logout() {
    try { localStorage.removeItem('token'); } catch (e) {}
    try { localStorage.removeItem('sigap_user'); } catch (e) {}
    try { localStorage.removeItem('sigap_role'); } catch (e) {}
    try { document.cookie = 'token=; Path=/; Max-Age=0' } catch (e) {}
    try { document.cookie = 'sigap_user=; Path=/; Max-Age=0' } catch (e) {}
    try { document.cookie = 'sigap_role=; Path=/; Max-Age=0' } catch (e) {}
    // force reload so client components re-evaluate auth state
    if (typeof window !== 'undefined') window.location.reload();
  }

  if (token) {
    return (
      <div style={{ position: 'relative' }}>
        <button onClick={(e)=>{ setMenuVisible(v => !v); }} title="Account" aria-label="Account" className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap:6 }}>
          <AccountCircleIcon style={{ fontSize: 18 }} />
        </button>
        {menuVisible && (
          <div ref={menuRef} style={{ position: 'absolute', right: 0, marginTop: 6, background: '#fff', border: '1px solid #ddd', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 50 }}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 180 }}>
              <Link
                href="/account/change-password"
                className="nav-link"
                onClick={()=>{ setMenuVisible(false); }}
                onMouseEnter={()=>setHovered('changepw')}
                onMouseLeave={()=>setHovered(null)}
                style={{
                  padding: '8px 12px',
                  textDecoration: 'none',
                  color: hovered === 'changepw' ? '#111' : '#111',
                  background: hovered === 'changepw' ? '#f5f5f5' : '#fff',
                  display: 'block'
                }}
              >
                Change Password
              </Link>
              <button
                onClick={logout}
                onMouseEnter={()=>setHovered('logout')}
                onMouseLeave={()=>setHovered(null)}
                style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  background: hovered === 'logout' ? '#f5f5f5' : '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'block',
                  color: '#111'
                }}
                className="nav-link"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href="/login" className="nav-link">Login</Link>
  );
}
