import React, { useState } from "react";
import { Box, Stack, TextField, Typography, Button, Link, Slide, CircularProgress } from "@mui/material";
import Loginicon from "../assets/Web_Mockup_23.png";
import LogoEticos from "../assets/Icon-Eticos.svg";
import LogoMooba from "../assets/Isolation_Mode.svg";
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from "../services/globalContext.jsx";

const Login = () => {
  const [email, setEmail] = useState(""); // Email del usuario
  const [emailError, setEmailError] = useState(""); // Mensaje de error para el correo
  const [codeSent, setCodeSent] = useState(false); // Estado para saber si se envió el código
  const [verificationCode, setVerificationCode] = useState(""); // Código generado
  const [enteredCode, setEnteredCode] = useState(""); // Código ingresado por el usuario
  const [isVerified, setIsVerified] = useState(false); // Estado de verificación
  const [step, setStep] = useState(0); // Controla el paso actual
  const [slideDirection, setSlideDirection] = useState("right"); // Controla la dirección del slide

  const { login } = useGlobalContext();
  const navigate = useNavigate();

  // Genera un código de verificación aleatorio
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Ejemplo: código de 6 dígitos
  };

  // Valida el formato del correo
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
  const handleSendCode = () => {
    if (!validateEmail()) return; // Detiene la función si el correo no es válido
    
    const code = generateVerificationCode();
    setVerificationCode(code); // Almacena el código generado
    setCodeSent(true); // Cambia el estado a "código enviado"
    console.log(`Código de verificación enviado a ${email}: ${code}`);
    
    // Cambia al paso de envío de código con un indicador de carga
    setSlideDirection("right");
    setStep(1);
    setTimeout(() => {
      setStep(2); // Después de 2 segundos, cambia al paso de ingreso de código
    }, 2000); 
  };

  // Verifica si el código ingresado coincide con el código enviado
  const handleVerifyCode = () => {
    if (enteredCode === verificationCode) {
      setIsVerified(true); // El usuario está verificado
      alert("Código correcto. Verificación exitosa.");
      handleLogin(); // Redirige después de verificar
    } else {
      alert("Código incorrecto. Inténtalo de nuevo.");
    }
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
        }}
      />

      {/* Sección derecha con el formulario de login */}
      <Stack
        direction="column"
        sx={{
          width: "50vw",
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

          {/* Paso 1 y Paso 2 siguen igual */}
          {/* ... */}
          
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
            <Link href="#" color="primary" sx={{ display: "inline-flex", alignItems: "center", ml: 1 }}>
              <Box component="img" src={LogoMooba} alt="Logo Mooba" sx={{ height: "auto", ml: 0.5 }} />
            </Link>
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Login;
