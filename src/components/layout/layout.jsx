import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar.jsx'; // Asegúrate de importar el Sidebar correctamente
import Box  from '@mui/material/Box';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex' ,bgcolor: '#F2F4F7',  minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1,mt: 4, mb: 2, mx:4 }}>
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default Layout;