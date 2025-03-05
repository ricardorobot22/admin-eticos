import  { useReducer } from 'react';

// Estado inicial asegurándose de que todas las claves están definidas
const initialState = {
  products: [],
  keywords: [],
  categories: [],
};

// Reducer para manejar la lógica de agregar y eliminar chips
const chipsReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_CHIP': {
  const { key, value } = action.payload;
 
  const newValues = value.split(/[ ,]+/).map(item => item.trim()) .filter(item => item !== ""); 

  const uniqueValues = newValues.filter(item => !state[key]?.includes(item));

  if (uniqueValues.length === 0) return state; 

  return {
    ...state,
    [key]: [...(state[key] || []), ...uniqueValues]
  };
}
    case 'REMOVE_CHIP': {
      const { key, index } = action.payload;
      return {
        ...state,
        [key]: state[key].filter((_, i) => i !== index),
      };
    }
    default:
      return state;
  }
};

// Hook personalizado para manejar los chips
const useChips = () => {
  const [statetag, dispatch] = useReducer(chipsReducer, initialState);

  const addChip = (key, value) => {
    dispatch({ type: 'ADD_CHIP', payload: { key, value } });
  };

  const removeChip = (key, index) => {
    dispatch({ type: 'REMOVE_CHIP', payload: { key, index } });
  };

  return { statetag, addChip, removeChip };
};

export default useChips;
