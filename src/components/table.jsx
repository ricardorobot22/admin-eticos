import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';

import { Button, Menu, MenuItem, Checkbox, ListItemIcon, ListItemText, Chip, Paper, InputBase, IconButton , Typography} from '@mui/material';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import  {  useState,useRef,useEffect, forwardRef, useImperativeHandle } from "react";
import Archive from '../assets/Icon-Archive.svg';
import Pencil from '../assets/Icon-Pencil.svg';
import {StyledTableCell} from "../styles/styles.jsx";


import { useNavigate } from "react-router-dom"
import CustomAlert from './Alert.jsx';
import { visuallyHidden } from '@mui/utils';


import moment from 'moment';
import { _fetch,DATASET, IMP } from '../services/core.js';

import options from "../assets/Icon-DotsThreeCircleVertical.svg"
import { useGlobalContext } from '../services/globalContext.jsx';
import ImageCarouselDialog from './Carrusel.jsx';
import { getBannerModel } from '../util/bannerUtils.jsx';



const estadoColorMap = {
  Activo: { backgroundColor: '#D6F3E9', color: '#039855' },
  Programado: { backgroundColor: '#FCF0DB', color: '#DC6803' },
  Vencido: { backgroundColor: '#FDE1E1', color: '#BB251A' }
};

const Formats = [
  { key: 'superior', label: 'Banner superior' },
  { key: 'inferior', label: 'Banner inferior' },
  { key: 'popup', label: 'Popup' },
  { key: 'busquedas', label: 'Banner Búsqueda' }
];

function FormatChips({ results, popup }) {
  let data = null;

  try {
    data = JSON.parse(results);
  } catch (error) {
    data = results;
  }
 
  return (
    <>
      {Formats.map((format, index) =>
        (data.hasOwnProperty(format.key)) ? (
          
          <Chip
            key={index}
            label={`${format.label}`} // Mostramos el valor de la propiedad
            variant="outlined"
            sx={{ marginRight: '5px', marginBottom: '5px', color: "#1C58B7", bgcolor: "#ECF4FC" }}
          />
        ) : null
      )}
      {popup && ( // Verifica si 'popup' existe, si es así, muestra el chip de popup
        <Chip
          key="popup"
          label="Popup"
          variant="outlined"
          sx={{ marginRight: '5px', marginBottom: '5px', color: "#1C58B7", bgcolor: "#ECF4FC" }}
        />
      )}
    </>
  );
 
}

