
import Stack from "@mui/material/Stack";
import DoneIcon from "@mui/icons-material/Done";
import { useDropzone } from "react-dropzone";
import React, { useCallback ,useEffect} from "react";
import { Box, Typography ,Chip} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Mobile from "../assets/Icon-DeviceMobile.svg";
import Laptop from "../assets/Icon-Laptop.svg";


const Bannerprincipal = ({ formData,uploadImage,renderDropzone,image1,setImage1,image2,setImage2,state,dispatch,handleOpenAlert,setSelectedBanner }) => {
  
  const validateImage = (file, setImage, imageKey,MAX_FILE_SIZE,MAX_WIDTH,MAX_HEIGHT) => {
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

  const onDrop = useCallback((oldImage, setImage, imageKey,MAX_FILE_SIZE,MAX_WIDTH,MAX_HEIGHT) => (acceptedFiles) => {
    if (oldImage) {
      URL.revokeObjectURL(oldImage.preview);
    }
    const file = acceptedFiles[0];
    if (file) {
      validateImage(file, setImage, imageKey,MAX_FILE_SIZE,MAX_WIDTH,MAX_HEIGHT);
    }
  }, []);

  const { getRootProps: getRootProps1, getInputProps: getInputProps1 } = useDropzone({
    onDrop: onDrop(image1, setImage1, 'imagen',1024,1440,380),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    multiple: false
  });

  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({
    onDrop: onDrop(image2, setImage2, 'imagen2',1024,1024,512),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    multiple: false
  });

 

    

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{ borderBottom: 2, borderColor: "divider", m: "16px 0px" }}
        ></Box>
      </Box>

      <Typography fontSize="14px" fontWeight="500" lineHeight="20px">
        Banner principal
      </Typography>

      <Typography
        color="#667085"
        variant="subtitle1"
        fontSize="12px"
        lineHeight="16px"
        sx={{ mb: "8px" }}
      >
        Selecciona la posición donde se verá la imagen
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: "16px" }}>
  {["Superior", "Inferior"].map((text, index) => (
    <Chip
      key={index}
      label={text}
      variant="filled"
      onClick={() => {
        const isSelected = state.selectedBPIndex.includes(index);

        // Dispatch para seleccionar/deseleccionar
        dispatch({ type: "SELECT_BP", index });

        // Si no estaba seleccionado, actualizamos `selectedBanner`
        if (!isSelected) {
          setSelectedBanner(index === 0 ? "superior" : "inferior");
        }
      }}
      deleteicon={state.selectedBPIndex.includes(index) ? <DoneIcon /> : null}
      sx={{
        backgroundColor: state.selectedBPIndex.includes(index)
          ? "#1C58B7"
          : "#ECF4FC",
        color: state.selectedBPIndex.includes(index) ? "#FCFCFD" : "#1C58B7",
        "&:hover": {
          backgroundColor: state.selectedBPIndex.includes(index)
            ? "#1C58B7"
            : "#ECF4FC",
          color: state.selectedBPIndex.includes(index) ? "#101828" : "#101828",
        },
      }}
    />
  ))}
</Stack>

      <Grid container spacing={2}  sx={{ display: 'flex', flexWrap: 'nowrap' , justifyContent:"flex-start" , width:"100%"}}>
  <Grid  xs={6}>
    <Box 
     display= 'flex' 
     alignItems= 'center' 
      sx={{ 
  
        mb: '6px' 
      }}
    >
      <Box component="img" src={Laptop} alt="Laptop" sx={{ marginRight: '6px' }} />
      <Typography fontSize="12px" fontWeight="400" lineHeight="16px">
        Versión escritorio
      </Typography>
    </Box>
    {renderDropzone(image1, getRootProps1, getInputProps1, setImage1,'imagen',"Versión escritorio", "Tamaño: 1440 x 380px. Soporta PNG y JPG con peso máximo de 1MB")}
  </Grid>
  
  <Grid  xs={6} >
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: '6px' 
      }}
    >
          <Box component="img" src={Mobile} alt="Laptop" sx={{ marginRight: '6px' }} />
      <Typography fontSize="12px" fontWeight="400" lineHeight="16px" sx={{ marginRight: '8px' }}>
        Versión mobile
      </Typography>
    </Box>
    {renderDropzone(image2, getRootProps2, getInputProps2, setImage2,'imagen2',"Versión Mobile", "Tamaño: 1024 x 512px. Soporta PNG y JPG con peso máximo de 1MB")}
  </Grid>
</Grid>
    </>
  );
};

export { Bannerprincipal };
