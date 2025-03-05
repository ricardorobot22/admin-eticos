import {React,useState,useEffect} from 'react'
import Box from '@mui/material/Box';
import Upload from "../assets/Icon-UploadSimple.svg";
import Stack from '@mui/material/Stack';
import { Button, Chip, Typography ,Paper,InputBase} from '@mui/material';
import Papa from 'papaparse';

import useChips from './tagchips.jsx'; // El hook que creamos



const Mostrarproducto = ({handleInputChange,formData,setFormData,handleOpenAlert,confirmAlert}) => {


  const { statetag, addChip, removeChip } = useChips();
  const [input, setInput] = useState('');

 const handleFileChange = (event) => {
  const file = event.target.files[0];

  if (file) {
    // Limpiar los productos actuales antes de procesar el nuevo archivo CSV
    handleRemoveAllChips(); // Asegúrate de llamar a la función que limpia los productos

    Papa.parse(file, {
      header: false, // Ya que no necesitas el encabezado
      skipEmptyLines: true, // Saltar las líneas vacías
      complete: function (results) {
        // Filtrar solo la primera columna y obtener números de 6 dígitos
        const extractedNumbers = results.data.map((row) => row[0]) // Obtener la primera columna
          .filter((value) => /^[0-9]{6}$/.test(value)); // Filtrar solo números de 6 dígitos

   

        let accumulatedCodes = [...statetag.products];
        // Agregar los números como chips
        extractedNumbers.forEach((code) => {
          addChip("products", code); // Agregar el chip al estado de productos
          accumulatedCodes.push(code.trim()); // Acumular el código en el array temporal
        });

        setFormData((prevFormData) => ({
          ...prevFormData,
          codes: accumulatedCodes.join(" "), // Unir los códigos con espacios
        }));

      },
    });
  }
  event.target.value = "";

};

 
  useEffect(() => {
    if (formData.codes && statetag.products.length === 0) {
      const initialProducts = formData.codes.split(" ");
      initialProducts.forEach((code) => addChip("products", code));
    }
  }, [formData.codes, addChip]);
 
  const handleAddChip = (key, event) => {
    if (event.key === 'Enter' && input.trim()) {
      // Divide el input en partes separadas por espacios
      const entries = input.trim().split(/[ ,]+/);
  
      // Filtra solo los valores que tengan exactamente 6 dígitos
      const validEntries = entries.filter((value) => /^[0-9]{6}$/.test(value));
  
      if (validEntries.length > 0) {
        // Agrega cada valor válido como un chip
        validEntries.forEach((code) => {
          addChip(key, code);
        });
  
        // Actualiza el estado de formData.codes
        const updatedCodes = [...statetag.products, ...validEntries].join(" ");
        setFormData((prevFormData) => ({
          ...prevFormData,
          codes: updatedCodes,
        }));
  
        // Limpia el campo de entrada después de agregar los chips
        setInput('');
      } else {
        // Opcional: Muestra un mensaje si no hay entradas válidas
        handleOpenAlert("error","Por favor ingrese solo números de exactamente 6 dígitos separados por espacios o comas.");
      }
    }
  };

  const handleRemoveChip = (key, index) => {
    removeChip(key, index);

    // Actualiza el formData
    const updatedCodes = statetag.products.filter((_, i) => i !== index).join(" ");
    setFormData((prevFormData) => ({
      ...prevFormData,
      codes: updatedCodes,
    }));
  };

  const handleRemoveAllChips = async() => {

    const confirmed = await confirmAlert("alert", "¿Estás seguro que deseas eliminar todos los productos?");
    
    if (confirmed) {

    statetag.products = []; 
    setFormData((prevFormData) => ({
      ...prevFormData,
      codes: "",
    }));
  }
  };


    return (
      <>
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{ borderBottom: 2, borderColor: "divider", m: "16px 0px" }}
          ></Box>
        </Box>



        <Typography fontSize="16px" fontWeight="500" lineHeight="24px">
          Productos asociados
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
          {statetag.products.map((product, index) => (
            <Chip
            key={index}
            label={product}
              onDelete={() =>handleRemoveChip('products', index)}
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
            onKeyUp={(e) => handleAddChip('products', e)}
          />
        </Paper>

        <Stack
        sx={{ mt: "8px", mb:"16px", alignSelf: "stretch" ,  justifyContent:"space-between", alignItems:"center"}}
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
          component="label"
          >        <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileChange}
            />
            <Box
              component="img"
              src={Upload}
              alt="Subir .CSV"
              sx={{ marginRight: 1 }}
            />
            Subir .CSV
          </Button>

        <Button
          size="small"
          
     
          sx={{ display: "flex", borderRadius: " 100px" ,justifyContent:"center",alignItems:"center"}}
          onClick={handleRemoveAllChips}
        >
       
          Eliminar todos los productos
        </Button>
      </Stack>



      <Typography fontSize="16px" fontWeight="500" lineHeight="24px">
          Mensaje del resultado
        </Typography>

        <Typography
          color="#667085"
          variant="subtitle1"
          fontSize="12px"
          lineHeight="16px"
          sx={{ mb: "8px" }}
        >
         Este mensaje se mostrará en el resultado de los productos mostrados
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
          <InputBase sx={{ ml: 1, flex: 1 }} name="titulopublico" value={formData.titulopublico}  onChange={handleInputChange}/>
        </Paper>


    
      </>
    );
};

export {Mostrarproducto} ;