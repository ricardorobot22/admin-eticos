import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import ViewCompactIcon from "@mui/icons-material/ViewCompact";

import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import Archive from "../assets/Icon-Archive.svg";
import Pencil from "../assets/Icon-Pencil.svg";
import { StyledTableCell } from "../styles/styles.jsx";
import Chip from "@mui/material/Chip";
import Link from '@mui/material/Link';
import ImageCarouselDialog from './Carrusel.jsx';

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { visuallyHidden } from "@mui/utils";

import moment from 'moment-timezone';
import { _fetch, DATASET, IMP } from "../services/core.js";
import { useGlobalContext } from '../services/globalContext.jsx';
import { getBannerModel } from '../util/bannerUtils.jsx';

const linkEco="https://www.droguerialaeconomia.com";
const linkTor="https://www.farmaciatorres.com";



const estadoColorMap = {
    Activo: { backgroundColor: "#D6F3E9", color: "#039855" },
    Programado: { backgroundColor: "#FCF0DB", color: "#DC6803" },
    Vencido: { backgroundColor: "#FDE1E1", color: "#BB251A" },
};

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
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
    {
        id: "espacio1",
        numeric: false,
        disablePadding: true,
        label: "",
    },
    {
        id: "posicion",
        numeric: false,
        disablePadding: true,
        label: "Pos",
    },
    {
        id: "titulo",
        numeric: false,
        disablePadding: true,
        label: "Nombre",
    },
    {
        id: "imagen",
        numeric: false,
        disablePadding: false,
        label: "Imagen",
    },
    {
        id: "link",
        numeric: false,
        disablePadding: false,
        label: "Link",
    },
    {
        id: "fecha_inicio",
        numeric: false,
        disablePadding: false,
        label: "Fecha inicio",
    },
    {
        id: "fecha_fin",
        numeric: false,
        disablePadding: false,
        label: "Fecha fin",
    },
    {
        id: "status",
        numeric: false,
        disablePadding: false,
        label: "Estado",
    },
    {
        id: "espacio2",
        numeric: false,
        disablePadding: true,
        label: "",
    },
];

