import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useTranslation } from 'react-i18next';

const SpeechToggle = ({ text }) => {
  const [speaking, setSpeaking] = useState(false);
  const { i18n } = useTranslation();

  const langMap = {
    kz: 'kk-KZ',
    ru: 'ru-RU',
    en: 'en-US'
  };

  const speak = () => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[i18n.language] || 'kk-KZ'; // fallback: казахша

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    speechSynthesis.cancel(); // clear queue
    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <Tooltip title={speaking ? 'Тоқтату' : 'Дауыспен оқу'}>
      <IconButton onClick={speaking ? stop : speak}>
        {speaking ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default SpeechToggle;
