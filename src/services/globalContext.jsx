import React, { createContext, useContext, useState } from 'react';

// Crear contexto
const GlobalContext = createContext();


// Proveedor de contexto
export const GlobalProvider = ({ children }) => {
  const [Farmacia, setFarmacia] = useState(1); // Valor inicial
  const [token,setToken]=useState("");
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const login = () => setIsAuthenticated(true);
   const logout = () => {
    localStorage.removeItem("token"); // Borra solo el token
    setIsAuthenticated(false); // Actualiza el estado de autenticación
  };

  return (
    <GlobalContext.Provider value={{ Farmacia, setFarmacia ,isAuthenticated, login, logout ,setToken}}>
      {children}
    </GlobalContext.Provider>
  );
};

// Hook para usar el contexto en cualquier componente
export const useGlobalContext = () => useContext(GlobalContext);