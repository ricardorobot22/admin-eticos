import React, { useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, List, ListItem, Typography, Chip, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from 'axios';

const URL = {
  HOST: 'https://www.droguerialaeconomia.com',
};

// Función para obtener los datos desde la API
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

const CategoryChecklist = ({ selectedItems, setSelectedItems }) => {
  const [jsonData, setJsonData] = useState([]);

  // UseEffect para obtener los datos cuando el componente se monte
  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchData();
      data.shift()
      setJsonData(data);
    };

    getCategories();
  }, []); // El array vacío asegura que la llamada a la API solo ocurra una vez cuando el componente se monte

  const handleCategoryChange = (categoryId, categoryLabel, subcategories) => {
    const allSubcategoryItems = subcategories.map(sub => ({ id: sub.IdSubcategoria, label: sub.Subcategoria }));

    const isSelected = selectedItems.some(item => item.id === categoryId ||
      subcategories.every(sub => selectedItems.some(item => item.id === sub.IdSubcategoria)));

    if (isSelected) {
      setSelectedItems(prev => prev.filter(item => item.id !== categoryId &&
        !allSubcategoryItems.some(sub => sub.id === item.id)));
    } else {
      setSelectedItems(prev => [...prev, { id: categoryId, label: categoryLabel }, ...allSubcategoryItems]);
    }
  };

  const handleSubcategoryChange = (subcategoryId, subcategoryLabel, categoryId, categoryLabel, subcategories) => {
    const isSelected = selectedItems.some((item) => item.id === subcategoryId);

    if (isSelected) {
      // Remover la subcategoría y verificar si es necesario quitar la categoría principal
      setSelectedItems((prev) => {
        const updatedItems = prev.filter((item) => item.id !== subcategoryId);

        // Si la categoría principal está en `selectedItems` y no todas las subcategorías están seleccionadas, remuévela
        const areAllSubcategoriesSelected = subcategories.every((sub) =>
          updatedItems.some((item) => item.id === sub.IdSubcategoria)
        );

        if (!areAllSubcategoriesSelected) {
          return updatedItems.filter((item) => item.id !== categoryId);
        }

        return updatedItems;
      });
    } else {
      // Agregar la subcategoría y verificar si es necesario agregar la categoría principal
      setSelectedItems((prev) => {
        const updatedItems = [...prev, { id: subcategoryId, label: subcategoryLabel }];

        // Si todas las subcategorías están seleccionadas, agrega la categoría principal
        const areAllSubcategoriesSelected = subcategories.every((sub) =>
          updatedItems.some((item) => item.id === sub.IdSubcategoria)
        );

        if (areAllSubcategoriesSelected) {
          return [...updatedItems, { id: categoryId, label: categoryLabel }];
        }

        return updatedItems;
      });
    }
  };

  const isCategorySelected = (subcategories = []) =>
    subcategories.every(sub => selectedItems.some(item => item.id === sub.IdSubcategoria));

  const isCategoryIndeterminate = (subcategories = []) =>
    subcategories.some(sub => selectedItems.some(item => item.id === sub.IdSubcategoria)) &&
    !isCategorySelected(subcategories);

  const handleChecSubCa = (subcategory) => {
    return selectedItems.some(item => item.id === subcategory.IdSubcategoria);
  };

  return (
    <Box>
      {jsonData.map((group) => (
        <Box key={group.IdGrupo} sx={{ marginBottom: "20px" }}>
          <Typography variant="subtitle2" component="div" gutterBottom>
            {group.Grupo}
          </Typography>
          <Grid container spacing={0} alignItems="flex-start">
            {group.Categorias.map((category) => (
              <Grid key={category.IdCategoria}>
                <List>
                  <ListItem>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isCategorySelected(category.Subcategorias)}
                          indeterminate={isCategoryIndeterminate(
                            category.Subcategorias
                          )}
                          onChange={() => handleCategoryChange(category.IdCategoria, category.Categoria, category.Subcategorias)}
                        />
                      }
                      label={category.Categoria}
                    />
                  </ListItem>
                  {category.Subcategorias.map((subcategory) => (
                    <ListItem key={subcategory.IdSubcategoria} sx={{ pl: 4, mt: "-20px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={handleChecSubCa(subcategory)}
                            onChange={() =>
                              handleSubcategoryChange(
                                subcategory.IdSubcategoria,
                                subcategory.Subcategoria,
                                category.IdCategoria,
                                category.Categoria,
                                category.Subcategorias
                              )
                            }
                          />
                        }
                        label={subcategory.Subcategoria}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
      {/* Mostrar los chips seleccionados */}
      <Box>
        {selectedItems.map((item) => (
          <Chip
            key={item.id}
            label={item.label}
            onDelete={() =>
              setSelectedItems((prev) => prev.filter((i) => i.id !== item.id))
            }
          />
        ))}
      </Box>
    </Box>
  );
};

export default CategoryChecklist;
