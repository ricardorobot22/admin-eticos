import { React, useState, useRef, useEffect, Fragment } from "react";
import IconButton from '@mui/material/IconButton';

import Box from "@mui/material/Box";
import Plusblue from "../assets/Icon-Plus-blue.svg";
import CategoryChecklist from "./checklist.jsx";

import {Chip,Typography, Paper, InputBase, Button, Stack,} from "@mui/material";


import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ClearIcon from "@mui/icons-material/Clear";



const Categorias = ({ chips,handleCreateChips,handleclearChips,handleDeleteChip ,selectedItems, setSelectedItems}) => {

 
  
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");

  const handleClearSelections = () => {
    setSelectedItems([]); // Vacía el array de seleccionados
  };

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = useRef(null);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <>
      <Typography
        fontSize="16px"
        fontWeight="500"
        lineHeight="24px"
        sx={{ mt: "16px" }}
      >
        Categorías
      </Typography>

      <Typography
        color="#667085"
        variant="subtitle1"
        fontSize="12px"
        lineHeight="16px"
        sx={{ mb: "8px" }}
      >
        Selecciona en que categorías o subcategorías se visualizará este banner
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          bgcolor: "#FFFFFF",
          p: "2px 4px",
          display: "flex",
          flexWrap: "wrap", // Permitir que los chips se ajusten en múltiples líneas
          alignItems: "center",
          height: "auto", // Altura automática para que el contenedor crezca según la cantidad de chips
          alignSelf: "stretch",
          border: "1px solid var(--gray-40098-a-2-b-3, #98A2B3)",
        }}
      >

        {chips.map((item) => (
          <Chip key={item.id} label={item.label} 
          onDelete={() => handleDeleteChip(item.id)} 
          sx={{
            color: "#FCFCFD",
            bgcolor: "#667085",
            borderColor: "#5881C3",
            margin: "4px", // Añadir un margen entre los chips
          }}/>
        ))}
        <InputBase sx={{ ml: 1, flex: 1 }}   onClick={handleClickOpen("paper")} />
      </Paper>

      <Stack
        sx={{ mt: "8px", alignSelf: "stretch" ,  justifyContent:"space-between", alignItems:"center"}}
        spacing={1}
        direction="row"
      
      >
        <Button
          size="small"
          variant="outlined"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "100px",
          }}
          onClick={handleClickOpen("paper")}
        >
          <Box
            component="img"
            src={Plusblue}
            alt="Añadir categoria"
            sx={{ marginRight: 1 }}
          />
          Añadir categoría
        </Button>

        <Button
          size="small"
          
     
          sx={{ display: "flex", borderRadius: " 100px" ,justifyContent:"center",alignItems:"center"}}
          onClick={handleclearChips}
        >
       
          Eliminar categorias
        </Button>
      </Stack>

      <Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth={true}
          maxWidth={"lg"}
        >
          <Stack
            sx={{ mt: "8px", alignSelf: "stretch",justifyContent:"space-between", alignItems:"center" }}
            spacing={1}
            direction="row"
    
          >
            <DialogTitle
              fontSize="24px"
              fontWeight="700"
              lineHeight="32px"
              id="scroll-dialog-title"
            >
              Categorías
            </DialogTitle>
            <IconButton aria-label="delete" onClick={handleClose}>
              <ClearIcon  />
            </IconButton>
          </Stack>
          <DialogContent dividers={scroll === "paper"}>
            <DialogContentText
              id="scroll-dialog-description"
              ref={descriptionElementRef}
              tabIndex={-1}
            >

              < CategoryChecklist selectedItems={selectedItems} setSelectedItems={setSelectedItems} />

            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ padding: "24px 40px", justifyContent: "flex-start" }}>
            <Button
              variant="contained"
              sx={{
                display: "flex",
                borderRadius: " 100px",
                bgcolor: "#1C58B7",
              }}
             

              onClick={() => {
                handleCreateChips();
                handleClose();
               // handleClearSelections();
              }}
            >
              Agregar
            </Button>
            <Button
              variant="outlined"
              sx={{ display: "flex", borderRadius: " 100px" }}
              onClick={handleClearSelections}
            >
              Deseleccionar todo
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    </>
  );
};

export { Categorias };
