import React from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    useTheme,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../store/ThemeContext';
import SpeechToggle from '../components/SpeechToggle';
import banner from '../assets/banner_kids.jpg';
import { useFontSettings } from '../store/FontContext';
import { fontFamilies } from '../styles/fonts';

const HomePage = () => {
    const { t, i18n } = useTranslation();
    const muiTheme = useTheme();
    const { mode } = useThemeMode();
    const { fontSize, fontFamily } = useFontSettings();

    const name = localStorage.getItem('name') || t('guest');

    const introText = {
        kz: `Сәлем, ${name}! Бұл бастауыш сынып оқушыларына арналған мультитілді, инклюзивті және интерактивті оқу платформасы. Мұнда оқу сауаттылығы, математика және жаратылыстану пәндері бойынша тапсырмалар бар.`,
        ru: `Привет, ${name}! Это мультиязычная, инклюзивная и интерактивная образовательная платформа для младших школьников. Здесь есть задания по грамотности, математике и естествознанию.`,
        en: `Hello, ${name}! This is a multilingual, inclusive, and interactive learning platform for primary school children. It includes tasks in literacy, math, and science.`
    }[i18n.language];

    return (
        <Container maxWidth="md" sx={{ mt: 6 }}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    backgroundColor: mode === 'dark' ? muiTheme.palette.grey[900] : '#f9f9f9',
                    color: muiTheme.palette.text.primary
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
                    <Box flex={1}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            gutterBottom
                            sx={{ fontSize, fontFamily: fontFamilies[fontFamily] }}
                        >
                            {t('welcome')}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ mb: 2, fontSize, fontFamily: fontFamilies[fontFamily] }}
                        >
                            {introText}
                        </Typography>
                        <SpeechToggle text={introText} />
                    </Box>
                    <Box component="img" src={banner} alt="Banner" sx={{ maxWidth: 300, borderRadius: 4 }} />
                </Box>

                <Box mt={4}>
                    <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ fontSize, fontFamily: fontFamilies[fontFamily] }}>{t('faq_title')}</Typography>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ fontSize, fontFamily: fontFamilies[fontFamily] }}>
                                {t('faq_q1')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography sx={{ fontSize, fontFamily: fontFamilies[fontFamily] }}>{t('faq_a1')}</Typography>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography sx={{ fontSize, fontFamily: fontFamilies[fontFamily] }}>{t('faq_q2')}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <Typography sx={{ fontSize, fontFamily: fontFamilies[fontFamily] }}>{t('faq_a2')}</Typography>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Paper>
        </Container>
    );
};

export default HomePage;
