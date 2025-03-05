import {React,useState} from 'react'
import Box from '@mui/material/Box';

import {   Typography ,Paper,InputBase,Switch} from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {IOSSwitch} from "../styles/styles"




const Llevarlink = ({handleInputChange,formData,openInNewWindow,setOpenInNewWindow}) => {
  

  const handleSwitchChange = (e) => {
    setOpenInNewWindow(e.target.checked);
  };

    return (
      <>
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{ borderBottom: 2, borderColor: "divider", m: "16px 0px" }}
          ></Box>
        </Box>

        <Typography
          fontSize="16px"
          fontWeight="500"
          lineHeight="24px"
          sx={{ mb: "8px" }}
        >
          Link
        </Typography>

        <Paper
          variant="outlined"
          // component="form"
          sx={{
            bgcolor: "#FFFFFF",
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            height: "40px",
            alignSelf: "stretch",
            border: "1px solid var(--gray-40098-a-2-b-3, #98A2B3)",
            flexWrap: "wrap",
            mb: "16px",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            name={openInNewWindow ? "link" : "link_self"} // Cambiar dinámicamente el nombre
            value={openInNewWindow ? formData.link : formData.link_self } // Cambiar dinámicamente el valor
            placeholder={
              openInNewWindow
                ? "Ingresa el link (nueva ventana)"
                : "Ingresa el link (misma página)"
            } // Cambiar el placeholder
            onChange={handleInputChange}
          />
        </Paper>

        <FormControlLabel
          control={
            <IOSSwitch
              sx={{ m: 1 }}
              checked={openInNewWindow}
              onChange={handleSwitchChange}
            />
          }
          label="Abrir en una nueva ventana"
        />
      </>
    );
};

export {Llevarlink} ;