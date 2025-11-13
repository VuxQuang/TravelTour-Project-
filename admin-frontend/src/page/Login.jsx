import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';

export default function Login() {
  const { t, ready } = useTranslation();
  const navigate = useNavigate();
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [submitting,setSubmitting] = useState(false);
  const [error,setError] = useState('');

  // Wait for i18n to be ready
  if (!ready) {
    return <div>Loading...</div>;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/auth/login', { username, password });
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: '80px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>{t('login.title')}</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>{t('login.username')}</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>{t('login.password')}</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        {error && <div style={{ color:'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit" disabled={submitting} style={{ width:'100%', padding: 10 }}>
          {submitting ? t('login.submitting') : t('login.submit')}
        </button>
      </form>
    </div>
  );
}