function EnhancedTableHead(props) {
    const {
        onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <StyledTableCell style={{
                        padding: "5px",
                        borderRight: "1px solid #ddd",
                        borderLeft: "1px solid #ddd",
                        borderTop: "1px solid #ddd",
                        textAlignLast: "center",
                    }}> {headCell.label}</StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedPopupToolbar(props) {
    const { numSelected } = props;
    return (
        <></>
        // <Toolbar sx={[{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }]}>
        //   {numSelected > 0 && (
        //     <Typography
        //       sx={{ flex: "1 1 100%", ml: "24px", mr: "24px" }}
        //       color="inherit"
        //       variant="subtitle1"
        //       component="div"
        //     >
        //       {numSelected} seleccinados
        //     </Typography>
        //   )}

        //   {numSelected > 0 && (
        //     <Box sx={{ display: "flex", ml: "24px", alignItems: "center" }}>
        //       <Button
        //         variant="text"
        //         sx={{
        //           color: "#1C58B7",
        //           justifyContent: "center",
        //           alignItems: "center",
        //         }}
        //       >
        //         <Box
        //           component="img"
        //           src={Archive}
        //           alt="Archivar"
        //           sx={{ marginRight: 1 }}
        //         />
        //         Archivar{" "}
        //       </Button>
        //     </Box>
        //   )}

        //   {numSelected > 0 && numSelected < 2 && (
        //     <Box sx={{ display: "flex", ml: "24px", alignItems: "center" }}>
        //       <Button
        //         variant="text"
        //         sx={{
        //           color: "#1C58B7",
        //           justifyContent: "center",
        //           alignItems: "center",
        //         }}
        //       >
        //         <Box
        //           component="img"
        //           src={Pencil}
        //           alt="Archivar"
        //           sx={{ marginRight: 1 }}
        //         />
        //         Editar{" "}
        //       </Button>
        //     </Box>
        //   )}
        // </Toolbar>
    );
}

EnhancedPopupToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const EnhancedPopup = forwardRef(
  ({ selected, setSelected, filterText, selectedOptions, grupo }, ref) => {
    const { Farmacia } = useGlobalContext();

    const ds_banners = new DATASET({
      api_model:getBannerModel(Farmacia),
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

    const [dataBanners, setDataBanners] = useState([]);
    const [bannersObj, setBannersObj] = useState({});
    const [currentBanners, setCurrentBanners] = useState([]);
    const [positions, setPositions] = useState({});

    useEffect(() => {
      loadBanners();
    }, [Farmacia]);

    const loadBanners = async () => {
      const bannersData = await ds_banners.get({ paging: { limit: 100 } });

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
        renderBanners();
      }
    }, [dataBanners]);

    const renderBanners = () => {
      const newBanners = [];

      IMP.forEach(dataBanners, (item) => {
        // Parsear el campo 'data'
        const parsedData = noErrorParse(item.data);

        // Verificar si la fecha actual está entre la fecha de inicio y la fecha de fin
        const fechaInicio = moment(item.fecha_inicio).startOf("day");
        const fechaFin = moment(item.fecha_fin).add(1, "days").endOf("day"); // Sumamos un día al final para incluir el último día
        const now = moment().tz("America/Bogota");

        const isBetweenDates =
          now.isBetween(fechaInicio, fechaFin) || now.isBefore(fechaInicio);

        // Filtrar por 'home_popup': '1', verificar que esté activo (estado === 1), que la imagen esté presente y que la fecha sea válida
        if (parsedData && parsedData.home_popup === "1" && isBetweenDates) {
          newBanners.push(item); // Agregar el banner a la lista de banners activos
        }
      });

      // Actualizar el estado con los banners filtrados
      setCurrentBanners(newBanners); // Usar el array newBanners filtrado
    };

    // const [page, setPage] = useState(0);
    // const [dense, setDense] = useState(false);
    // const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("formato");

    const reorder = (list, startIndex, endIndex) => {
      const cleanList = list.filter(
        (item) => item !== null && item !== undefined
      );

      if (
        startIndex < 0 ||
        endIndex < 0 ||
        startIndex >= cleanList.length ||
        endIndex >= cleanList.length
      ) {
        return cleanList;
      }

      const result = Array.from(cleanList);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };
    const handleOnDragEnd = (result) => {
      // Si no hay un destino, no se hace nada
      if (!result.destination) return;

      // Llamamos a la función `reorder` para obtener los elementos reordenados
      const movedItems = reorder(
        currentBanners,
        result.source.index,
        result.destination.index
      );

      // Verificamos que `movedItems` sea un array válido y que no contenga elementos `undefined`
      if (!movedItems || movedItems.some((item) => item === undefined)) {
        console.error("Se ha encontrado un elemento indefinido en movedItems.");
      }

      // Solo si realmente se ha movido algo (opcional)
      if (result.source.index !== result.destination.index) {
        setCurrentBanners(movedItems);

        // Almacena las nuevas posiciones en el estado `positions`
        const newPositions = {};
        movedItems.forEach((item, index) => {
          if (item && item.id) {
            newPositions[item.id] = index; // Guarda la posición de cada banner
          }
        });

        setPositions(newPositions);
      }
    };

    // useImperativeHandle(ref, () => ({
    //     guardarBanners,
    // }));

    const guardarBanners = async () => {
      const sendData = {};

      IMP.forEach(dataBanners, (item, index) => {
        const data = bannersObj[item.id].position || {};
        const pos = positions[item.id];

        if (pos === undefined) {
          data[grupo] = undefined;
        } else {
          data[grupo] = pos;
        }

        sendData[index] = {
          mode: "set",
          table: "banners",
          fields: { position: JSON.stringify(data) },
          filter: { id: item.id },
        };
      });

      try {
        const result = await _fetch(ds_banners.endpoint, sendData);

        await loadBanners();
      } catch (error) {
        console.error("Error en guardarBanners:", error);
      }
      //const result = await _fetch("resetcache", {elem: "banners"})
    };

    const filteredrows = currentBanners.filter((row) => {
      if (!row) return;
      const matchesName =
        row.titulo &&
        row.titulo.toLowerCase().includes(filterText.toLocaleLowerCase());

      const matchesState =
        selectedOptions.length > 0
          ? selectedOptions.includes(row.status)
          : true;

      return matchesName && matchesState;
    });

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelected = currentBanners.map((n) => n.id);
        setSelected(newSelected);

        return;
      }
      setSelected([]);
    };
    const handleClick = (event, id) => {
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
          selected.slice(selectedIndex + 1)
        );
      }
      setSelected(newSelected);
    };

    // const handleChangePage = (event, newPage) => {
    //   setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //   setRowsPerPage(parseInt(event.target.value, 10));
    //   setPage(0);
    // };

    // const handleChangeDense = (event) => {
    //   setDense(event.target.checked);
    // };

    // const emptyRows =
    //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredrows.length) : 0;

    const visibleRows = React.useMemo(
      () => filteredrows.sort(getComparator(order, orderBy)),
      // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
      // [order, orderBy, page, rowsPerPage,filteredrows],
      [order, orderBy, filteredrows]
    );

    return (
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }} style={{ boxShadow: "none" }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={filteredrows.length}
              />

              {/* El DragDropContext debe envolver toda la tabla */}
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <TableBody
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {visibleRows.map((row, index) => {
                        const isItemSelected = selected.includes(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        const enlace = Farmacia === 1 ? linkEco : linkTor;
                        const d = noErrorParse(row.data);
                        const href = d.keywords
                          ? `${enlace}/busqueda/${d.keywords}`
                          : d.link
                          ? d.link
                          : d.link_self
                          ? d.link_self
                          : `${enlace}/busqueda/[banner]${row.id}`;

                          const namebp= row.imagen3 ? row.imagen3.split('/').pop() : null;

                        return (
                          <Draggable
                            key={row.id}
                            draggableId={row.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <TableRow
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                hover
                                onClick={(event) => handleClick(event, row.id)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row.id}
                                selected={isItemSelected}
                                style={{
                                  ...provided.draggableProps.style,
                                  borderRadius: "10px",
                                }}
                              >
                                <StyledTableCell
                                  style={{
                                    borderRight: "1px solid #ddd",
                                    borderLeft: "1px solid #ddd",
                                    borderTop: "1px solid #ddd",
                                    textAlignLast: "center",
                                    background: snapshot.isDragging
                                      ? "white"
                                      : "transparent", // Cambia el fondo según el estado de arrastre
                                  }}
                                >
                                  <ViewCompactIcon />
                                </StyledTableCell>

                                <StyledTableCell
                                  style={{
                                    borderRight: "1px solid #ddd",
                                    borderLeft: "1px solid #ddd",
                                    borderTop: "1px solid #ddd",
                                    width: "3rem",
                                    textAlign: "center",
                                    background: snapshot.isDragging
                                      ? "white"
                                      : "transparent", // Cambia el fondo según el estado de arrastre
                                  }}
                                >
                                  {index + 1}
                                </StyledTableCell>

                                <StyledTableCell
                                  style={{
                                    borderRight: "1px solid #ddd",
                                    borderLeft: "1px solid #ddd",
                                    borderTop: "1px solid #ddd",
                                    padding: "16px",
                                    background: snapshot.isDragging
                                      ? "white"
                                      : "transparent", // Cambia el fondo según el estado de arrastre
                                  }}
                                  component="th"
                                  id={labelId}
                                  scope="row"
                                  padding="none"
                                >
                                  {row.titulo}
                                </StyledTableCell>

                                <StyledTableCell
                                  style={{
                                    borderRight: "1px solid #ddd",
                                    borderLeft: "1px solid #ddd",
                                    borderTop: "1px solid #ddd",
                                    background: snapshot.isDragging
                                      ? "white"
                                      : "transparent", // Cambia el fondo según el estado de arrastre
                                  }}
                                  align="left"
                                >
                                  {(row.imagen3) && (
                                    < ImageCarouselDialog
                                      images={[row.imagen3].filter(Boolean)} // Filtrar imágenes no disponibles
                                      triggerImage={row.imagen3}
                                      imageTexts={[ namebp].filter(Boolean)}
                                      sx={{
                                        cursor: 'pointer',
                                        width: 65,
                                        height: 70,
                                        borderRadius: "8px",
                                        objectFit: "cover", // Recorta la imagen si es más grande
                                        marginRight: 0, // Espacio reducido a 0 entre la imagen y el texto
                                        mx: 2,
                                      }}
                                    />
                                  )}
                                </StyledTableCell>

                                <StyledTableCell
                                  style={{
                                    borderRight: "1px solid #ddd",
                                    borderLeft: "1px solid #ddd",
                                    borderTop: "1px solid #ddd",
                                    background: snapshot.isDragging ? "white" : "transparent",
                                  }}
                                  align="left"
                                >
                                  <Box
                                    component="span"
                                    sx={{
                                      display: "block", // Permite que el contenido se expanda verticalmente
                                      whiteSpace: "normal", // Permite ajuste automático de línea
                                      overflowWrap: "break-word", // Rompe el enlace si es necesario para evitar que se salga del contenedor
                                      wordBreak: "break-word", // Asegura que el enlace se rompa en palabras largas
                                    }}
                                  >
                                    <Link href={href} target="_blank" >
                                      {href}
                                    </Link>
                                  </Box>
                                </StyledTableCell>

                                <StyledTableCell
                                  style={{
                                    borderRight: "1px solid #ddd",
                                    borderLeft: "1px solid #ddd",
                                    borderTop: "1px solid #ddd",
                                    background: snapshot.isDragging
                                      ? "white"
                                      : "transparent", // Cambia el fondo según el estado de arrastre
                                  }}
                                  align="left"
                                >
                                  {formatDate("short", row.fecha_inicio)}
                                </StyledTableCell>

                                <StyledTableCell
                                  style={{
                                    borderRight: "1px solid #ddd",
                                    borderLeft: "1px solid #ddd",
                                    borderTop: "1px solid #ddd",
                                    background: snapshot.isDragging
                                      ? "white"
                                      : "transparent", // Cambia el fondo según el estado de arrastre
                                  }}
                                  align="left"
                                >
                                  {formatDate("short", row.fecha_fin)}
                                </StyledTableCell>

                                <StyledTableCell
                                  style={{
                                    borderRight: "1px solid #ddd",
                                    borderLeft: "1px solid #ddd",
                                    borderTop: "1px solid #ddd",
                                    background: snapshot.isDragging
                                      ? "white"
                                      : "transparent", // Cambia el fondo según el estado de arrastre
                                  }}
                                  align="left"
                                >
                                  <Chip
                                    variant="outlined"
                                    label={row.status}
                                    sx={{
                                      backgroundColor:
                                        estadoColorMap[row.status]
                                          ?.backgroundColor || "default",
                                      color:
                                        estadoColorMap[row.status]?.color ||
                                        "black",
                                    }}
                                  />
                                </StyledTableCell>

                                <StyledTableCell
                                  style={{
                                    borderRight: "1px solid #ddd",
                                    borderLeft: "1px solid #ddd",
                                    borderTop: "1px solid #ddd",
                                    textAlignLast: "center",
                                    background: snapshot.isDragging
                                      ? "white"
                                      : "transparent",
                                  }}
                                >
                                  <ViewCompactIcon />
                                </StyledTableCell>
                              </TableRow>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </TableBody>
                  )}
                </Droppable>
              </DragDropContext>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    );
  }
);

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

  try {
      // Si `data` ya es un objeto, lo retornamos directamente
      if (typeof data === "object") {
          return data;
      }

      // Si `data` es un string, intentamos parsearlo
      const parsedData = JSON.parse(data);

      // Si el resultado es una cadena o "ninguna", retornamos un objeto vacío
      if (typeof parsedData === "string" || parsedData === "ninguna") {
          return {};
      }

      return parsedData; // Retornamos el objeto correctamente parseado

  } catch (e) {
      return {};  // Si `JSON.parse()` falla, retornamos un objeto vacío
  }
};


export { EnhancedPopup, EnhancedPopupToolbar };
