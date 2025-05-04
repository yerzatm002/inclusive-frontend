import React, { useState, useEffect  } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Typography,
    useTheme
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useThemeMode } from '../store/ThemeContext';
import { useFontSettings } from '../store/FontContext';
import { useTranslation } from 'react-i18next';
import { fontFamilies } from '../styles/fonts';
import SpeechToggle from '../components/SpeechToggle';

const Navbar = () => {
    const [role, setRole] = useState('GUEST');

    useEffect(() => {
      const storedRole = localStorage.getItem('role');
      if (storedRole) setRole(storedRole);
    }, []);
    const { mode, toggleTheme } = useThemeMode();
    const { fontSize, fontFamily, changeFontSize, changeFontFamily } = useFontSettings();
    const { i18n, t } = useTranslation();
    const location = useLocation();
    const muiTheme = useTheme();
    const speechTexts = {
        kz: `Бұл бастауыш сынып оқушыларына арналған инклюзивті, мультитілді, білім беру платформасы. Мәзір: басты бет, оқу сауаттылығы, математика, жаратылыстану.`,
        ru: `Это инклюзивная, мультиязычная образовательная платформа для младших школьников. Меню: главная, грамотность, математика, естествознание.`,
        en: `This is an inclusive, multilingual educational platform for primary school children. Menu: home, literacy, math, science.`,
      };
      
      const narrationText = speechTexts[i18n.language] || speechTexts['kz'];

    const username = localStorage.getItem('name') || 'Guest';

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const isActive = (path) => location.pathname === path;

    const routes = {
        ADMIN: [
            { label: 'home', path: '/' },
            { label: 'tasks', path: '/admin/tasks' },
            { label: 'users', path: '/admin/users' }
        ],
        GUEST: [
            { label: 'home', path: '/' },
            { label: 'literacy', path: '/subjects/literacy' },
            { label: 'math', path: '/subjects/math' },
            { label: 'science', path: '/subjects/science' },
            { label: 'results', path: '/results' },
            { label: 'login', path: '/login' },
            { label: 'register', path: '/register' }
        ]
    };

    const langs = ['kz', 'ru', 'en'];

    return (
        <AppBar
            position="static"
            color="default"
            sx={{
                backgroundColor: muiTheme.palette.background.default,
                color: muiTheme.palette.text.primary,
                fontFamily: fontFamilies[fontFamily]
            }}
        >
            <Toolbar sx={{ gap: 2, fontSize: `${fontSize}px` }}>
                <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                    {(routes[role] || []).map(({ label, path }) => (
                        <Button
                            key={label}
                            component={Link}
                            to={path}
                            sx={{ fontSize: `${fontSize}px`, textTransform: 'none' }}
                            variant={isActive(path) ? 'contained' : 'text'}
                        >
                            {t(label)}
                        </Button>
                    ))}
                </Box>

                {/* Language */}
                <Box>
                    {langs.map((lng) => (
                        <Button
                            key={lng}
                            size="small"
                            variant={i18n.language === lng ? 'contained' : 'outlined'}
                            onClick={() => {
                                i18n.changeLanguage(lng);
                                localStorage.setItem('lang', lng);
                            }}
                            sx={{ minWidth: 36 }}
                        >
                            {lng.toUpperCase()}
                        </Button>
                    ))}
                </Box>

                {/* Font size */}
                <Box>
                    <Button onClick={() => changeFontSize(fontSize + 2)}>A+</Button>
                    <Button onClick={() => changeFontSize(fontSize - 2)}>A-</Button>
                </Box>

                {/* Theme toggle */}
                <IconButton onClick={toggleTheme} color="inherit">
                    {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
                {/* Speech toggle — всегда доступен */}
                <SpeechToggle text={narrationText} />

                {/* Avatar + Logout — только если пользователь авторизован */}
                {localStorage.getItem('token') && (
                    <Box>
                        <IconButton onClick={handleMenuOpen}>
                            <Avatar>{username.charAt(0)}</Avatar>
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                            <MenuItem disabled>
                                <Typography variant="subtitle2">{username}</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
