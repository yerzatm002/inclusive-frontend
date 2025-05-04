// src/pages/TaskDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/api';
import { useTranslation } from 'react-i18next';
import {
    Container, Typography, Card, CardContent, CardMedia,
    Chip, Box, Button, RadioGroup, Radio, FormControlLabel, Paper
} from '@mui/material';
import { useThemeMode } from '../store/ThemeContext';
import { useFontSettings } from '../store/FontContext';
import SpeechToggle from '../components/SpeechToggle';
import { fontFamilies } from '../styles/fonts';

const TaskDetailPage = () => {
    const { id } = useParams();
    const { t } = useTranslation();
    const { mode } = useThemeMode();
    const { fontSize, fontFamily } = useFontSettings();

    const [task, setTask] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

    useEffect(() => {
        api.getTaskById(id).then(setTask).catch(console.error);
    }, [id]);

    if (!task) return <Typography sx={{ mt: 4 }}>{t('loading')}...</Typography>;

    const question = task.questions?.[0];

    const handleSubmit = () => {
        if (selectedOption === null) return;
        const correctIndex = question.correct;
        const success = selectedOption === String(correctIndex);
        setIsCorrect(success);
        setSubmitted(true);
        const resultData = {
            taskId: task.id,
            subject: task.subject,
            score: success ? 100 : 0,
            correct: success,
            answeredAt: new Date().toISOString(),
          };
          
          try {
            const prev = JSON.parse(localStorage.getItem('results') || '[]');
            const updated = [...prev.filter(r => r.taskId !== task.id), resultData];
            localStorage.setItem('results', JSON.stringify(updated));
          } catch (e) {
            console.error('❌ Failed to save result in localStorage:', e);
          }
        api.createResult({ taskId: task.id, score: success ? 100 : 0 });
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Card
                sx={{
                    backgroundColor: mode === 'dark' ? '#1e1e1e' : '#fff',
                    boxShadow: 3,
                    borderRadius: 2,
                }}
            >
                {task.image && (
                    <CardMedia
                        component="img"
                        height="200"
                        image={task.image}
                        alt="task"
                        sx={{ objectFit: 'cover' }}
                    />
                )}
                <CardContent>
                    <Typography
                        variant="h5"
                        sx={{ fontFamily: fontFamilies[fontFamily], fontSize, mb: 2 }}
                    >
                        {task.text}
                    </Typography>

                    <SpeechToggle text={task.text} />
                    <Box mt={2}>
                        <Chip label={t(task.level)} color="primary" />
                    </Box>
                </CardContent>
            </Card>

            {question && (
                <Paper sx={{ mt: 4, p: 3, backgroundColor: mode === 'dark' ? '#2a2a2a' : '#fafafa' }}>
                    <Typography variant="h6" sx={{ fontFamily: fontFamilies[fontFamily], fontSize }}>
                        {question.question}
                    </Typography>
                    <SpeechToggle text={question.question} />

                    <RadioGroup
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        {question.options.map((opt, idx) => {
                            const isSelected = selectedOption === String(idx);
                            const isAnswer = submitted && idx === question.correct;
                            const isWrongSelected = submitted && isSelected && idx !== question.correct;

                            return (
                                <Box key={idx} display="flex" alignItems="center" gap={1} my={0.5}>
                                    <FormControlLabel
                                        value={String(idx)}
                                        control={<Radio disabled={submitted} />}
                                        label={
                                            <Typography
                                                sx={{
                                                    fontFamily: fontFamilies[fontFamily],
                                                    fontSize,
                                                    color: isAnswer ? 'green' : isWrongSelected ? 'red' : undefined,
                                                    fontWeight: isAnswer ? 'bold' : undefined,
                                                }}
                                            >
                                                {opt}
                                            </Typography>
                                        }
                                    />
                                    <SpeechToggle text={opt} />
                                </Box>
                            );
                        })}
                    </RadioGroup>

                    {!submitted ? (
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3 }}
                            disabled={selectedOption === null}
                        >
                            {t('submit')}
                        </Button>
                    ) : (
                        <Typography
                            sx={{
                                mt: 3,
                                fontSize,
                                fontFamily: fontFamilies[fontFamily],
                                color: isCorrect ? 'green' : 'red',
                            }}
                        >
                            {isCorrect ? t('correct') : t('incorrect')}
                        </Typography>
                    )}
                </Paper>
            )}
        </Container>
    );
};

export default TaskDetailPage;
