import { Navigate } from "react-router-dom";
import { useGlobalContext } from "./globalContext";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const URL = {
  //HOST: 'http://localhost:3001',
  HOST: 'https://www.droguerialaeconomia.com',
};

const RedirectRoute = ({ children }) => {
  const { isAuthenticated, login, logout } = useGlobalContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataCode = async () => {
      const storedToken = localStorage.getItem("token");

      // Verifica si el token no existe
      if (!storedToken) {
        logout();
        setLoading(false);
        return;
      }

      try {
        // Llama a la API para autenticar el token
        const { status } = await axios.post(`${URL.HOST}/gestor/authenticateToken`, { token: storedToken });
        if (status === 200) {
          login();
        } else {
          logout();
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        logout();
      } finally {
        setLoading(false); // Fin del proceso de carga, verificar token completado
      }
    };

    fetchDataCode();
  }, [login, logout]);

  // Si el token aún está siendo verificado, no renderiza nada
  if (loading) return null;

  // Si ya se autentificó, navega a "Campañas", de lo contrario, muestra el componente hijo
  return isAuthenticated ? <Navigate to="/Campañas" /> : children;
};

export default RedirectRoute;
