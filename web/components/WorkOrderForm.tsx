'use client';
import { useState } from 'react';
import apiClient from '../lib/api-client';
import { TextField, Button, Stack, Paper, Alert, InputAdornment } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BoltIcon from '@mui/icons-material/Bolt';

type Props = { onCreated?: () => void };

export default function WorkOrderForm({ onCreated }: Props) {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!id.trim()) return setMessage('Masukkan id SIGAP');
    setLoading(true);
    try {
      const res = await apiClient('/work-orders/add', { method: 'POST', body: { id: id.trim() } } as any);
      setMessage('Work order tersimpan: ' + (res?.data?.doc_no || res?.data?.id || 'OK'));
      setId('');
      onCreated?.();
    } catch (err: any) {
      console.error('add error', err);
      setMessage('Error: ' + (err.body?.detail || err.body?.message || err.message || 'gagal'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <form onSubmit={handleSubmit}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            value={id}
            onChange={e => setId(e.target.value)}
            placeholder="Masukkan id SIGAP (contoh: 1656)"
            disabled={loading}
            size="small"
            variant="outlined"
            sx={{ minWidth: 320 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BoltIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={loading}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {loading ? 'Mengambil...' : 'Ambil & Simpan'}
          </Button>

          {message && (
            <Alert severity={message.startsWith('Error') ? 'error' : 'success'} sx={{ ml: 1 }}>
              {message}
            </Alert>
          )}
        </Stack>
      </form>
    </Paper>
  );
}
