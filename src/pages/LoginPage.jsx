import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api/api';
import SpeechToggle from '../components/SpeechToggle';

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    const res = await api.login({ email, password });

    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('name', res.user.name);
      localStorage.setItem('role', res.user.role);
      navigate('/');
    } else {
      setError(res.error || t('login_error'));
    }
  };

  const narrationText = {
    kz: 'Кіру беті. Email мен құпиясөзіңізді енгізіңіз.',
    ru: 'Страница входа. Введите email и пароль.',
    en: 'Login page. Enter your email and password.'
  }[i18n.language];

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h5" gutterBottom>{t('login')}</Typography>
        <SpeechToggle text={narrationText} />
      </Box>

      <TextField
        fullWidth label="Email" margin="normal"
        value={email} onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth label={t('password')} type="password" margin="normal"
        value={password} onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
        {t('login')}
      </Button>
    </Box>
  );
};

export default LoginPage;
