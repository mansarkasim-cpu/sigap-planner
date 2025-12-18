"use client";
import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

export default function LoadingOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handle(e) {
      let count = 0;
      if (e && e.detail && typeof e.detail.count === 'number') count = e.detail.count;
      else {
        try {
          if (typeof window !== 'undefined') count = Number(window.__apiLoadingCounter || 0);
        } catch (_) { count = 0; }
      }
      setOpen(Boolean(count && count > 0));
    }
    // initialize
    try {
      const init = (typeof window !== 'undefined') ? Number(window.__apiLoadingCounter || 0) : 0;
      setOpen(init > 0);
    } catch (_) {}
    window.addEventListener('api-loading', handle);
    return () => window.removeEventListener('api-loading', handle);
  }, []);

  return (
    <Backdrop open={open} sx={{ zIndex: 1400, color: '#fff' }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
