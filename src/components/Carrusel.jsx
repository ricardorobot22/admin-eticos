import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ClearIcon from "@mui/icons-material/Clear";

const ImageCarouselDialog = ({ images, triggerImage, imageTexts, sx }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <>
      <Box
        component="img"
        src={triggerImage}
        alt="Open carousel"
        sx={{ ...sx }}
      
        onClick={(event) => {handleOpen(); event.stopPropagation();}}
      />
      <Dialog
        open={open}
        onClose={handleClose} // Cierra el diálogo al hacer clic fuera
        maxWidth="lg"
        fullWidth // Hace que el diálogo ocupe gran parte de la pantalla
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            maxHeight: '90vh', // Limita la altura máxima del diálogo
            maxWidth: '90vw', // Limita el ancho máximo del diálogo
            borderRadius: '10px', // Añade un borde redondeado
          },
        }}

      >
        <DialogContent
          sx={{
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()} // Evita cerrar al hacer clic dentro del diálogo
        >
          {/* Botón de cierre en la parte superior central */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              color: 'white',
            }}
          >
            <ClearIcon fontSize="large" />
          </IconButton>

          {/* Botones de navegación */}
          <IconButton onClick={handlePrev} sx={{ position: 'absolute', left: 20, color: 'white' }}>
            <ArrowBackIosIcon fontSize="large" />
          </IconButton>

          <Box
            component="img"
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            sx={{ maxHeight: '80vh', maxWidth: '80vw' }}
          />

          <Typography
            variant="h6"
            color="white"
            sx={{ mt: 2, textAlign: 'center' }}
          >
            {imageTexts[currentIndex]}
          </Typography>

          <IconButton onClick={handleNext} sx={{ position: 'absolute', right: 20, color: 'white' }}>
            <ArrowForwardIosIcon fontSize="large" />
          </IconButton>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageCarouselDialog;
