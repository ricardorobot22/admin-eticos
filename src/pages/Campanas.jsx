

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Plus from '../assets/Icon-Plus.svg';
import Filter from '../assets/Icon-Funnel.svg';
import Lupa from '../assets/Icon-MagnifyingGlass.svg';
import Floppy from "../assets/Icon-FloppyDisk.svg";

import { Button, Menu, MenuItem, Checkbox, ListItemIcon, ListItemText, Chip, Paper, InputBase, IconButton , Typography} from '@mui/material';
import React, { useState,useRef } from 'react';
import { StyledTabs, StyledTab, CustomTabPanel, a11yProps, ColorButton } from "../styles/styles.jsx";

import { useNavigate } from "react-router-dom"

import { EnhancedTable, EnhancedTableToolbar } from "../components/table.jsx";
import { EnhancedPosicion, EnhancedPosicionToolbar } from "../components/Posicion.jsx";

import { EnhancedPopup,EnhancedPopupToolbar} from "../components/Popups.jsx"


import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select  from '@mui/material/Select';



function Campanas() {

  const options = ["Activo", "Vencido", "Programado","Archivados"];

  const [anchorEl, setAnchorEl] = useState(null); //gestion de abrir y cerrar filtrado por estado
  const handleClick = (event) => {setAnchorEl(event.currentTarget)};
  const handleClose = () => {setAnchorEl(null);};
  const open = Boolean(anchorEl);

  const navigate = useNavigate();   // libreria para navegar entre ventanas de react
  const handleNuevaCampana = () => {      
    navigate('/Nueva_Campaña');     
  };

  const [value, setValue] = useState(0);       // esto se usa para cambiar de ventanas entre la vista de campañas
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const posicionRef = useRef();
 
  const handleGuardarClick = () => {
   if (posicionRef.current) {
     posicionRef.current.guardarBanners();  // Aquí llamas a la función del componente hijo
   }
 };

 const generalRef = useRef();
 


   
  //tabla general

  const [selectedBanner, setSelectedBanner] = useState(null); // cargar datos de banner seleccionado para posterior uso

  const [group, setGroup] = useState("superior");  //selects de grupo y estado como admin viejo
  const [estado, setEstado] = useState(1);

  const [filterText, setfilterText] = useState("")  //filtrado de texto
  const handleFilterChange = (event) => { setfilterText(event.target.value)};

  const [selected, setSelected] = useState([]);    // campañas seleccionadas con checkbox

  const handleArchivarClick = () => {  //archivar banners y deseleccionar elementos
    if (generalRef.current) {
      generalRef.current.archivarBanners();  // Aquí llamas a la función del componente hijo
    }
    setSelected([]);
  };

  const [selectedOptions, setSelectedOptions] = useState([]);  //filtrado por estado (activo,programado,vencido)
 
  const handleDeleteTag = (option) => {
      setSelectedOptions((prevSelectedOptions) =>prevSelectedOptions.filter((opt) => opt !== option));
  };

  const handleToggle = (option) => {
    const currentIndex = selectedOptions.indexOf(option);
    const newSelectedOptions = [...selectedOptions];

    if (currentIndex === -1) {
      newSelectedOptions.push(option);
    } else {
      newSelectedOptions.splice(currentIndex, 1);
    }

    setSelectedOptions(newSelectedOptions);
  };

   //tabla Banners

  const [filterTextPos, setfilterTextPos] = useState("")   //filtrado de texto
  const handleFilterChangePos = (event) => {setfilterTextPos(event.target.value);};

  const [selectedPos, setSelectedPos] = useState([]);      // campañas seleccionadas con checkbox

  const [selectedOptionsPos, setSelectedOptionsPos] = useState([]);   //filtrado por estado (activo,programado,vencido)
 
  const [selectedBannerView, setSelectedBannerView] = useState("superior"); // control de seleccion de chip (superior,inferior,busqueda)

  const [grupo, setGrupo] = useState("superior");   //cambiar entre la posicion de los banners (superior,inferior,busqueda)
  
  const handleGroup = (value) => {
      setGrupo(value); // Limpiar el campo de entrada
    
  };
 

  const handleDeleteTagPos = (option) => {
    setSelectedOptionsPos((prevSelectedOptions) =>prevSelectedOptions.filter((opt) => opt !== option));
  };

  const handleTogglePos = (option) => {
    const currentIndex = selectedOptionsPos.indexOf(option);
    const newSelectedOptions = [...selectedOptionsPos];

    if (currentIndex === -1) {
      newSelectedOptions.push(option);
    } else {
      newSelectedOptions.splice(currentIndex, 1);
    }

    setSelectedOptionsPos(newSelectedOptions);

  };

  const bannerOptions = [
    { label: 'Superior', value: 'superior' },
    { label: 'Inferior', value: 'inferior' },
    { label: 'Búsqueda', value: 'busquedas' },
 
  ];

  const handleChipStyles = (isSelected) => ({
    backgroundColor: isSelected ? '#1C58B7' : '#F2F4F7',
    color: isSelected ? '#FCFCFD' : '#1C58B7',
    '&:hover': {
      backgroundColor: isSelected ? '#1C58B7' : '#ECF4FC',
      color: '#101828',
    },
  });

   //tabla Popups

   const [filterTextPop, setfilterTextPop] = useState("")   //filtrado de texto
   const handleFilterChangePop = (event) => {setfilterTextPop(event.target.value);};
 
   const [selectedPop, setSelectedPop] = useState([]);      // campañas seleccionadas con checkbox
 
   const [selectedOptionsPop, setSelectedOptionsPop] = useState([]);   //filtrado por estado (activo,programado,vencido)
  
   const [selectedPopView, setSelectedPopView] = useState("superior"); // control de seleccion de chip (superior,inferior,busqueda)
 
   const [grupoPop, setGrupoPop] = useState("superior");   //cambiar entre la posicion de los banners (superior,inferior,busqueda)
   
   const handleGroupPop = (value) => {
    setGrupoPop(value); // Limpiar el campo de entrada
     
   };
   

   const handleDeleteTagPop = (option) => {
    setSelectedOptionsPop((prevSelectedOptions) =>prevSelectedOptions.filter((opt) => opt !== option));
  };

  const handleTogglePop = (option) => {
    const currentIndex = selectedOptionsPop.indexOf(option);
    const newSelectedOptions = [...selectedOptionsPop];

    if (currentIndex === -1) {
      newSelectedOptions.push(option);
    } else {
      newSelectedOptions.splice(currentIndex, 1);
    }

    setSelectedOptionsPop(newSelectedOptions);

  };


 






  return (
    <>


      <Stack spacing={1} direction="row" sx={{justifyContent:"space-between" ,alignItems:"center"}} >
        <h1>Campañas</h1>
        <Button variant="contained"  onClick={handleNuevaCampana} sx={{ justifyContent:"center", alignItems:"center",padding: " 12px 24px", display: 'flex', borderRadius: ' 100px', bgcolor: "#1C58B7" }}><Box component="img" src={Plus} alt="Nueva Campaña" sx={{ marginRight: 1 }} /> Nueva campaña</Button>
      </Stack>


      <Box sx={{ display: 'flex', flexGrow: 1, bgcolor: '#FCFCFD', borderRadius: ' 8px', mt: "24px" }}>
        <Box sx={{ display: 'flex', flexGrow: 1, mt: "8", mx: "24px" }}>

          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
              <StyledTabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <StyledTab label="General" {...a11yProps(0)} />
                <StyledTab label="Banners" {...a11yProps(1)} />
                <StyledTab label="Pop-ups" {...a11yProps(2)} />
              </StyledTabs>
            </Box>


            <CustomTabPanel value={value} index={0}>

              <Stack spacing={1} direction="row"  sx={{ mb: "24px" ,justifyContent:"space-between" , alignItems:"center"}}>


                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>

                  <Paper
                    component="form"
                    sx={{ bgcolor: "#F2F4F7", p: '2px 4px', display: 'flex', alignItems: 'center', width: 256 }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Buscar campaña"
                      inputProps={{ 'aria-label': 'search google maps' }}
                      value={filterText}
                      onChange={handleFilterChange}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                      <img src={Lupa} alt="Lupa" />
                    </IconButton>
                  </Paper>

                  <EnhancedTableToolbar  selectedOptions={selectedOptions} numSelected={selected.length} selectedBanner={selectedBanner}  handleArchivarClick={handleArchivarClick} />

                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    {selectedOptions.map((option) => (
                      <Chip
                        key={option}
                        label={option}
                        onDelete={() => handleDeleteTag(option)} // Función para eliminar el tag
                        sx={{ margin: '4px', color: "#1C58B7", bgcolor: "#ECF4FC", borderColor: "#5881C3" }}

                      />
                    ))}
                  </Box>
                </Box>

                <ColorButton
                  variant="outlined"
                  startIcon={<Box component="img" src={Filter} alt="filtro" />}
                  onClick={handleClick}
                  sx={{ textTransform: 'none' }}
                >
                  Filtro
                </ColorButton>

                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  {options.map((option) => (
                    <MenuItem key={option} onClick={() => handleToggle(option)}>
                      <ListItemIcon>
                        <Checkbox
                          checked={selectedOptions.indexOf(option) > -1}
                          edge="start"
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText primary={option} />
                    </MenuItem>
                  ))}
                </Menu>

              </Stack>

   < EnhancedTable selectedBanner={selectedBanner} setSelectedBanner={setSelectedBanner}  grupo={group} estado={estado} selected={selected} setSelected={setSelected} filterText={filterText} selectedOptions={selectedOptions} ref={generalRef }/>

            </CustomTabPanel>



            <CustomTabPanel value={value} index={1}>

              <Stack spacing={1} direction="row"  sx={{justifyContent:"space-between" ,alignItems:"center"}}>
                <Box>
                  <Typography fontSize="20px" fontWeight="700" lineHeight="28px">
                    Banners
                  </Typography>

                  <Typography
                    color="var(--gray-700101828, #101828)"
                    fontWeight="400"
                    fontSize="12px"
                    lineHeight="16px"
                    sx={{ mb: "24px" }}
                  >
                    Gestiona el orden y estado de los banners de acuerdo a la sección en que se encuentre.
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleGuardarClick}
                  sx={{  justifyContent:"center",alignItems:"center" ,display: "flex", borderRadius: " 100px" , p:"8px 16px",border: "1px solid var(--primary-default-1-c-58-b-7, #1C58B7)"}}
                >
                  <Box
                    component="img"
                    src={Floppy}
                    alt="Añadir categoria"
                    sx={{ marginRight: 1 }}
                  />
                    <Typography
                      fontSize="14px"
                       fontWeight="500"
                      lineHeight="20px"
                      color="var(--primary-default-1-c-58-b-7, #1C58B7)">
                  Guardar cambios
                  </Typography>
                </Button>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mb: '16px' }}>
                {bannerOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    variant={selectedBannerView === option.value ? 'filled' : 'outlined'}
                    onClick={() => {
                      setSelectedBannerView(option.value);
                      handleGroup(option.value);
                    }}
                    sx={handleChipStyles(selectedBannerView === option.value)}  // Estilos dinámicos
                  />
                ))}
              </Stack>

