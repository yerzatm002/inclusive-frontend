// src/pages/MathTasksPage.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../api/api';
import { useTranslation } from 'react-i18next';
import {
    Container, Typography, Select, MenuItem, Card, CardContent,
    CardMedia, Grid, Chip, Box
} from '@mui/material';
import { useThemeMode } from '../store/ThemeContext';
import { useFontSettings } from '../store/FontContext';
import SpeechToggle from '../components/SpeechToggle';
import { fontFamilies } from '../styles/fonts';
import { Link } from 'react-router-dom';

const MathTasksPage = () => {
    const { t, i18n } = useTranslation();
    const { mode } = useThemeMode();
    const { fontSize, fontFamily } = useFontSettings();

    const [tasks, setTasks] = useState([]);
    const [level, setLevel] = useState('');

    useEffect(() => {
        api.getTasks({ subject: 'math', language: i18n.language, level })
            .then(data => {
                console.log('Fetched math tasks:', data);
                setTasks(data);
            })
            .catch(console.error);
    }, [i18n.language, level]);

    const getLevelColor = (level) => {
        switch (level) {
            case 'easy': return 'success';
            case 'medium': return 'warning';
            case 'hard': return 'error';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: fontFamilies[fontFamily], fontSize }}>
                {t('math')} — {t('tasks')}
            </Typography>

            <SpeechToggle text={t('math')} />

            <Select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                displayEmpty
                sx={{ my: 2 }}
            >
                <MenuItem value="">{t('all_levels')}</MenuItem>
                <MenuItem value="easy">{t('easy')}</MenuItem>
                <MenuItem value="medium">{t('medium')}</MenuItem>
                <MenuItem value="hard">{t('hard')}</MenuItem>
            </Select>

            <Grid container spacing={3}>
                {Array.isArray(tasks) && tasks.length > 0 ? (
                    tasks.map((task) => (
                        <Grid item xs={12} sm={6} key={task.id}>
                            <Link to={`/tasks/${task.id}`} style={{ textDecoration: 'none' }}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        backgroundColor: mode === 'dark' ? '#1e1e1e' : '#fff',
                                        boxShadow: 3,
                                        borderRadius: 2,
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            transition: '0.2s',
                                        },
                                    }}
                                >
                                    {task.image && (
                                        <CardMedia
                                            component="img"
                                            height="160"
                                            image={task.image}
                                            alt="task"
                                            sx={{ objectFit: 'cover' }}
                                        />
                                    )}
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography sx={{ fontFamily: fontFamilies[fontFamily], fontSize, mb: 1 }}>
                                            {task.text}
                                        </Typography>
                                        <SpeechToggle text={task.text} />
                                        <Box mt={2}>
                                            <Chip
                                                label={t(task.level)}
                                                color={getLevelColor(task.level)}
                                                variant="outlined"
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {t('no_tasks_found')}
                    </Typography>
                )}
            </Grid>
        </Container>
    );
};

export default MathTasksPage;
