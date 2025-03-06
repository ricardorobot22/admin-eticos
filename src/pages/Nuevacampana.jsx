
import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Chip, Paper, InputBase, Typography, MenuItem, TextField, Button, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import { useReducer, useState, useEffect } from "react";
import { Bannerprincipal } from "../components/Bannerprincipal.jsx";
import { Popup } from "../components/Popup.jsx";
import { Mostrarproducto } from "../components/Mostrarproducto.jsx";
import { Mostrarresultado } from "../components/Mostrarresultado.jsx";
import { Llevarlink } from "../components/llevarlink.jsx";
import useChips from "../components/tagchips.jsx"; // El hook que creamos
import { Categorias } from "../components/categorias.jsx";
import { DatePicker } from '@mui/x-date-pickers';
import Basura from "../assets/Basura.svg";
import Upload from "../assets/Icon-UploadSimple.svg";
import { Previsualizar } from "../components/Previsualizar.jsx";
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Volver from "../assets/Icon-ChevronLeft.svg";


import axios from 'axios';
import moment from "moment";

import { useGlobalContext } from '../services/globalContext.jsx';
import { useNavigate } from "react-router-dom"

import CustomAlertDialog from "../components/CustomAlertDialog";
import { getBannerModel } from '../util/bannerUtils.jsx';

 

import { _fetch,DATASET, IMP } from '../services/core.js';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",

  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const currencies = [
  {
    value: "USD",
    label: "Mostrar conjunto de productos",
  },
  {
    value: "EUR",
    label: "Mostrar resultados de una búsqueda",
  },
  {
    value: "BTC",
    label: "Llevar a un link",
  },
];

