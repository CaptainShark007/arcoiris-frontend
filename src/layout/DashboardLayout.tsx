import { Sidebar } from '@features/admin';
import { Outlet } from 'react-router';
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';

export const DashboardLayout = () => {
  return (
    <>
      <Toaster
        position='top-right'
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          backgroundColor: '#f3f4f6',
          minHeight: '100vh',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        <Sidebar />
        <Box
          component='main'
          sx={{
            flex: 1,
            ml: { xs: '140px', lg: '270px' },
            mt: 7,
            mx: 5,
            color: '#1e293b',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
};
