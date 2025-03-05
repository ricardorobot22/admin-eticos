import React, { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import Papa from 'papaparse';

const CsvReader = () => {
  const [numbers, setNumbers] = useState([]);

  // Función para manejar el archivo CSV
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: false, // Ya que no necesitas el encabezado
        skipEmptyLines: true, // Saltar las líneas vacías
        complete: function (results) {
          // Filtrar solo la primera columna y obtener números de 6 dígitos
          const extractedNumbers = results.data
            .map((row) => row[0]) // Obtener la primera columna
            .filter((value) => /^[0-9]{6}$/.test(value)); // Filtrar solo números de 6 dígitos

          setNumbers(extractedNumbers);
        },
      });
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Cargar archivo CSV con números de 6 dígitos
      </Typography>
      <Button variant="contained" component="label">
        Subir archivo CSV
        <input
          type="file"
          accept=".csv"
          hidden
          onChange={handleFileChange}
        />
      </Button>

      
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="h6">Números de 6 dígitos encontrados:</Typography>
        {numbers.length > 0 ? (
          <ul>
            {numbers.map((num, index) => (
              <li key={index}>{num}</li>
            ))}
          </ul>
        ) : (
          <Typography variant="body2">No se encontraron números de 6 dígitos.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default CsvReader;
