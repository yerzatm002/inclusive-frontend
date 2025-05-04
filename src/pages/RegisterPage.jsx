import React, { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api/api';
import SpeechToggle from '../components/SpeechToggle';

const RegisterPage = () => {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CHILD' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async () => {
    setError('');
    const res = await api.register(form);

    if (res.user) {
      navigate('/login');
    } else {
      setError(res.error || t('register_error'));
    }
  };

  const narrationText = {
    kz: 'Тіркелу беті. Атыңызды, email мен құпиясөзді енгізіңіз.',
    ru: 'Страница регистрации. Введите имя, email и пароль.',
    en: 'Registration page. Enter your name, email and password.'
  }[i18n.language];

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h5" gutterBottom>{t('register')}</Typography>
        <SpeechToggle text={narrationText} />
      </Box>

      <TextField name="name" label={t('name')} fullWidth margin="normal" value={form.name} onChange={handleChange} />
      <TextField name="email" label="Email" fullWidth margin="normal" value={form.email} onChange={handleChange} />
      <TextField name="password" label={t('password')} type="password" fullWidth margin="normal" value={form.password} onChange={handleChange} />
      <TextField name="role" label={t('role')} select fullWidth margin="normal" value={form.role} onChange={handleChange}>
        <MenuItem value="CHILD">{t('child')}</MenuItem>
        <MenuItem value="PARENT">{t('parent')}</MenuItem>
      </TextField>
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleRegister}>
        {t('register')}
      </Button>
    </Box>
  );
};

export default RegisterPage;
