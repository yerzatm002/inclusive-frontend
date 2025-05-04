// src/pages/AdminUsersPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, Box
} from '@mui/material';
import { api } from '../api/api';
import { useTranslation } from 'react-i18next';
import { useFontSettings } from '../store/FontContext';
import { useThemeMode } from '../store/ThemeContext';
import { fontFamilies } from '../styles/fonts';

const AdminUsersPage = () => {
  const { t } = useTranslation();
  const { fontSize, fontFamily } = useFontSettings();
  const { mode } = useThemeMode();

  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.getAllUsers().then(setUsers).catch(console.error);
    api.getAllResults().then(setResults).catch(console.error);
  }, []);

  const getUserResults = (userId) => results.filter(r => r.userId === userId);

  const getAverageScore = (userId) => {
    const userResults = getUserResults(userId);
    if (!userResults.length) return '-';
    const avg = userResults.reduce((sum, r) => sum + r.score, 0) / userResults.length;
    return Math.round(avg);
  };

  const getLastDate = (userId) => {
    const userResults = getUserResults(userId);
    if (!userResults.length) return '-';
    const sorted = [...userResults].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return new Date(sorted[0].createdAt).toLocaleString();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: fontFamilies[fontFamily], fontSize }}>
        {t('admin_users')}
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('name')}</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>{t('role')}</TableCell>
              <TableCell>{t('tasks_done')}</TableCell>
              <TableCell>{t('average_score')}</TableCell>
              <TableCell>{t('last_activity')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{getUserResults(u.id).length}</TableCell>
                <TableCell>{getAverageScore(u.id)}</TableCell>
                <TableCell>{getLastDate(u.id)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default AdminUsersPage;
