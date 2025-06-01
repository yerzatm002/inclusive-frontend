// src/pages/AdminTasksPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton,
  MenuItem
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { api } from '../api/api';
import { useTranslation } from 'react-i18next';

const SUBJECTS = ['literacy', 'math', 'science'];
const LANGUAGES = ['kz', 'ru', 'en'];
const LEVELS = ['easy', 'medium', 'hard'];

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
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correct: 0,
      },
    ],
  });

  const loadTasks = () => {
    api.getTasks().then(setTasks).catch(console.error);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleOpen = (task = null) => {
    setEditTask(task);
    setForm(task || {
      subject: '',
      text: '',
      level: '',
      language: '',
      image: '',
      questions: [
        {
          question: '',
          options: ['', '', '', ''],
          correct: 0,
        },
      ],
    });
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

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correct: 0,
        },
      ],
    });
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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editTask ? t('edit_task') : t('add_task')}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            select
            name="subject"
            label="Subject"
            value={form.subject}
            onChange={handleChange}
            fullWidth
          >
            {SUBJECTS.map((s) => (
              <MenuItem key={s} value={s}>{t(s)}</MenuItem>
            ))}
          </TextField>

          <TextField name="text" label="Text" value={form.text} onChange={handleChange} fullWidth />

          <TextField
            select
            name="level"
            label="Level"
            value={form.level}
            onChange={handleChange}
            fullWidth
          >
            {LEVELS.map((l) => (
              <MenuItem key={l} value={l}>{t(l)}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            name="language"
            label="Language"
            value={form.language}
            onChange={handleChange}
            fullWidth
          >
            {LANGUAGES.map((l) => (
              <MenuItem key={l} value={l}>{l.toUpperCase()}</MenuItem>
            ))}
          </TextField>

          <TextField name="image" label="Image URL" value={form.image} onChange={handleChange} fullWidth />
          {form.image && (
            <Box mt={1}>
              <img src={form.image} alt="preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
            </Box>
          )}

          {form.questions.map((q, idx) => (
            <Box key={idx} mt={3}>
              <Typography variant="subtitle1">Question {idx + 1}</Typography>
              <TextField
                label="Question text"
                value={q.question}
                onChange={(e) => {
                  const updated = [...form.questions];
                  updated[idx].question = e.target.value;
                  setForm({ ...form, questions: updated });
                }}
                fullWidth
                sx={{ mb: 2 }}
              />
              {q.options.map((opt, i) => (
                <TextField
                  key={i}
                  label={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const updated = [...form.questions];
                    updated[idx].options[i] = e.target.value;
                    setForm({ ...form, questions: updated });
                  }}
                  fullWidth
                  sx={{ mb: 1 }}
                />
              ))}
              <TextField
                label="Correct Option Index (0-3)"
                type="number"
                inputProps={{ min: 0, max: 3 }}
                value={q.correct}
                onChange={(e) => {
                  const updated = [...form.questions];
                  updated[idx].correct = Number(e.target.value);
                  setForm({ ...form, questions: updated });
                }}
                fullWidth
              />
            </Box>
          ))}

          <Button onClick={addQuestion} sx={{ mt: 2 }}>{t('add_question')}</Button>
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
