import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobalContext } from './globalContext.jsx';
import axios from 'axios';

const URL = {
  //HOST: 'http://localhost:3001',
  HOST: 'https://www.droguerialaeconomia.com',
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, login, logout } = useGlobalContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataCode = async () => {
      const storedToken = localStorage.getItem("token");
      
      if (!storedToken) {
        logout();
        setLoading(false);
        return;
      }

      try {
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
        setLoading(false);
      }
    };

    fetchDataCode();
  }, [login, logout]);

  if (loading) return null; // Mostrar un indicador de carga mientras se verifica el token

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
