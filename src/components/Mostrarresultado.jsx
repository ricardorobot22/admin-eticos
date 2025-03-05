import { React, useState ,useEffect} from "react";
import Box from "@mui/material/Box";

import { Chip, Typography, Paper, InputBase,Stack ,Button} from "@mui/material";

import useChips from "./tagchips.jsx"; // El hook que creamos

const Mostrarresultado = ({handleInputChange,formData,setFormData,confirmAlert}) => {
  const { statetag, addChip, removeChip } = useChips();
  const [input, setInput] = useState('');
  

  useEffect(() => {
    if (formData.keywords  && statetag.products.length === 0) {
      const initialProducts = formData.keywords.split(" ");
      initialProducts.forEach((code) => addChip("products", code));
    }
  }, [formData.keywords, addChip]);
 
  const handleAddChip = (key, event) => {
    if (event.key === 'Enter' && input.trim()) {
      addChip(key, input.trim());
      setInput(''); // Limpiar el campo de entrada

      const updatedCodes = [...statetag.products, input.trim()].join(" ");
      setFormData((prevFormData) => ({
        ...prevFormData,
        keywords: updatedCodes,
      }));
    }
  };

  const handleRemoveChip = (key, index) => {
    removeChip(key, index);

    // Actualiza el formData
    const updatedCodes = statetag.products.filter((_, i) => i !== index).join(" ");
    setFormData((prevFormData) => ({
      ...prevFormData,
      keywords: updatedCodes,
    }));
  };

  const handleRemoveAllChips = async () => {
    if (statetag.products && formData.keywords) {
      const confirmed = await confirmAlert("alert", "¿Estás seguro que deseas eliminar todas las palabras clave?");
      if (confirmed) {
        statetag.products = [];
        setFormData((prevFormData) => ({
          ...prevFormData,
          keywords: "",
        }));
      }
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
        Palabras clave
      </Typography>

      <Typography
        color="#667085"
        variant="subtitle1"
        fontSize="12px"
        lineHeight="16px"
        sx={{ mb: "8px" }}
      >
        Estas palabras se asociarán al resultado de la búsqueda del banner
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
            onDelete={() => handleRemoveChip("products", index)}
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
          onKeyUp={(e) => handleAddChip("products", e)}
        />
      </Paper>


      <Stack
        sx={{ mt: "8px", alignSelf: "stretch" ,  justifyContent:"flex-end", alignItems:"center"}}
        spacing={1}
        direction="row"
      
      >
        <Button
          size="small"
          
          
          sx={{ display: "flex", borderRadius: " 100px" ,justifyContent:"center",alignItems:"center"}}
          onClick={handleRemoveAllChips}
        >
       
          Eliminar todas las palabras clave
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

export { Mostrarresultado };