function descendingComparator(a, b, orderBy) {
  const valueA = a[orderBy];
  const valueB = b[orderBy];


  const dateA = new Date(valueA);
  const dateB = new Date(valueB);


  if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {

    if (dateB < dateA) {
      return -1;
    }
    if (dateB > dateA) {
      return 1;
    }
  } else {

    if (valueB < valueA) {
      return -1;
    }
    if (valueB > valueA) {
      return 1;
    }
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: 'titulo',
    numeric: false,
    disablePadding: false,
    label: 'Nombre',
  },
  {
    id: 'formato',
    numeric: false,
    disablePadding: false,
    label: 'Formato',
  },
  {
    id: 'fecha_inicio',
    numeric: false,
    disablePadding: false,
    label: 'Fecha inicio',
  },
  {
    id: 'fecha_fin',
    numeric: false,
    disablePadding: false,
    label: 'Fecha fin',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Estado',
  },
  {
    id: 'Grab',
    numeric: false,
    disablePadding: false,
    label: '',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <StyledTableCell padding="checkbox" sx={{ border: " 1px solid var(--gray-200-e-4-e-7-ec, #E4E7EC)" }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </StyledTableCell>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ border: " 1px solid var(--gray-200-e-4-e-7-ec, #E4E7EC)" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};


function EnhancedTableToolbar(props) {
  const { selectedOptions,numSelected, selectedBanner,handleArchivarClick} = props;

  const navigate = useNavigate();   
  const handleEditarCampana = () => {      
    navigate('/Editar_Campaña', { state: { banner: selectedBanner } });   
  };

  const getArchive = () => {
  if(selectedOptions.includes("Archivados")){
    return<>Desarchivar</>
   
  }else{
    return  <>Archivar</>
  }
   
  }

  return (
    <Toolbar sx={[{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, }]} >
      {numSelected > 0 && (
        <Typography
          sx={{ flex: '1 1 100%', ml: "10px", mr:"10px"}}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} seleccinados
        </Typography>
      )}

      {numSelected > 0 && (
       <Box sx={{ display: 'flex',ml:"24px", alignItems: 'center' }}>
        <Button onClick={handleArchivarClick} variant="text"  sx={{justifyContent:"center" ,alignItems:"center", color: '#1C58B7' }}><Box component="img" src={Archive} alt="Archivar" sx={{ marginRight: 1 }} />   <>{getArchive()}</></Button>
        </Box>
              
            )}

        {numSelected > 0 && numSelected < 2 && (
          <Box sx={{ display: 'flex',ml:"24px", alignItems: 'center' }}>
          <Button  onClick={handleEditarCampana} variant="text" sx={{justifyContent:"center" ,alignItems:"center", color: '#1C58B7' }}><Box component="img" src={Pencil} alt="Editar" sx={{ marginRight: 1 }} />Editar </Button>
          </Box>
              
            )}
  
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  handleArchivarClick: PropTypes.func.isRequired,
};

const  EnhancedTable = forwardRef(({selectedBanner,setSelectedBanner,grupo,estado,selected,setSelected,filterText,selectedOptions},ref ) =>{
  const navigate = useNavigate();  
  const handleEditarCampana = (banner) => {      
    navigate('/Editar_Campaña', { state: { banner } });   
  };
 

  const { Farmacia } = useGlobalContext();

  const ds_banners = new DATASET({
    api_model: getBannerModel(Farmacia),
    scheme: {
      id: null,
      estado: 1,
      data: null,
      imagen: null,
      imagen2: null,
      imagen3: null,
      position: null,
      titulo: null,
      titulopublico: null,
      fecha_inicio: null,
      fecha_fin: null,
      grupo: null,
    },
    sort: { id: "DESC" },
  });




  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('formato');
  const [page, setPage] = useState(0);
  // const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [dataBanners, setDataBanners] = useState([]);
  const [bannersObj, setBannersObj] = useState({});
  const [currentBanners, setCurrentBanners] = useState([]);
  
  const formRef = useRef(null); 



  useEffect(() => {
    const init = async () => {
      await loadBanners();
    };
    init();
  }, [grupo, estado,Farmacia]);

  const loadBanners = async () => {
    const bannersData = await ds_banners.get({paging: { limit: 100 },});
    
    const bannersArray = bannersData.default;
    const bannersObj = {};

    IMP.forEach(bannersArray, (item) => {
      const fechaFin = moment(item.fecha_fin).add(1, 'days').endOf('day'); // Fin del día ajustado
      const fechaInicio = moment(item.fecha_inicio) // Comienzo del día
      const today = moment().startOf('day'); // Fecha actual sin tiempo
      
      // Determinar el estado del banner basado en las fechas ajustadas
      item.status = today.isAfter(fechaFin)
          ? "Vencido"
          : today.isBefore(fechaInicio)
          ? "Programado"
          : "Activo"; // Incluye si el día es igual a fechaInicio o fechaFin
      
      bannersObj[item.id] = { item, position: noErrorParse(item.position) };
  });

    setDataBanners(bannersArray); 
    setBannersObj(bannersObj);
  };

  useEffect(() => {
    if (dataBanners.length > 0) {
      
    }
  }, [dataBanners]);

  const handleRowClick = (banner) => {
    if (!anchorEl) { 
    setSelectedBanner(banner); 
    }
  };

const filteredrows = dataBanners.filter(row => {
  const matchesName = row.titulo && row.titulo.toLowerCase().includes(filterText.toLowerCase());

  if (selectedOptions.includes("Archivados")) {
    return matchesName && row.estado === 0;
  } else {
    const matchesState = selectedOptions.length > 0 ? selectedOptions.includes(row.status) : true;
    return matchesName && matchesState && row.estado === 1;
  }
});


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredrows.map((n) => n.id);
      setSelected(newSelected);
   
      return;
    }
    setSelected([]);
 
  };

  const handleClick = (event, id) => {
    if (!anchorEl) {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  }
  };




  const [alertOpen, setAlertOpen] = useState(false);
  const [alertProps, setAlertProps] = useState({
    show: false,
    mode: 'OK',
    msg1: '',
    msg2: '',
  });

  const showAlert = React.useCallback((mode, msg1, msg2) => {
    setAlertProps({ show: true, mode, msg1, msg2 });
    setAlertOpen(true);
 }, []);

  const handleCloseAlert = () => {
    setAlertOpen(false);
    setAlertProps({ show: false, mode: '', msg1: '', msg2: '' });
 };

 useImperativeHandle(ref, () => ({
  archivarBanners,
}));




  const archivarBanners = async () => {
    const sendData = {};

    IMP.forEach(selected, (item, index) => {
      if (!item ) return;

      sendData[index] = {
        mode: "set",
        table: getBannerModel(Farmacia),
        fields: {estado: selectedOptions.includes("Archivados")? "1":"0" },
        filter: { id: item }
      };
    });
  

  try {
    const result = await _fetch(ds_banners.endpoint, sendData);
    const elem = getBannerModel(Farmacia);
    const reset = await _fetch("resetcache", {elem: "banners"})
   
    await loadBanners();
    showAlert('OK', 'Éxito', 'Cambios guardados con éxito')
  } catch (error) {
    showAlert('ERROR', 'Error', 'Hubo un error con el guardado de cambios.')
    console.error("Error en guardarBanners:", error);
  }
 
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredrows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      filteredrows.sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage,filteredrows],
    
  );

  const [anchorEl, setAnchorEl] = useState(null); //gestion de abrir y cerrar filtrado por estado
  const handleOptionsClick = (event,row) => {setAnchorEl(event.currentTarget); handleClick(event,row.id); event.stopPropagation(); setSelectedBanner(row);};
  const handleClose = (event) => {setAnchorEl(null); setSelected([]); event.stopPropagation();  };
  const handleOptionArchivar = () => { archivarBanners(); setSelected([]);}
  const open = Boolean(anchorEl);

  const getArchive = () => {
    if(selectedOptions.includes("Archivados")){
      return<>Desarchivar</>
     
    }else{
      return  <>Archivar</>
    }
     
    }

  return (
    <><Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredrows.length} />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                const namebw = row.imagen ? row.imagen.split('/').pop() : null;
                const nameba = row.imagen2 ? row.imagen2.split('/').pop() : null;
                const namebp= row.imagen3 ? row.imagen3.split('/').pop() : null;

                return (
                  <TableRow
                    hover
                    onClick={(event) => {
                      handleClick(event, row.id);
                      handleRowClick(row);
                    }}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <StyledTableCell padding="checkbox" sx={{ border: " 1px solid var(--gray-200-e-4-e-7-ec, #E4E7EC)" }}>
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }} />
                    </StyledTableCell>
                    <StyledTableCell component="th" id={labelId} scope="row" padding="none" sx={{ border: "1px solid var(--gray-200-e-4-e-7-ec, #E4E7EC)" }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }} >
                        {(row.imagen || row.imagen2 || row.imagen3) && (
                          <ImageCarouselDialog
                            images={[row.imagen, row.imagen2, row.imagen3].filter(Boolean)}
                            triggerImage={row.imagen}
                            imageTexts={[namebw, nameba, namebp].filter(Boolean)}
                            sx={{
                              width: 45,
                              height: 45,
                              borderRadius: '8px',
                              objectFit: 'cover',
                              marginRight: 0,
                              mx: 2
                            }}
                           
                          />
                        )}
                        {/* Agrega onClick al título para navegar al banner */}
                        <Box onClick={() => handleEditarCampana(row)} sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
                          {row.titulo}
                        </Box>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell align="left">  <FormatChips results={row.position} popup={row.imagen3} /></StyledTableCell>
                    <StyledTableCell align="left" sx={{ border: " 1px solid var(--gray-200-e-4-e-7-ec, #E4E7EC)" }}>
                      {formatDate("short", row.fecha_inicio)}
                    </StyledTableCell>
                    <StyledTableCell align="left" sx={{ border: " 1px solid var(--gray-200-e-4-e-7-ec, #E4E7EC)" }}>
                      {formatDate("short", row.fecha_fin)}
                    </StyledTableCell>
                    <StyledTableCell align="left" sx={{ border: " 1px solid var(--gray-200-e-4-e-7-ec, #E4E7EC)" }}>
                      <Chip
                        variant="outlined"
                        label={row.status}
                        sx={{
                          backgroundColor: estadoColorMap[row.status]?.backgroundColor || 'default',
                          color: estadoColorMap[row.status]?.color || 'black',
                        }} />
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Box
                        component="img"
                        src={options}
                        alt="options"
                        onClick={(event) => handleOptionsClick(event, row)} 
                        sx={{
                          height: "25px",      // Mantiene la relación de aspecto
                          padding: 0,          // Elimina padding
                          margin: 0,           // Elimina margen
                          display: "block",    // Evita comportamiento inline
                          cursor: "pointer",   // Indica que es interactivo
                        }}
                      />

                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        sx={{
                          '& .MuiPaper-root': {
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Sombra personalizada ligera
                          }
                        }}
                      >
                        <MenuItem onClick={handleOptionArchivar}  >
                          <ListItemIcon >
                            <img src={Archive} alt="Archivar" style={{ width: 20, height: 20 }} />
                          </ListItemIcon>
                          <ListItemText primary={getArchive()} />
                        </MenuItem>

                        <MenuItem onClick={() => handleEditarCampana(selectedBanner)}>
                          <ListItemIcon>
                            <img src={Pencil} alt="Editar" style={{ width: 20, height: 20 }} />
                          </ListItemIcon>
                          <ListItemText primary="Editar" />
                        </MenuItem>
                      </Menu>
                    </StyledTableCell>

                  </TableRow>
                );
              })}
              {/* {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <StyledTableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredrows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
                  {alertOpen && (
   <CustomAlert
      show={alertProps.show}
      mode={alertProps.mode}
      msg1={alertProps.msg1}
      msg2={alertProps.msg2}
      onClose={handleCloseAlert}
   />
)}
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </Box></>

  );
});

const formatDate = (type, date) => {
  switch (type) {
    case "short":
      return moment(date).add(1, 'days').format("MMM DD YYYY");
    case "compact":
      return moment(date).add(1, 'days').format("YYYY-MM-DD");
    default:
      return date;
  }
};
const noErrorParse = (data) => {
  if (!data || data === "") return {};
  let parsedData = {};
  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    parsedData = {};
  }
  return parsedData;
};

export {EnhancedTable,EnhancedTableToolbar}