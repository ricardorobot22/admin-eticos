
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {  Chip, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import React, { useCallback ,useEffect} from "react";
import { useDropzone } from "react-dropzone";
import Grid from "@mui/material/Grid2";



const Popup = ({ formData,uploadImage,renderDropzone,image3,setImage3,state,dispatch,handleOpenAlert,setSelectedBanner}) => {

    const MAX_FILE_SIZE = 1024; // Tamaño máximo en KB (1 MB)
    const MAX_WIDTH = 465; // Ancho máximo en píxeles
    const MAX_HEIGHT = 656; // Alto máximo en píxeles
  
    const validateImage = (file, setImage, imageKey) => {
      const fileSize = file.size / 1024; // Tamaño en KB
  
      // Verificar el tamaño
      if (fileSize === MAX_FILE_SIZE) {
        handleOpenAlert("error",`El archivo supera el tamaño máximo de ${MAX_FILE_SIZE} KB.`);
        return false;
      }
  
      // Verificar las dimensiones
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width !== MAX_WIDTH && img.height !== MAX_HEIGHT) {
          handleOpenAlert("error",`Las dimensiones de la imagen deben ser como máximo ${MAX_WIDTH}x${MAX_HEIGHT} píxeles.`);
          return false;
        }
  
        // Si pasa ambas validaciones, carga la imagen
        uploadImage(file, imageKey, setImage);
      };
    };


    const onDrop = useCallback((oldImage, setImage, imageKey) => (acceptedFiles) => {
        if (oldImage) {
          URL.revokeObjectURL(oldImage.preview);
        }
        const file = acceptedFiles[0];
        if (file) {
          validateImage(file, setImage, imageKey);
        }
      }, []);

      const { getRootProps: getRootProps3, getInputProps: getInputProps3 } = useDropzone({
        onDrop: onDrop(image3,setImage3,'imagen3'),
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png'],
           },
        multiple: false
      });


    return (
        <>

            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 2, borderColor: 'divider', m: "16px 0px" }}>
                </Box>
            </Box>

            <Typography

                fontSize="14px"
                fontWeight="500"
                lineHeight="20px"

            >
                Pop-up
            </Typography>

            <Typography
                color="#667085"
                variant="subtitle1"
                fontSize="12px"
                lineHeight="16px"
                sx={{ mb: "8px" }}>Selecciona la posición donde se verá la imagen</Typography>

            <Stack direction="row" spacing={1}   sx={{mb:"16px"}}>



                {['Home', 'Categorías','Subcategorías','Búsqueda'].map((text, index) => (
                    <Chip
                        key={index}
                        label={text}
                        variant="filled"
                        onClick={() =>{
                          dispatch({ type: 'SELECT_POP', index });
                          const isSelected = state.selectedPopIndex.includes(index);
                          if (!isSelected) {
                        
                          setSelectedBanner("popup");
                          }
                      }}
                        deleteicon={state.selectedPopIndex.includes(index) ? <DoneIcon /> : null}
                  
                        sx={{
                            backgroundColor: state.selectedPopIndex.includes(index) ? '#1C58B7' : '#ECF4FC',
                            color: state.selectedPopIndex.includes(index) ? '#FCFCFD' : '#1C58B7',
                            '&:hover': {
                                backgroundColor: state.selectedPopIndex.includes(index) ? '#1C58B7' : '#ECF4FC',
                                color: state.selectedPopIndex.includes(index) ? '#101828' : '#101828',
                            },
                        }}
                    />
                ))}
            </Stack>

            <Grid container spacing={2} sx={{justifyContent:"center"}}>
  <Grid  xs={12} sm={6}>

    {renderDropzone(image3, getRootProps3, getInputProps3, setImage3,'imagen3')}
  </Grid>
  </Grid>
        </>
    );
};

export {Popup} ;