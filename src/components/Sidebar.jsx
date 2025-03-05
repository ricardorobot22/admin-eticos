import * as React from 'react';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Select, MenuItem, FormControl, InputLabel, Avatar, Box,Typography } from '@mui/material';
import HandSoap from '../assets/Icon-HandSoap.svg';
import Megaphone from '../assets/Icon-Megaphone.svg';
import TrendUp from '../assets/Icon-TrendUp.svg';
import Gear from '../assets/Icon-Gear.svg';
import SignOut from '../assets/Icon-SignOut.svg';
import LogoEticos from '../assets/Icon-Eticos.svg';
import IconTor from '../assets/Icon-Tor.png';
import IconEti from '../assets/Icon-Eti.png';

import IconEco from '../assets/Icon-Eco.png';
import {useNavigate} from "react-router-dom"
import { useGlobalContext } from '../services/globalContext.jsx';
import { jwtDecode } from "jwt-decode";


import Stack from '@mui/material/Stack';
import { useReducer } from 'react';

const drawerWidth = 240;
  
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor:"#ECF4FC",
          color:"#1C58B7"
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  
    };
  }

export default function Sidebar() {

  const { Farmacia, setFarmacia,logout } = useGlobalContext();

  const handleFarmacia = (event) => {
    setFarmacia(event.target.value);
  };


    const navigate = useNavigate();

    const iconsopt = [Megaphone, TrendUp, HandSoap];
    const iconsusr = [Gear, SignOut];

    const initialState = {
      selectedOptIndex: null,
      selectedUsrIndex: null,
    };

    

    const reducer = (state, action) => {
      switch (action.type) {
        case 'SELECT_OPT':
          return {
            ...state,
            selectedOptIndex: action.index,
            
          };
        case 'SELECT_USR':
          return {
            ...state,
            selectedUsrIndex: action.index,
          };
        default:
          return state;
      }
    };

      const [state, dispatch] = useReducer(reducer, initialState);

  const handleOptListItemClick = (index) => {
    dispatch({ type: 'SELECT_OPT', index });
    switch (index) {
      case 0:
        navigate('/campañas');
        break;
      // case 1:
      //   navigate('/Estadisticas');
      //   break;
      // case 2:
      //   navigate('/productos');
      //   break;
      default:
        break;
    } 
  };

  
  const handleUsrListItemClick = (index) => {
    dispatch({ type: 'SELECT_USR', index });
    switch (index) {
      case 0:
       // navigate('/configuracion');
        break;
        case 1:
          logout();
          navigate('/login');
          break;
      default:
        break;
    
    }
  };

  const storedToken = localStorage.getItem("token");
  const {name} = jwtDecode(storedToken);

  function splitAndInsertLineBreak(input) {
    const words = input.split(' ');
    return words;
  }
  
  return (



    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >

        <Box

          sx={{
            mt: 4, mb: 2, display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}>
          <img alt="Profile" src={LogoEticos} />
        </Box>

        <FormControl
          sx={{
            width: '200px',
            borderRadius: '8px',
            border: '1px solid #E4E7EC',
            mx: 'auto',
            mt: 2,
            mb: 2
          }} >
          <InputLabel id="dropdown-label"></InputLabel>
          <Select
            labelId="dropdown-label"
            id="dropdown"
            defaultValue={1}
            value={Farmacia}
            onChange={(event) => {
              handleFarmacia(event);
              handleOptListItemClick(0); // Aquí llamas a la función correctamente con el índice
            }}
            sx={{ borderRadius: '8px' }}
          >
            <MenuItem value={1}>
              <Stack direction="row" alignItems="center" sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <Avatar src={IconEco} sx={{ marginRight: 1, width: 24, height: 24 }} /> Droguería La Economia
              </Stack>
            </MenuItem>

            <MenuItem value={2}>
              <Stack direction="row" alignItems="center" sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <Avatar src={IconTor} sx={{ marginRight: 1, width: 24, height: 24 }} /> Farmacia Torres
              </Stack>
            </MenuItem>

            <MenuItem value={3}>
            <Stack direction="row" alignItems="center" sx={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <Avatar src={IconEti} sx={{ marginRight: 1, width: 24, height: 24 }} /> Eticos
            </Stack>
          </MenuItem>
          </Select>

        </FormControl>
    
        <Divider />

        <List>
          {['Campañas', 'Estadísticas', 'Productos', ].map((text, index) => (
            <ListItem key={text} disablePadding >
              <ListItemButton  onClick={() => handleOptListItemClick(index)} // Maneja el clic
            sx={{
              
              borderRadius: '8px',
              marginLeft:'20px',
              marginRight:'20px',
              backgroundColor: state.selectedOptIndex === index ? '#ECF4FC' : 'transparent',
              '&:hover': {
              backgroundColor:state.selectedOptIndex  === index ? '#ECF4FC' : 'rgba(0, 0, 255, 0.1)',
              },
            }}>
                <ListItemIcon>
                <img src={iconsopt[index]} alt={text} 
                style={{
                    filter:state.selectedOptIndex  === index ? '#1C58B7' : 'none', // Cambia el color del SVG si está seleccionado
                    transition: 'filter 0.3s ease', // Añade una transición suave
                  }}  />
                </ListItemIcon>
                <ListItemText primary={text}               sx={{
                color: state.selectedOptIndex === index ? '#1C58B7' : 'black', // Cambia el color del texto si está seleccionado
                transition: 'color 0.3s ease', // Añade una transición suave
              }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
    
        
        <List style={{ marginTop: 'auto' }}>
  
        <Divider />

      <ListItem disablePadding>
        <ListItemButton >
          <ListItemIcon>
            <Avatar {...stringAvatar(name)} />
          </ListItemIcon>
          <ListItemText
              primary={
                <Typography
                  variant="body2"
                  fontSize="12px"
                  fontWeight="600"
                  letterSpacing={1}
                >
                 {splitAndInsertLineBreak(name)[0] } <br />{splitAndInsertLineBreak(name)[1] } 
                </Typography>
              }
            />
        </ListItemButton>
      </ListItem>

     

  
      {['Configuración', 'Cerrar sesión'].map((text, index) => (
        <ListItem key={text} disablePadding>
          <ListItemButton   onClick={() =>  handleUsrListItemClick(index)} // Maneja el clic
            sx={{
              
              borderRadius: '8px',
              marginLeft:'20px',
              marginRight:'20px',
              backgroundColor:state.selectedUsrIndex  === index ? '#ECF4FC' : 'transparent',
              '&:hover': {
              backgroundColor: state.selectedUsrIndex  === index ? '#ECF4FC' : 'rgba(0, 0, 255, 0.1)',
              },
            }}>
            <ListItemIcon>
            <img src={iconsusr[index]} alt={text}  />
            </ListItemIcon>
            <ListItemText primary={text}  sx={{
                color:state.selectedUsrIndex  === index ? '#1C58B7' : 'black', // Cambia el color del texto si está seleccionado
                transition: 'color 0.3s ease', // Añade una transición suave
              }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>


      </Drawer>

    </Box>
  );
}