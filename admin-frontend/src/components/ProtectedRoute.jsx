import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        const roles = res.data?.roles || [];
        const hasAdmin = roles.includes('ROLE_ADMIN') || roles.includes('ROLE_STAFF');
        setStatus(hasAdmin ? 'ok' : 'deny');
      })
      .catch(() => setStatus('deny'));
  }, []);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'deny') return <Navigate to="/admin/login" replace />;
  return children;
}