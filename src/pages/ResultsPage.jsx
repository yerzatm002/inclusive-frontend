// src/pages/ResultsPage.jsx
import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Table, TableHead, TableRow, TableCell,
    TableBody, Paper, Box
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useThemeMode } from '../store/ThemeContext';
import { useFontSettings } from '../store/FontContext';
import { fontFamilies } from '../styles/fonts';

const ResultsPage = () => {
    const { t } = useTranslation();
    const { mode } = useThemeMode();
    const { fontSize, fontFamily } = useFontSettings();

    const [results, setResults] = useState([]);

    useEffect(() => {
        const local = JSON.parse(localStorage.getItem('results') || '[]');
        setResults(local);
    }, []);

    const correctCount = results.filter(r => r.correct).length;
    const incorrectCount = results.length - correctCount;

    const chartData = [
        { name: t('correct'), value: correctCount },
        { name: t('incorrect'), value: incorrectCount },
    ];

    const COLORS = ['#4caf50', '#f44336'];

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: fontFamilies[fontFamily], fontSize }}>
                {t('results')}
            </Typography>

            <Box mt={3}>
                <Paper sx={{ p: 2, overflow: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {['task_id', 'subject', 'score', 'correct', 'answered_at'].map((key) => (
                                    <TableCell key={key} sx={{ fontSize, fontFamily: fontFamilies[fontFamily] }}>
                                        {t(key)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((r, idx) => (
                                <TableRow key={idx}>
                                    <TableCell sx={{ fontSize, fontFamily: fontFamilies[fontFamily] }}>{r.taskId}</TableCell>
                                    <TableCell sx={{ fontSize, fontFamily: fontFamilies[fontFamily] }}>{t(r.subject)}</TableCell>
                                    <TableCell sx={{ fontSize, fontFamily: fontFamilies[fontFamily] }}>{r.score}</TableCell>
                                    <TableCell sx={{ fontSize, fontFamily: fontFamilies[fontFamily] }}>
                                        {r.correct ? t('yes') : t('no')}
                                    </TableCell>
                                    <TableCell sx={{ fontSize, fontFamily: fontFamilies[fontFamily] }}>
                                        {new Date(r.answeredAt).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>

            <Box mt={4} height={300}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        >
                            {chartData.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Box>
        </Container>
    );
};

export default ResultsPage;
