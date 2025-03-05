import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useSpring, animated } from '@react-spring/web';

const CustomAlert = ({ show, mode, msg1, msg2, onClose }) => {
  const [visible, setVisible] = useState(show);

  // Animations using react-spring
  const springProps = useSpring({
    opacity: visible ? 1 : 0,
    transform: visible ? `translateY(0%)` : `translateY(100%)`,
    config: { tension: 220, friction: 20 },
  });

  useEffect(() => {
    setVisible(show);

    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <animated.div
      style={{
        ...springProps,
        position: 'fixed',
        left: '50%',
        bottom: 20,
        transform: `translate(-50%, ${visible ? '0%' : '100%'})`,
        zIndex: 2000,
      }}
    >
      <Box display="flex" justifyContent="center" alignItems="center">
        <Paper
          sx={{
            maxWidth: 480,
            width: '100%',
            margin: 2,
            padding: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: mode === 'OK' ? '#D6F3E9' : '#f3d6d6',
            border: mode === 'OK' ? '1px solid rgba(0, 128, 0, 0.186)' : '1px solid rgba(128, 0, 0, 0.19)',
          }}
          elevation={3}
        >
          <IconButton edge="start" disabled>
            {mode === 'OK' ? <CheckCircleIcon sx={{ color: '#039855' }} /> : <ErrorIcon sx={{ color: '#BB251A' }} />}
          </IconButton>
          <Box flexGrow={1}>
            <Typography variant="h6">{msg1}</Typography>
            <Typography variant="body2">{msg2}</Typography>
          </Box>
        </Paper>
      </Box>
    </animated.div>
  );
};

export default CustomAlert;
