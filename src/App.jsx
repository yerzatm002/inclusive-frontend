import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from './styles/themes';
import { useThemeMode } from './store/ThemeContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import LiteracyTasksPage from './pages/LiteracyTasksPage';
import MathTasksPage from './pages/MathTasksPage';
import ScienceTasksPage from './pages/ScienceTasksPage';
import TaskDetailPage from './pages/TaskDetailPage';
import ResultsPage from './pages/ResultsPage';
import AdminTasksPage from './pages/AdminTasksPage';
import AdminUsersPage from './pages/AdminUsersPage';


export default function App() {
  const { mode } = useThemeMode();
  const theme = mode === 'dark' ? darkTheme : lightTheme;
  const user = JSON.parse(localStorage.getItem('user'));
const role = user?.role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'GUEST';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
      <Navbar role={role} />
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/admin/tasks" element={<AdminTasksPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />

          <Route path="/subjects/science" element={<ScienceTasksPage />} />
          <Route path="/subjects/math" element={<MathTasksPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/subjects/literacy" element={<LiteracyTasksPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
