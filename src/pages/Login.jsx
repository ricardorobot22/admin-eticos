import React, { useState } from "react";
import { Box, Stack, TextField, Typography, Button, Link, Slide, CircularProgress } from "@mui/material";
import Loginicon from "../assets/Web_Mockup_23.png";
import LogoEticos from "../assets/Icon-Eticos.svg";
import LogoMooba from "../assets/Isolation_Mode.svg";
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from "../services/globalContext.jsx";
import CustomAlert from '../components/Alert.jsx';
import axios from 'axios';


const URL = {
  //HOST: 'http://localhost:3001',
  HOST: 'https://www.droguerialaeconomia.com',
}

const Login = () => {

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertProps, setAlertProps] = useState({
    show: false,
    mode: 'OK',
    msg1: '',
    msg2: '',
  });

  const showAlert = React.useCallback((mode, msg1, msg2) => {
    setAlertProps({ show: true, mode, msg1, msg2 });
    setAlertOpen(true);
 }, []);

  const handleCloseAlert = () => {
    setAlertOpen(false);
    setAlertProps({ show: false, mode: '', msg1: '', msg2: '' });
 };

  const [email, setEmail] = useState(""); // Email del usuario
  const [emailError, setEmailError] = useState(""); // Mensaje de error para el correo
  const [enteredCode, setEnteredCode] = useState(""); // Código ingresado por el usuario
  

 
  const [step, setStep] = useState(0); // Controla el paso actual
  const [slideDirection, setSlideDirection] = useState("right"); // Controla la dirección del slide



  const { login,setToken } = useGlobalContext();
  const navigate = useNavigate();

 
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Ejemplo: código de 6 dígitos
  };

  const validateEmail = () => {
    if (!email) {
      setEmailError("El campo de correo no puede estar vacío.");
      return false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Por favor, ingresa un correo válido.");
      return false;
    }
    setEmailError("");
    return true;
  };


  // Simula el envío de un código al correo
  const handleSendCode = async() => {

    if (!validateEmail()) return;

    const fetchDataEmail = async () => {
      try {
        const { data, status } = await axios.post(`${URL.HOST}/gestor/login`, { email:`${email}` });
    
        if (status === 200) {
          showAlert('OK', 'Éxito', 'Solicitud enviada correctamente.')
          setSlideDirection("right");
          setStep(1);
          setTimeout(() => {
            setStep(2); // Después de 2 segundos, cambia al paso de ingreso de código
          }, 2000); 
          return data; // Devuelve los datos en caso de éxito
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          showAlert('ERROR', 'Error', 'Correo no encontrado.')

        } else {
          showAlert('ERROR', 'Error', 'Ocurrió un error inesperado.')
        }
        console.error("Error fetching data: ", error);
        return [];
      }
    };
    
    fetchDataEmail();

  };



  // Verifica si el código ingresado coincide con el código enviado
  const handleVerifyCode = () => {
    const getToken = async () => {
      try {
        // Llamada a la API
        const { data } = await axios.post(`${URL.HOST}/gestor/verify-code`, { code: enteredCode });

        if (data) {
          showAlert('OK', 'Éxito', 'Código correcto. Verificación exitosa');
      
          setToken(data); // Guarda el token en el estado
          localStorage.setItem("token", data.token); // Guarda el token en localStorage
       
          // Después de 2 segundos, llama a handleLogin
          
        //  setTimeout(() => {
        //     handleLogin();
        //   }, 2000); 
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        showAlert('ERROR', 'Error', 'Código incorrecto. Inténtalo de nuevo.');
      }
    };

    getToken(); // Ejecuta la función getToken una sola vez
  };
  

  const handleLogin = () => {
    login(); // Cambia el estado a autenticado
    navigate('/Campañas'); // Redirige a la página principal o cualquier otra página protegida
  };

  const handleBack = () => {
    setSlideDirection("left"); // Cuando retrocedemos, el slide entra desde la derecha
    setStep(0); // Vuelve directamente al primer paso
  };

  return (
    <Stack direction="row" sx={{ width: "100vw", height: "100vh" }}>
      {/* Sección izquierda con imagen de fondo */}
      <Box
        sx={{
          width: "50vw",
          height: "100vh",
          backgroundImage: `url(${Loginicon})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: { xs: "none", sm: "block" } 
        }}
      />

      {/* Sección derecha con el formulario de login */}
      <Stack
        direction="column"
        sx={{
          width: { xs: "100vw", sm: "50vw" },
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f6f8",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Contenedor para el contenido central con margen para el pie de página */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            mb: 6, // margen inferior para el pie de página
          }}
        >
          {/* Paso 0: Solicitar el email */}
          <Slide direction={slideDirection} in={step === 0} mountOnEnter unmountOnExit>
            <Box
              sx={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                component="img"
                src={LogoEticos}
                alt="Logo Eticos"
                sx={{ width: "290.434px", height: "56.857px", mb: "48px" }}
              />
              <Box sx={{ width: "80%", maxWidth: "300px", mb: "24px" }}>
                <Typography textAlign="center" variant="h6" gutterBottom fontWeight="bold">
                  Iniciar sesión en el Administrador de contenido
                </Typography>
              </Box>

              <Box
                sx={{
                  width: "80%",
                  maxWidth: "400px",
                  p: 4,
                  borderRadius: 2,
                  boxShadow: 3,
                  backgroundColor: "white",
                }}
              >
                <Typography textAlign="flex-start" fontWeight="500">
                  Correo electrónico
                  <TextField 
                    variant="outlined" 
                    fullWidth 
                    margin="none" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    onBlur={validateEmail} // Verifica el correo cuando pierde el foco
                    error={!!emailError} // Muestra el campo en rojo si hay error
                    helperText={emailError} // Muestra el mensaje de error
                  />
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSendCode}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "12px 24px",
                    display: "flex",
                    borderRadius: "100px",
                    bgcolor: "#1C58B7",
                    mt: 2,
                  }}
                >
                  Solicitar acceso
                </Button>
              </Box>
            </Box>
          </Slide>

          {/* Paso 1: Indicador de carga mientras se envía el código */}
          <Slide direction={slideDirection} in={step === 1} mountOnEnter unmountOnExit>
            <Box
              sx={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <CircularProgress size="120px" />
              <Typography textAlign="center" fontWeight="500" fontSize="18px" lineHeight="24px" sx={{ mt: "20px" }}>
                Enviando código...
              </Typography>
            </Box>
          </Slide>

          {/* Paso 2: Ingresar el código de verificación */}
          <Slide direction="left" in={step === 2} mountOnEnter unmountOnExit>
            <Box
              sx={{
                position: "absolute",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: "80%",
                  maxWidth: "372px",
                  p: "24px",
                  borderRadius: 2,
                  boxShadow: 3,
                  backgroundColor: "white",
                }}
              >
                <Typography textAlign="flex-start" fontWeight="400" fontSize="18px" lineHeight="24px">
                  Ingresa
                </Typography>

                <Typography
                  textAlign="flex-start"
                  fontWeight="700"
                  fontSize="24px"
                  lineHeight="32px"
                  sx={{ mb: "8px" }}
                >
                  código de verificación
                </Typography>

                <Typography
                  color="var(--gray-600344054, #344054)"
                  textAlign="flex-start"
                  fontWeight="500"
                  fontSize="14px"
                  lineHeight="20px"
                  sx={{ mt: "8px", mb: "8px" }}
                >
                  Hemos enviado a su correo electrónico {email} un código de verificación para ingresar.
                </Typography>

                <Typography
                  color="var(--gray-600344054, #344054)"
                  textAlign="flex-start"
                  fontWeight="400"
                  fontSize="12px"
                  lineHeight="16px"
                >
                  Revisa tu carpeta de spam y promociones si no aparece en tu bandeja de entrada principal.
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: "16px",
                  width: "80%",
                  maxWidth: "372px",
                  p: 4,
                  borderRadius: 2,
                  boxShadow: 3,
                  backgroundColor: "white",
                }}
              >
                <Typography textAlign="flex-start" fontWeight="500">
                  Código de verificación
                  <TextField 
                    variant="outlined" 
                    fullWidth 
                    margin="none" 
                    value={enteredCode} 
                    onChange={(e) => setEnteredCode(e.target.value)} 
                  />
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleVerifyCode}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "12px 24px",
                    display: "flex",
                    borderRadius: "100px",
                    bgcolor: "#1C58B7",
                    mt: 2,
                  }}
                >
                  Iniciar sesión
                </Button>
                <Button fullWidth sx={{ mt: 1 }} onClick={handleBack}>
                  Volver
                </Button>
              </Box>
            </Box>
          </Slide>
        </Box>

        {/* Pie de página con el logotipo */}
        <Box sx={{ position: "absolute", bottom: 30 }}>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Powered by{" "}
            <Link href="https://mooba.co/" target="_blank" color="primary" sx={{ display: "inline-flex", alignItems: "center", ml: 1 }}>
              <Box component="img" src={LogoMooba} alt="Logo Mooba" sx={{ height: "auto", ml: 0.5 }} />
            </Link>
          </Typography>
        </Box>
        
      </Stack>

      {alertOpen && (
   <CustomAlert
      show={alertProps.show}
      mode={alertProps.mode}
      msg1={alertProps.msg1}
      msg2={alertProps.msg2}
      onClose={handleCloseAlert}
   />
)}
    </Stack>
  );
};

export default Login;
