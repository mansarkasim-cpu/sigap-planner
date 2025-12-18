'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LogoutIcon from '@mui/icons-material/Logout';

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
      <button onClick={logout} title="Logout" aria-label="Logout" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }} className="nav-link">
        <LogoutIcon style={{ fontSize: 18 }} />
      </button>
    );
  }

  return (
    <Link href="/login" className="nav-link">Login</Link>
  );
}
