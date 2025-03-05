import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route, Navigate, HashRouter as Router } from "react-router-dom";
import { Campanas } from "./pages/Campanas.jsx";
import { Nuevacampana } from "./pages/Nuevacampana.jsx";
import Productos from "./pages/Productos.jsx";
import Estadisticas from "./pages/estadisticas.jsx";
import Layout from "./components/layout/layout.jsx";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GlobalProvider } from "./services/globalContext.jsx";
import ProtectedRoute from "./services/ProtectedRoute.jsx";
import RedirectRoute from "./services/RedirectRoute.jsx";
import Login from "./pages/Login.jsx";

function App() {
  const theme = createTheme({
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
    },
    typography: {
      fontFamily: "Poppins, Arial, sans-serif",
    },
  });

  return (
    <GlobalProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router>
            <Routes>
              <Route path="/login" element={<RedirectRoute><Login /></RedirectRoute>} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="Campañas" element={<ProtectedRoute><Campanas /></ProtectedRoute>} />
                <Route path="Estadisticas" element={<ProtectedRoute><Estadisticas /></ProtectedRoute>} />
                <Route path="Productos" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
                <Route path="Nueva_Campaña" element={<ProtectedRoute><Nuevacampana /></ProtectedRoute>} />
                <Route path="Editar_Campaña" element={<ProtectedRoute><Nuevacampana /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </GlobalProvider>
  );
}

export default App;
