// src/pages/AdminTasksPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { api } from '../api/api';
import { useTranslation } from 'react-i18next';

const AdminTasksPage = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const [form, setForm] = useState({
    subject: '',
    text: '',
    level: '',
    language: '',
    image: '',
  });

  const loadTasks = () => {
    api.getTasks().then(setTasks).catch(console.error);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleOpen = (task = null) => {
    setEditTask(task);
    setForm(task || { subject: '', text: '', level: '', language: '', image: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTask(null);
  };

  const handleSave = () => {
    const action = editTask
      ? api.updateTask(editTask.id, form)
      : api.createTask(form);

    action.then(() => {
      loadTasks();
      handleClose();
    });
  };

  const handleDelete = (id) => {
    if (window.confirm(t('confirm_delete'))) {
      api.deleteTask(id).then(loadTasks);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('admin_tasks')}
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        {t('add_task')}
      </Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t('subject')}</TableCell>
              <TableCell>{t('text')}</TableCell>
              <TableCell>{t('level')}</TableCell>
              <TableCell>{t('language')}</TableCell>
              <TableCell>{t('image')}</TableCell>
              <TableCell align="right">{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.subject}</TableCell>
                <TableCell>{task.text}</TableCell>
                <TableCell>{task.level}</TableCell>
                <TableCell>{task.language}</TableCell>
                <TableCell>{task.image?.slice(0, 20)}...</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(task)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(task.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editTask ? t('edit_task') : t('add_task')}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField name="subject" label="Subject" value={form.subject} onChange={handleChange} fullWidth />
          <TextField name="text" label="Text" value={form.text} onChange={handleChange} fullWidth />
          <TextField name="level" label="Level" value={form.level} onChange={handleChange} fullWidth />
          <TextField name="language" label="Language" value={form.language} onChange={handleChange} fullWidth />
          <TextField name="image" label="Image URL" value={form.image} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('cancel')}</Button>
          <Button onClick={handleSave} variant="contained">{t('save')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminTasksPage;
