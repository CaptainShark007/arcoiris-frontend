import { Sidebar } from "@features/admin";
import { Outlet } from "react-router";
import { Box } from "@mui/material";

export const DashboardLayout = () => {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'Montserrat, sans-serif' }}>
      <Sidebar />
      <Box
        component="main"
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
  );
};