function Nuevacampana() {

  const { Farmacia } = useGlobalContext();

  const initialStateFormat = {
    Escritorio: false,
    Mobile: false,
  };

  const reducerFormat = (state, action) => {
    switch (action.type) {
      case "Escritorio":
        return { Escritorio: true, Mobile: false };
      case "Mobile":
        return { Escritorio: false, Mobile: true };
      default:
        return state;
    }
  };

  const [stateFormat, dispatchformat] = useReducer(reducerFormat, initialStateFormat);

  const [selectedBanner, setSelectedBanner] = useState(null);

  const renderDropzone = (image, getRootProps, getInputProps, setImage, imageKey, label, sizeInfo) => (
    <Box
      {...getRootProps()}
      sx={{
        border: "1px solid var(--gray-200-e-4-e-7-ec, #E4E7EC)",
        padding: '8px',
        textAlign: 'center',
        cursor: 'pointer',
        flexWrap: "wrap",
        height: "auto",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        bgcolor: '#FCFCFD',
        borderRadius: "8px",
        position: 'relative',
        maxWidth: '300px', // Limita el ancho máximo del contenedor
        maxHeight: '160px', // Limita la altura máxima del contenedor
        overflow: 'hidden'
      }}
    >
      <input {...getInputProps()} />
      {image ? (
        <>
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Box component="img"
              src={image.preview}
              alt="Preview"
              style={{ width: 'auto', height: 70, marginTop: '8px', borderRadius: "8px" }}
            />
      <IconButton
        onClick={(e) => {
          e.stopPropagation(); // Evita la propagación para no activar la carga
          handleDeleteImg(setImage, imageKey);
        }}
        sx={{
          position: 'absolute',
          top: '8px', // Ajusta la posición del ícono en la esquina superior derecha
          right: '8px',
          bgcolor: '#FCFCFD', // Fondo semitransparente para mejor visibilidad
          borderRadius: '50%', // Forma circular
          padding: '4px', // Espaciado interno
          zIndex: 1, // Asegura que esté sobre la imagen
        }}
      >
        <img src={Basura} alt="Eliminar" />
      </IconButton>
          </Stack>
          <Typography fontSize="14px" fontWeight="400" lineHeight="20px">
            {image.name}
          </Typography>
          <Typography fontSize="12px" fontWeight="400" lineHeight="16px" color="var(--gray-500667085, #667085)">
            {image.size} KB
          </Typography>
        </>
      ) : (
        <>
          <Box component="img" src={Upload} alt="Upload" sx={{ padding: "8px", marginRight: '6px', borderRadius: "264px", background: "var(--primary-background-light-ecf-4-fc, #ECF4FC)" }} />
          <Typography variant="body2"><u>Click para cargar imagen</u> o arrástrala</Typography>
          <Typography fontSize="10px" fontWeight="400" lineHeight="16px" variant="body2">
            {sizeInfo}
          </Typography>
        </>
      )}
    </Box>
  );
  


  const [datePairs, setDatePairs] = useState([{ id: Date.now(), startDate: null, endDate: null }]);

  const handleAddDatePair = () => {
    setDatePairs([...datePairs, { id: Date.now(), startDate: null, endDate: null }]);
  };

  const handleDeleteDatePair = (id) => {
    setDatePairs(datePairs.filter((pair) => pair.id !== id));
  };


  const handleDateChange = (type, newValue) => {
    setFormData({
      ...formData,
      [type]: newValue ? newValue : null, // Si hay una nueva fecha la ponemos, si no null
    });
  };



  const initialStatechild = {
    shchild1: false,
    shchild2: false,
    shchild3: false,
    visibleComponent: null,

  };

  const reducerchild = (state, action) => {
    switch (action.type) {
      case "Banner principal":
        return { ...state, shchild1: !state.shchild1 };
      case "Banner secundario":
        return { ...state, shchild2: !state.shchild2 };
      case "Pop-up":
        return { ...state, shchild3: !state.shchild3 };
      case "SET_VISIBLE_COMPONENT":
        return { ...state, visibleComponent: action.payload }; // Usamos el valor del payload para definir el componente visible
      default:
        return state;
    }
  };


  const [statechild, dispatchchild] = useReducer(reducerchild, initialStatechild);
  

  const [selectedCurrency, setSelectedCurrency] = useState(''); // Valor inicial vacío o un valor por defecto como "USD"

  const [manualSelection, setManualSelection] = useState(false);

  const handleCurrencyChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCurrency(selectedValue); // Actualiza el valor seleccionado
    setManualSelection(true);

    const selectedOption = currencies.find((option) => option.value === selectedValue) || { label: "Mostrar conjunto de productos" };

    if (selectedOption) {

      statetag.products = []; 
      setFormData((prevFormData) => ({
        ...prevFormData,
        codes: "",
        keywords: "",
        link:"",
        link_self:"",
        titulopublico:"" 
      }));

      dispatchchild({ type: "SET_VISIBLE_COMPONENT", payload: selectedOption.label });
    } else {
      console.error('Selected option not found in currencies');
    }
  };

  const ds_banners = new DATASET({
    api_model: getBannerModel(Farmacia),
    scheme: {
      id: null,
      estado: 1,
      data: null,
      imagen: null,
      imagen2: null,
      imagen3: null,
      position: "ninguna",
      titulopublico: null,
      titulo: null,
      fecha_inicio: null,
      fecha_fin: null,
      grupo: null,
    },
    sort: { id: "DESC" },
  });

  const location = useLocation();

  const [formData, setFormData] = useState({
    id: '',
    estado: '',
    grupo: '',
    titulo: '',
    titulopublico: '',
    imagen: null,
    imagen2: null,
    imagen3: null,
    position: '',
    fecha_inicio: null,
    fecha_fin: null,
    data: '',
  });

  dayjs.extend(utc);

  useEffect(() => {
    if (location.state?.banner) {
      const bannerData = location.state.banner;
      setFormData({
        id: bannerData.id || null,
        estado: String(bannerData.estado || ''),
        grupo: String(bannerData.grupo || ''),
        titulo: bannerData.titulo || '',
        titulopublico: bannerData.titulopublico || '',
        imagen: bannerData.imagen || null,
        imagen2: bannerData.imagen2 || null,
        imagen3: bannerData.imagen3 || null,
        position: (bannerData.position && bannerData.position !== 'ninguna') ? JSON.parse(bannerData.position) : "",
        fecha_inicio: bannerData.fecha_inicio ? dayjs.utc(bannerData.fecha_inicio) : null,
        fecha_fin: bannerData.fecha_fin ? dayjs.utc(bannerData.fecha_fin) : null,
        data: bannerData.data || '',
      });
    //console.log(bannerData.fecha_inicio ,bannerData.fecha_fin)
    }
  }, [location.state]);

  const [isFormDataLoaded, setIsFormDataLoaded] = useState(false);

  useEffect(() => {
    if (formData.data) {
      let data;
      try {
          data = typeof formData.data === "string" ? JSON.parse(formData.data) : formData.data;
      } catch (error) {
          console.error("Error al parsear JSON:", error);
          data = {}; // Evita que la aplicación se rompa
      }
    

      setFormData(prevFormData => ({
        ...prevFormData,
        codes: data.codes || "",
        keywords: data.keywords || "",
        brand: data.brand || "",
        link_self: data.link_self || "",
        link: data.link || "",
        banner_cat: data.banner_cat || "",
        banner_sub: data.banner_sub || "",
        banner_keywords: data.banner_keywords || "",
        home_popup: data.home_popup === "1",
        cat_popup: data.cat_popup === "1",
        popup_cat_id: data.popup_cat_id || "",
        popup_subcat_id: data.popup_subcat_id || "",
        search_popup: data.search_popup === "1",
        popup_keywords: data.popup_keywords || "",
        star_popup: data.star_popup === "1",
        order_popup: data.order_popup === "1",
      }));
      setIsFormDataLoaded(true);
    }
 
  }, [formData.data]);

  //console.log(formData)

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertProps, setAlertProps] = useState({
    message: "Operation completed successfully!",
    type: "success",
  });
  const [confirmCallback, setConfirmCallback] = useState(null);
  
  // Manejo de apertura y cierre de alertas
  const handleOpenAlert = (type, message = "", onConfirm) => {
    setAlertProps({
      message: message || (type === "success" ? "Operation completed successfully!" : "An error occurred!"),
      type,
    });
    setAlertOpen(true);
    setConfirmCallback(() => onConfirm);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
    if (confirmCallback) confirmCallback(false); // Ejecutar callback de cancelación
  };
  
  const handleConfirmAlert = () => {
    setAlertOpen(false);
    if (confirmCallback) confirmCallback(true); // Ejecutar callback de confirmación
  };

  const confirmAlert = (type, message) => {
    return new Promise((resolve) => {
      handleOpenAlert(type, message, resolve);
    });
  };
  // Sincronización de ventana nueva con el campo `link`
  const another = Boolean(formData.link);
  const [openInNewWindow, setOpenInNewWindow] = useState(another);
  useEffect(() => {
    setOpenInNewWindow(Boolean(formData.link));
  }, [formData.link]);
  
  const getRequiredFields = () => {
    const baseFields = {
      titulo: "Nombre",
      banner_keywords: "Palabras clave",
      banner_sub: "Categorias",
      fecha_inicio: "Fecha de inicio",
      fecha_fin: "Fecha de finalización",
    };
  
    const dynamicFields = {};
  
    if (statechild.shchild1 === true) {
      dynamicFields.position = "Posicion de banner principal";
      dynamicFields.imagen = "Imagen versión escritorio";
      dynamicFields.imagen2 = "Imagen versión mobile";
    }
  
    if (statechild.shchild3 === true) {
      dynamicFields.imagen3 = "Imagen Pop-up";
    }
  
    if (statechild.visibleComponent === "Mostrar conjunto de productos") {
      dynamicFields.titulopublico = "Mensaje del resultado";
      dynamicFields.codes = "Productos asociados";
    }
  
    if (statechild.visibleComponent === "Mostrar resultados de una búsqueda") {
      dynamicFields.titulopublico = "Mensaje del resultado";
      dynamicFields.keywords = "Palabras clave de acción";
    }
  
    if (statechild.visibleComponent === "Llevar a un link") {
      if (openInNewWindow) {
        dynamicFields.link = "Llevar a un link externo";
      } else {
        dynamicFields.link_self = "Llevar a un link interno";
      }
    }
  
    return { ...baseFields, ...dynamicFields };
  };
  
  // Función de validación utilizando los campos requeridos dinámicos
  const validateFields = () => {
    const requiredFields = getRequiredFields();
  
    for (const [field, fieldName] of Object.entries(requiredFields)) {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        handleOpenAlert("error", `Por favor complete el campo obligatorio: ${fieldName}`);
        return false;
      }
    }
  
    if (statechild.shchild3 === true) {
      if (!formData.home_popup && !formData.cat_popup && !formData.search_popup) {
        handleOpenAlert("error", "Por favor complete al menos un campo de Posición de Pop-up (Home, Categorías, Búsqueda)");
        return false;
      }
    }

   
      if (!statechild.shchild1  && !statechild.shchild3  ) {
        handleOpenAlert("error", "Por favor seleccione al menos un tipo de formato");
        return false;
      }

      if (!statechild.visibleComponent ) {
        handleOpenAlert("error", "Por favor seleccione al menos una accion para el banner");
        return false;
      }
    
  
    return true;
  };
  
  // Manejo de envío de formulario
  const handleSubmit = async () => {
    if (validateFields()) {
      const sendData = {};
      const key = formData.id || "new";
  
      const newKeyword = `[banner]${formData.id}`;

      const updatedData = {
        codes: formData.codes || "",
        keywords: formData.keywords || "",
        brand: formData.brand || "",
        link_self: formData.link_self || "",
        link: formData.link || "",
        banner_cat: formData.banner_cat || "",
        banner_sub: formData.banner_sub || "",
        banner_keywords: (formData.banner_keywords || "").includes(newKeyword)
        ? formData.banner_keywords || ""
        : `${formData.banner_keywords ? formData.banner_keywords + " " : ""}${newKeyword}`,
        home_popup: formData.home_popup ? "1" : "0",
        cat_popup: formData.cat_popup ? "1" : "0",
        popup_cat_id: formData.popup_cat_id || "",
        popup_subcat_id: formData.popup_subcat_id || "",
        search_popup: formData.search_popup ? "1" : "0",
        popup_keywords: formData.popup_keywords || "",
        star_popup: formData.star_popup ? "1" : "0",
        order_popup: formData.order_popup ? "1" : "0",
      };

    
      const filteredData = Object.keys(updatedData).reduce((acc, key) => {
        const value = updatedData[key];
        if (value !== "" && value !== "0") {
          acc[key] = value;
        }
        return acc;
      }, {});
      //console.log(formData)
      //console.log(filteredData)
      sendData[key] = {
        fields: {
          id: String(formData.id || ""),
          estado: String(formData.estado || "1"),
          grupo: String(formData.grupo || ""),
          titulo: formData.titulo,
          titulopublico: formData.titulopublico,
          imagen: formData.imagen,
          imagen2: formData.imagen2,
          imagen3: formData.imagen3,
          position: formData.position && Object.keys(formData.position).length > 0 ? JSON.stringify(formData.position) : "ninguna",
          fecha_inicio: formData.fecha_inicio ? formData.fecha_inicio.format("YYYY-MM-DD") : null,
          fecha_fin: formData.fecha_fin ? formData.fecha_fin.format("YYYY-MM-DD") : null,
          data: JSON.stringify(filteredData),
        },
        filter: {},
      };
  
      if (formData.id) {
        sendData[key]["filter"].id = formData.id;
      }
  
      try {
        const result = await ds_banners.set(sendData);
  
        if (key === "new" && result.new && result.new.insertId) {
          setFormData((prevBanner) => ({
            ...prevBanner,
            id: result.new.insertId,
            banner_keywords:`${prevBanner.banner_keywords ? prevBanner.banner_keywords + " " : ""}[banner]${result.new.insertId}`,
          }));
        }
  
        handleOpenAlert("success", "Banner guardado correctamente.");
       // console.log("Banner guardado:", result);
      const reset = await _fetch("resetcache", {elem:"banners"})
      setTimeout(() => {
        handleCampana();
      }, 3000); 
      } catch (error) {
        handleOpenAlert("error", "Ocurrió un error al guardar el banner.");
        console.error("Error al guardar el banner:", error);
      }
    }
  };
  
  
  

  const [lastPositions, setLastPositions] = useState({
    superior: 0,  // Inicializamos con 0
    inferior: 0,
    categorias:0,
    busquedas:0,

  });

  const [isLastPositionsLoaded, setIsLastPositionsLoaded] = useState(false);

  useEffect(() => {
    const fetchBannersAndPositions = async () => {
      try {
        const bannersData = await ds_banners.get({ filter: { estado: 1 }, paging: { limit: 100 } });
        const bannersArray = bannersData.default || [];
  
        const calculatedPositions = {
          superior: getLastPositionInGroup(bannersArray, 'superior'),
          inferior: getLastPositionInGroup(bannersArray, 'inferior'),
          categorias: getLastPositionInGroup(bannersArray, 'categorias'),
          busquedas: getLastPositionInGroup(bannersArray, 'busquedas'),
        };
  
        setLastPositions(calculatedPositions);
        setIsLastPositionsLoaded(true); // Marcar lastPositions como cargado
      } catch (error) {
        console.error("Error fetching banners and positions:", error);
      }
    };
  
    fetchBannersAndPositions();
  }, [Farmacia]);
   
  const getLastPositionInGroup = (banners, group) => {
    const groupBanners = banners.filter(banner => {
      const positionData = noErrorParse(banner.position);  // Aplicamos la función para parsear el campo position
      return positionData && positionData[group] !== undefined;
    });
  
    const lastPosition = groupBanners.reduce((maxPos, banner) => {
      const positionData = noErrorParse(banner.position);  // Asegurarnos de tener los datos parseados
      const pos = positionData[group];
      return pos > maxPos ? pos : maxPos;
    }, -1); // Empezamos en -1 porque la primera posición sería 0
  
    return lastPosition + 1;  // Retorna la siguiente posición disponible
  };

  const initialState = {
    selectedFormatIndex: [],
    selectedBPIndex: [],
    selectedBSIndex: [],
    selectedPopIndex: [],
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "SELECT_FORMAT": {
        const isSelected = state.selectedFormatIndex.includes(action.index);

        if(isSelected && action.index === 0 ){
        setFormData((prevFormData) => ({
          ...prevFormData,
          position: {},
        }));
      }

      if(isSelected && action.index === 2 ){
      setFormData((prevFormData) => ({
        ...prevFormData,
        home_popup: false,
        cat_popup: false,
        search_popup: false,
      }));
    }


        return {
          ...state,
          selectedFormatIndex: isSelected
            ? state.selectedFormatIndex.filter((i) => i !== action.index) // Deselect
            : [...state.selectedFormatIndex, action.index], // 
            
            ...(isSelected && action.index === 0 && { selectedBPIndex: [] }),
            ...(isSelected && action.index === 1 && { selectedPopIndex: [] }),
        };
      }
      // case "CLEAR_BP_SELECTION":
      //   return { ...state, selectedBPIndex: [] };
      // case "CLEAR_BS_SELECTION":
      //   return { ...state, selectedBSIndex: [] };
      // case "CLEAR_POP_SELECTION":
      //   return { ...state, selectedPopIndex: [] };
      case "SELECT_BP": {
        const isSelected = state.selectedBPIndex.includes(action.index);
        
        let updatedPosition = { ...formData.position };

        if (action.index === 0) {
          if (isSelected) {
            delete updatedPosition.superior;
          } else {
            if (updatedPosition.superior === undefined) {
              updatedPosition.superior = lastPositions.superior;
            }
          }
        } if (action.index === 1) {
          if (isSelected) {
            delete updatedPosition.inferior;
          } else {
            if (updatedPosition.inferior === undefined) {
              updatedPosition.inferior = lastPositions.inferior;
            }
          }
        }
        if (updatedPosition.categorias === undefined) {
         updatedPosition.categorias = lastPositions.categorias;
        }
        if (updatedPosition.busquedas === undefined) {
         updatedPosition.busquedas = lastPositions.busquedas;
        }
        setFormData((prevFormData) => ({
          ...prevFormData,
          position: updatedPosition,
        }));

        return {
          ...state,
          selectedBPIndex: isSelected
            ? state.selectedBPIndex.filter((i) => i !== action.index)
            : [...state.selectedBPIndex, action.index],
        };
      }
      case "SELECT_BS": {
        const isSelected = state.selectedBSIndex.includes(action.index);
        return {
          ...state,
          selectedBSIndex: isSelected
            ? state.selectedBSIndex.filter((i) => i !== action.index)
            : [...state.selectedBSIndex, action.index],
        };
      }
      case "SELECT_POP": {
        const isSelected = state.selectedPopIndex.includes(action.index);

        let UpHomePopup = formData.home_popup;   // Inicializar con el valor actual
        let UpCatPopup = formData.cat_popup;     // Inicializar con el valor actual
        let UpSearchPopup = formData.search_popup; // Inicializar con el valor actual

        if (action.index === 0) {
          UpHomePopup = !isSelected;
        } else if (action.index === 1) {
          UpCatPopup = !isSelected;
        } else if (action.index === 3) {
          UpSearchPopup = !isSelected;
        }

        setFormData((prevFormData) => ({
          ...prevFormData,
          home_popup: UpHomePopup,
          cat_popup: UpCatPopup,
          search_popup: UpSearchPopup,
        }));

        return {
          ...state,
          selectedPopIndex: isSelected
            ? state.selectedPopIndex.filter((i) => i !== action.index)
            : [...state.selectedPopIndex, action.index],
        };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log(state)
  const handleFormatListItemClick = (index) => {
    dispatch({ type: "SELECT_FORMAT", index });

  };

  const handleBPListItemClick = (index) => {
    dispatch({ type: "SELECT_BP", index });
  };

  // const handleBSListItemClick = (index) => {
  //   dispatch({ type: "SELECT_BS", index });
  // };

      const handlePopListItemClick = (index) => {
    dispatch({ type: "SELECT_POP", index });
      }




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();
  const [image3, setImage3] = useState();

  useEffect(() => {
    // Actualizar las imágenes si están en formData
    if (formData.imagen &&  formData.imagen !== null ) {
      setImage1((prevImage1) => ({
        preview: formData.imagen,
        name: formData.imagen.split('/').pop(),
        size: prevImage1?.size || null, // Mantener el tamaño actual si existe
      }));
    }

    if (formData.imagen2 && formData.imagen2 !== null) {
      setImage2((prevImage2) => ({
        preview: formData.imagen2,
        name: formData.imagen2.split('/').pop(),
        size: prevImage2?.size || null, // Mantener el tamaño actual si existe
      }));
    }

    if (formData.imagen3 && formData.imagen3 !== null) {
      setImage3((prevImage3) => ({
        preview: formData.imagen3,
        name: formData.imagen3.split('/').pop(),
        size: prevImage3?.size || null, // Mantener el tamaño actual si existe
      }));
    }


  }, [formData.imagen, formData.imagen2, formData.imagen3]);


  useEffect(() => {
    if (isLastPositionsLoaded && isFormDataLoaded) {
      if ((formData.imagen && formData.imagen !== null) || (formData.imagen2 && formData.imagen2 !== null)) {
        handleFormatListItemClick(0);
        dispatchchild({ type: "Banner principal" });
      }
  
      if (formData.position?.superior !== undefined) {
        handleBPListItemClick(0); // Precargar "Superior"
      }
      if (formData.position?.inferior !== undefined) {
        handleBPListItemClick(1); // Precargar "Inferior"
      }
  
      if (formData.imagen3 && formData.imagen3 !== null) {
        handleFormatListItemClick(1); // Marcar como Pop-up
        dispatchchild({ type: "Pop-up" });
      }
      if (formData.home_popup === true) {
        handlePopListItemClick(0); 
      }
      if (formData.cat_popup === true) {
        handlePopListItemClick(1);
        handlePopListItemClick(2);
      }
      if (formData.search_popup === true) {
        handlePopListItemClick(3);
      }
      
    }
    dispatchformat({ type: "Escritorio" });
  }, [isLastPositionsLoaded, isFormDataLoaded]);


  useEffect(() => {
    if (!manualSelection) {
      if (formData.link_self || formData.link) {
        setSelectedCurrency("BTC"); // Cambiar a "Llevar a un link"
        dispatchchild({
          type: "SET_VISIBLE_COMPONENT",
          payload: "Llevar a un link",
        });
      } else if (formData.codes) {
        setSelectedCurrency("USD"); // Cambiar a "Mostrar conjunto de productos"
        dispatchchild({
          type: "SET_VISIBLE_COMPONENT",
          payload: "Mostrar conjunto de productos",
        });
      } else if (formData.banner_keywords) {
        setSelectedCurrency("EUR"); // Cambiar a "Mostrar resultados de una búsqueda"
        dispatchchild({
          type: "SET_VISIBLE_COMPONENT",
          payload: "Mostrar resultados de una búsqueda",
        });
      }
    }
  }, [formData.link_self, formData.link, formData.codes, formData.banner_keywords, manualSelection]);



  const handleDeleteImg = (setImage, imageKey) => {
    setImage(null);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [imageKey]: null, // Actualizamos la imagen correspondiente (image1, image2, image3)
    }));

  };

  const uploadImage = async (file, imageKey, setImage) => {   // funcion usada para subir las imagenes
    const formData = new FormData();
    formData.append('attachment', file); // Agregar el archivo al formData

    const Enlace = "https://www.droguerialaeconomia.com/upload"
    try {
      const response = await fetch(Enlace, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {

        setFormData((prevFormData) => ({
          ...prevFormData,
          [imageKey]: result.fileName,
        }));

        setImage({
          preview: result.fileName, 
          file,
          name: file.name,
          size: (file.size / 1024).toFixed(2),
        });
      } else {
        alert(result.error || 'Error subiendo archivo');
      }
    } catch (error) {
      console.error('Error subiendo archivo:', error);
    }
  };

  const { statetag, addChip, removeChip } = useChips();
  const [input, setInput] = useState('');

  const [jsonData, setJsonData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [chips, setChips] = useState([]);

  useEffect(() => {

    const URL = {
      HOST: 'https://www.droguerialaeconomia.com',
    }
    const fetchData = async () => {
      try {
        const { data } = await axios.post(`${URL.HOST}/api/categorias/`, { "marca": "ECO" });
        return noErrorParse(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
        return [];
      }
    };
    const noErrorParse = (data) => data.success ? data.data : [];

    const getCategories = async () => {
      const data = await fetchData();
      setJsonData(data);
    };

    getCategories();
  }, []);

  useEffect(() => {    //si el formulario tiene info, la aplica en los chips y selecciones
    if (formData.banner_cat || formData.banner_sub) {
      const initialBannerCat = formData.banner_cat && formData.banner_cat !== "" ? formData.banner_cat.split(" ") : [];
      const initialBannerSubCat = formData.banner_sub && formData.banner_sub !== "" ? formData.banner_sub.split(" ") : [];

      const initialSelectedIds = [...initialBannerCat, ...initialBannerSubCat];

      const selectedChips = initialSelectedIds.map(id => {
        for (const group of jsonData) {
          for (const category of group.Categorias) {
            if (category.IdCategoria === id) {
              return { id: category.IdCategoria, label: category.Categoria };
            }
            const subcategory = category.Subcategorias.find(sub => sub.IdSubcategoria === id);
            if (subcategory) {
              return { id: subcategory.IdSubcategoria, label: subcategory.Subcategoria };
            }
          }
        }
        return null;
      }).filter(Boolean);

      setSelectedItems(selectedChips);
      setChips(selectedChips);
    }
  }, [jsonData]);


  const handleCreateChips = () => {

    setChips(selectedItems);
    const updatedcats = selectedItems.map(item => item.id).filter((value) => /^[0-9]{5}$/.test(value));
    const updatedsubs = selectedItems.map(item => item.id).filter((value) => /^[0-9]{7}$/.test(value));
    setFormData((prevFormData) => ({
      ...prevFormData,
      banner_cat: updatedcats.join(" "),
      banner_sub: updatedsubs.join(" ")
    }));

  };

  const handleclearChips = async () => {
    if (chips && (formData.banner_cat || formData.banner_sub)) {
      const confirmed = await confirmAlert("alert", "¿Estás seguro que deseas eliminar todas las categorias?");

      if (confirmed) {
        setChips([]);
        setFormData((prevFormData) => ({
          ...prevFormData,
          banner_cat: "", // Limpiar también 'codes' en formData
          banner_sub: "",
        }));
      }
    }
  };

  const handleDeleteChip = (chipId) => {     //

    setChips((prevChips) => prevChips.filter((chip) => chip.id !== chipId));

    setFormData((prevFormData) => {
      let updatedCodes;

      if (/^[0-9]{5}$/.test(chipId.toString())) {

        updatedCodes = prevFormData.banner_cat.split(' ').filter((code) => code !== chipId).join(' ');
        return {
          ...prevFormData,
          banner_cat: updatedCodes,
        };

      } else if (/^[0-9]{7}$/.test(chipId.toString())) {

        updatedCodes = prevFormData.banner_sub.split(" ").filter((code) => code !== chipId).join(' ');
        return {
          ...prevFormData,
          banner_sub: updatedCodes,
        };

      } else {

        return prevFormData;
      }
    });
  };


  useEffect(() => {
    if (formData.banner_keywords && statetag.keywords.length === 0) { // Solo si no hay chips en statetag.keywords
      const initialProducts = formData.banner_keywords.split(" ");
      initialProducts.forEach((code) => addChip("keywords", code));
    }
  }, [formData.banner_keywords, addChip, statetag.keywords]);

  const handleAddChip = (key, event) => {
    if (event.key === 'Enter' && input.trim()) {
      addChip(key, input.trim());
      setInput('');

      const updatedCodes = [...statetag.keywords, input.trim()].join(" ");
      setFormData((prevFormData) => ({
        ...prevFormData,
        banner_keywords: updatedCodes,
       
      }));
    }
  };

  const handleRemoveChip = (key, index) => {

    removeChip(key, index);
    const updatedCodes = statetag.keywords.filter((_, i) => i !== index).join(" ");
    setFormData((prevFormData) => ({ ...prevFormData,  banner_keywords: updatedCodes, }));
  };

 
  const handleRemoveAllChips = async () => {
    if(formData.banner_keywords && statetag.keywords){
    const confirmed = await confirmAlert("alert", "¿Estás seguro que deseas eliminar todas las palabras clave?");
    
    if (confirmed) {
      setFormData((prevFormData) => ({...prevFormData, banner_keywords: "", }));
      statetag.keywords = [];
    }
  }
  };



  const getTitle = () => {
    switch (location.pathname) {
      case '/Nueva_Campa%C3%B1a':
        return (
          <h1>Nueva campaña</h1>
        );
      case '/Editar_Campa%C3%B1a':
        return (
          <Button variant="text"
          onClick={handleCampana}>
                <Box
                    component="img"
                    src={Volver}
                    alt="Añadir categoria"
                    sx={{ marginRight: 1 }}
                  />
            <Typography
              fontSize="14px"
              fontWeight="500"
              lineHeight="20px"
              color="var(--primary-default-1-c-58-b-7, #1C58B7)"
            >
              Volver a general
            </Typography>
          </Button>
        );
      default:
        return 'Campaña';
    }
  };

  const handleCampana = () => {      
    navigate('/Campañas');     
  };

  const navigate = useNavigate(); 


  return (
    <>
      <Stack
        spacing={1}
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <>{getTitle()}</>
      </Stack>

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          borderRadius: " 8px",
          mt: "24px",
        }}
      >
        <Box sx={{ width: "45%" }}>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid size={12}>
              <Item>
                <Box
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    mt: "10px",
                    mb: "10px",
                    mx: "24px",
                  }}
                >
                  <Typography
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="24px"
                    mb="6px"
                  >
                    Nombre
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
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      inputProps={{ "aria-label": "search google maps" }}
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                    />
                  </Paper>
                </Box>
              </Item>
            </Grid>

            <Grid size={12}>
              <Item>
                <Box
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    mt: "10px",
                    mb: "10px",
                    mx: "24px",
                  }}
                >
                  <Typography
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="24px"
                    mb="6px"
                  >
                    Selecciona el tipo de formato
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    {["Banner principal", "Pop-up"].map(
                      (text, index) => (
                        <Chip
                          key={index}
                          label={text}
                          variant="filled"
                          onClick={() => {
                            handleFormatListItemClick(index);
                            dispatchchild({ type: text });
                          }}
                          sx={{
                            backgroundColor: state.selectedFormatIndex.includes(
                              index
                            )
                              ? "#1C58B7"
                              : "#ECF4FC",
                            color: state.selectedFormatIndex.includes(index)
                              ? "#FCFCFD"
                              : "#1C58B7",
                            "&:hover": {
                              backgroundColor:
                                state.selectedFormatIndex.includes(index)
                                  ? "#1C58B7"
                                  : "#ECF4FC",
                              color: state.selectedFormatIndex.includes(index)
                                ? "#101828"
                                : "#101828",
                            },
                          }}
                        />
                      )
                    )}
                  </Stack>

                  {statechild.shchild1 && (
                    <Bannerprincipal
                      formData={formData}
                      uploadImage={uploadImage}
                      renderDropzone={renderDropzone}
                      image1={image1}
                      setImage1={setImage1}
                      image2={image2}
                      setImage2={setImage2}
                      state={state}
                      dispatch={dispatch}
                      handleOpenAlert={handleOpenAlert}
                      setSelectedBanner={setSelectedBanner}

                    />
                  )}

                  {/* {state.shchild2 && <Child2 />} */}

                  {statechild.shchild3 && (
                    <Popup
                      formData={formData}
                      uploadImage={uploadImage}
                      state={state}
                      renderDropzone={(image, getRootProps, getInputProps, setImage, imageKey) =>
                        renderDropzone(image, getRootProps, getInputProps, setImage, imageKey, "Versión Pop-up", "Tamaño: 465 x 656px. Soporta PNG y JPG con peso máximo de 1MB")
                      }
                      image3={image3}
                      setImage3={setImage3}
                      dispatch={dispatch}
                      handleOpenAlert={handleOpenAlert}
                      setSelectedBanner={setSelectedBanner}
                    />
                  )}
                </Box>
              </Item>
            </Grid>
            <Grid size={12}>
              <Item>
                <Box
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    mt: "10px",
                    mb: "10px",
                    mx: "24px",
                  }}
                >
                  <Typography
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="24px"
                  >
                    Acción
                  </Typography>

                  <Typography
                    color="#667085"
                    variant="subtitle1"
                    fontSize="12px"
                    lineHeight="16px"
                    sx={{ mb: "8px" }}
                  >
                    Selecciona que pasará cuando den click en el banner
                  </Typography>

                  <TextField
                    select
                    fullWidth
                    id="fullWidth"
                    value={selectedCurrency}
                    onChange={handleCurrencyChange}
                  >
                    {currencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  {statechild.visibleComponent ===
                    "Mostrar conjunto de productos" && (
                      <Mostrarproducto
                        handleInputChange={handleInputChange}
                        formData={formData}
                        setFormData={setFormData}
                        handleOpenAlert={handleOpenAlert}
                        confirmAlert={confirmAlert}
                      />
                    )}

                  {statechild.visibleComponent ===
                    "Mostrar resultados de una búsqueda" && (
                      <Mostrarresultado
                        handleInputChange={handleInputChange}
                        formData={formData}
                        setFormData={setFormData}
                        confirmAlert={confirmAlert}
                      />
                    )}

                  {statechild.visibleComponent === "Llevar a un link" && (
                    <Llevarlink
                      handleInputChange={handleInputChange}
                      formData={formData}
                      openInNewWindow={openInNewWindow}
                      setOpenInNewWindow={setOpenInNewWindow}
                    />
                  )}
                </Box>
              </Item>
            </Grid>
            <Grid size={12}>
              <Item>
                <Box
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    mt: "10px",
                    mb: "10px",
                    mx: "24px",
                  }}
                >
                  <Typography
                    fontSize="16px"
                    fontWeight="500"
                    lineHeight="24px"
                  >
                    Palabras clave
                  </Typography>

                  <Typography
                    color="#667085"
                    variant="subtitle1"
                    fontSize="12px"
                    lineHeight="16px"
                    sx={{ mb: "8px" }}
                  >
                    Las palabras clave activarán la visualización de este banner
                    en los resultados de búsqueda
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
                    {statetag.keywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        onDelete={() => handleRemoveChip("keywords", index)}
                        sx={{
                          color: "#FCFCFD",
                          bgcolor: "#667085",
                          borderColor: "#5881C3",
                          margin: "4px", // Añadir un margen entre los chips
                        }}
                      />
                    ))}
                    <InputBase
                      sx={{ ml: 1, flex: "1 1 100%" }} // Ocupa todo el ancho de la fila
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyUp={(e) => handleAddChip("keywords", e)}
                    />
                  </Paper>

                  <Stack
                    sx={{
                      mt: "8px",
                      alignSelf: "stretch",
                      justifyContent:"flex-end",
                      alignItems: "center",
                    }}
                    spacing={1}
                    direction="row"
                  >
                    <Button
                      size="small"
                      sx={{
                        display: "flex",
                        borderRadius: " 100px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onClick={handleRemoveAllChips}
                    >
                      Eliminar todas las palabras clave
                    </Button>
                  </Stack>

                  <Categorias
                    chips={chips}
                    handleCreateChips={handleCreateChips}
                    handleclearChips={handleclearChips}
                    handleDeleteChip={handleDeleteChip}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                  />
                </Box>
              </Item>
            </Grid>

            <Grid size={12}>
              <Item>
                {datePairs.map((pair) => (
                  <Stack
                    key={pair.id}
                    sx={{
                      mx: "24px",
                      mt: "16px",
                      mb: "8px",
                      alignSelf: "stretch",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    spacing={1}
                    direction="row"
                  >
                    <Box>
                      <Typography
                        fontSize="16px"
                        fontWeight="500"
                        lineHeight="24px"
                        sx={{ mb: "6px" }}
                      >
                        Fecha de inicio
                      </Typography>
                      <DatePicker
                        value={formData.fecha_inicio}
                        onChange={(newStart) =>
                          handleDateChange("fecha_inicio", newStart)
                        }
                      >
                        <TextField />
                      </DatePicker>
                    </Box>

                    <Box>
                      <Typography
                        fontSize="16px"
                        fontWeight="500"
                        lineHeight="24px"
                        sx={{ mb: "6px" }}
                      >
                        Fecha de finalización
                      </Typography>
                      <DatePicker
                        value={formData.fecha_fin}
                        onChange={(newEnd) =>
                          handleDateChange("fecha_fin", newEnd)
                        }
                      >
                        <TextField />
                      </DatePicker>
                    </Box>

                    <Box>
                      <IconButton
                        onClick={() => handleDeleteDatePair(pair.id)}
                        sx={{ alignSelf: "flex-start" }}
                      >
                        <img src={Basura} alt="Basura" />
                      </IconButton>
                    </Box>
                  </Stack>
                ))}

                <Stack
                  sx={{
                    mx: "24px",
                    mb: "16px",
                    alignSelf: "stretch",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  spacing={1}
                  direction="row"
                >
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      display: "flex",
                      borderRadius: "100px",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={handleAddDatePair}
                  >
                    Añadir fecha
                  </Button>
                </Stack>
              </Item>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: "flex", flexGrow: 1, mt: "8", mx: "24px" }}>
          {(statechild.shchild1 ||
            statechild.shchild2 ||
            statechild.shchild3) && (
              <Previsualizar
                image1={image1}
                image2={image2}
                image3={image3}
                state={state}
                stateFormat={stateFormat}
                dispatchformat={dispatchformat}
                selectedBanner={selectedBanner}
                setSelectedBanner={setSelectedBanner}
              />
            )}
        </Box>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: "16px" }}>

        <Button
          variant="outlined"
          onClick={handleCampana}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            padding: " 12px 24px",
            display: "flex",
            borderRadius: " 100px",

          }}

        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          sx={{
            justifyContent: "center",
            alignItems: "center",
            padding: " 12px 24px",
            display: "flex",
            borderRadius: " 100px",
            bgcolor: "#1C58B7",
          }}
          onClick={handleSubmit}
        >
          Publicar
        </Button>





      </Stack>


      <CustomAlertDialog
        open={alertOpen}
        onClose={handleCloseAlert}
        onContinue={handleConfirmAlert}
        message={alertProps.message}
        type={alertProps.type}
      />
    </>
  );
}

const noErrorParse = (data) => {
  if (!data || data === "") return {};

  let parsedData = {};

  try {
    // Intenta parsear los datos
    parsedData = JSON.parse(data);

    // Verificamos si el resultado es una cadena en lugar de un objeto
    if (typeof parsedData === 'string' || parsedData === 'ninguna') {
      console.warn("Se detectó una cadena inválida, devolviendo un objeto vacío:", parsedData);
      return {};  // Devolver un objeto vacío si es una cadena no deseada
    }

  } catch (e) {
    console.error("Error al parsear los datos:", e, data);
    return {};  // Si falla el parseo, devolvemos un objeto vacío
  }

  return parsedData;
};

export { Nuevacampana };


