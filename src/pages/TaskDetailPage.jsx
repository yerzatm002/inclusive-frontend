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
    const [selectedOptions, setSelectedOptions] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState({});

    useEffect(() => {
        api.getTaskById(id).then(setTask).catch(console.error);
    }, [id]);

    if (!task) return <Typography sx={{ mt: 4 }}>{t('loading')}...</Typography>;

    const handleSubmit = () => {
        const results = {};
        let correctCount = 0;
        task.questions.forEach((q, idx) => {
            const selected = selectedOptions[idx];
            const isCorrect = selected === String(q.correct);
            results[idx] = isCorrect;
            if (isCorrect) correctCount++;
        });

        setCorrectAnswers(results);
        setSubmitted(true);

        const resultData = {
            taskId: task.id,
            subject: task.subject,
            score: Math.round((correctCount / task.questions.length) * 100),
            correct: correctCount === task.questions.length,
            answeredAt: new Date().toISOString(),
        };

        try {
            const prev = JSON.parse(localStorage.getItem('results') || '[]');
            const updated = [...prev.filter(r => r.taskId !== task.id), resultData];
            localStorage.setItem('results', JSON.stringify(updated));
        } catch (e) {
            console.error('❌ Failed to save result in localStorage:', e);
        }

        api.createResult({ taskId: task.id, score: resultData.score });
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

            {task.questions.map((question, idx) => (
                <Paper key={idx} sx={{ mt: 4, p: 3, backgroundColor: mode === 'dark' ? '#2a2a2a' : '#fafafa' }}>
                    <Typography variant="h6" sx={{ fontFamily: fontFamilies[fontFamily], fontSize }}>
                        {question.question}
                    </Typography>
                    <SpeechToggle text={question.question} />

                    <RadioGroup
                        value={selectedOptions[idx] || ''}
                        onChange={(e) => setSelectedOptions({ ...selectedOptions, [idx]: e.target.value })}
                        sx={{ mt: 2 }}
                    >
                        {question.options.map((opt, i) => {
                            const isSelected = selectedOptions[idx] === String(i);
                            const isAnswer = submitted && i === question.correct;
                            const isWrongSelected = submitted && isSelected && i !== question.correct;

                            return (
                                <Box key={i} display="flex" alignItems="center" gap={1} my={0.5}>
                                    <FormControlLabel
                                        value={String(i)}
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

                    {submitted && (
                        <Typography
                            sx={{
                                mt: 2,
                                fontSize,
                                fontFamily: fontFamilies[fontFamily],
                                color: correctAnswers[idx] ? 'green' : 'red',
                            }}
                        >
                            {correctAnswers[idx] ? t('correct') : t('incorrect')}
                        </Typography>
                    )}
                </Paper>
            ))}

            {!submitted && (
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 4 }}
                    disabled={Object.keys(selectedOptions).length !== task.questions.length}
                >
                    {t('submit')}
                </Button>
            )}
        </Container>
    );
};

export default TaskDetailPage;