{/* 
              <Stack spacing={1} direction="row"  sx={{ mb: "24px", justifyContent:"space-between", alignItems:"center"}}>


                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>

                  <Paper
                    component="form"
                    sx={{ bgcolor: "#F2F4F7", p: '2px 4px', display: 'flex', alignItems: 'center', width: 256 }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Buscar campaña"
                      inputProps={{ 'aria-label': 'search google maps' }}
                      value={filterTextPos}
                      onChange={handleFilterChangePos}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                      <img src={Lupa} alt="Lupa" />
                    </IconButton>
                  </Paper>

                  <EnhancedPosicionToolbar numSelected={selectedPos.length} />

                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    {selectedOptionsPos.map((option) => (
                      <Chip
                        key={option}
                        label={option}
                        onDelete={() => handleDeleteTagPos(option)} // Función para eliminar el tag
                        sx={{ margin: '4px', color: "#1C58B7", bgcolor: "#ECF4FC", borderColor: "#5881C3" }}

                      />
                    ))}
                  </Box>
                </Box>

                <ColorButton
                  variant="outlined"
                  startIcon={<Box component="img" src={Filter} alt="filtro" />}
                  onClick={handleClick}
                  sx={{ textTransform: 'none' }}
                >
                  Filtro
                </ColorButton>  

                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  {options.map((option) => (
                    <MenuItem key={option} onClick={() => handleTogglePos(option)}>
                      <ListItemIcon>
                        <Checkbox
                          checked={selectedOptionsPos.indexOf(option) > -1}
                          edge="start"
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText primary={option} />
                    </MenuItem>
                  ))}
                </Menu>

              </Stack> */}

            < EnhancedPosicion selected={selectedPos} setSelected={setSelectedPos} filterText={filterTextPos} selectedOptions={selectedOptionsPos} grupo={grupo} ref={posicionRef} />
              
            </CustomTabPanel>


            <CustomTabPanel value={value} index={2}> {/* hola hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh*/}


            <Stack spacing={1} direction="row"  sx={{justifyContent:"space-between" ,alignItems:"center",mb:"24px"}}>
                <Box>
                  <Typography fontSize="20px" fontWeight="700" lineHeight="28px">
                  Pop-ups
                  </Typography>


                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleGuardarClick}
                  sx={{  justifyContent:"center",alignItems:"center" ,display: "flex", borderRadius: " 100px" , p:"8px 16px",border: "1px solid var(--primary-default-1-c-58-b-7, #1C58B7)"}}
                >
                  <Box
                    component="img"
                    src={Floppy}
                    alt="Añadir categoria"
                    sx={{ marginRight: 1 }}
                  />
                    <Typography
                      fontSize="14px"
                       fontWeight="500"
                      lineHeight="20px"
                      color="var(--primary-default-1-c-58-b-7, #1C58B7)">
                  Guardar cambios
                  </Typography>
                </Button>
              </Stack>

              {/* <Stack direction="row" spacing={1} sx={{ mb: '16px' }}>
                {bannerOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    variant={selectedPopView === option.value ? 'filled' : 'outlined'}
                    onClick={() => {
                      setSelectedPopView(option.value);
                      handleGroupPop(option.value);
                    }}
                    sx={handleChipStyles(selectedPopView === option.value)}  // Estilos dinámicos
                  />
                ))}
              </Stack> */}


              {/* <Stack spacing={1} direction="row"  sx={{ mb: "24px",mt:"24px", justifyContent:"space-between", alignItems:"center"}}>


                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>

                  <Paper
                    component="form"
                    sx={{ bgcolor: "#F2F4F7", p: '2px 4px', display: 'flex', alignItems: 'center', width: 256 }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Buscar campaña"
                      inputProps={{ 'aria-label': 'search google maps' }}
                      value={filterTextPop}
                      onChange={handleFilterChangePop}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                      <img src={Lupa} alt="Lupa" />
                    </IconButton>
                  </Paper>

                  <EnhancedPopupToolbar numSelected={selectedPop.length} />

                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    {selectedOptionsPop.map((option) => (
                      <Chip
                        key={option}
                        label={option}
                        onDelete={() => handleDeleteTagPop(option)} // Función para eliminar el tag
                        sx={{ margin: '4px', color: "#1C58B7", bgcolor: "#ECF4FC", borderColor: "#5881C3" }}

                      />
                    ))}
                  </Box>
                </Box>

                <ColorButton
                  variant="outlined"
                  startIcon={<Box component="img" src={Filter} alt="filtro" />}
                  onClick={handleClick}
                  sx={{ textTransform: 'none' }}
                >
                  Filtro
                </ColorButton>  

                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  {options.map((option) => (
                    <MenuItem key={option} onClick={() => handleTogglePop(option)}>
                      <ListItemIcon>
                        <Checkbox
                          checked={selectedOptionsPop.indexOf(option) > -1}
                          edge="start"
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText primary={option} />
                    </MenuItem>
                  ))}
                </Menu>

              </Stack> */}

            < EnhancedPopup selected={selectedPop} setSelected={setSelectedPop} filterText={filterTextPop} selectedOptions={selectedOptionsPop} grupo={grupoPop} ref={posicionRef} />
              
        
     

            </CustomTabPanel>
          </Box>

        </Box>
      </Box>












    </>

  );
}




export { Campanas }