import { signOut } from "@/actions";
import { Box, Button, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate } from "react-router";
import { links } from "@/constants/links";

export const Sidebar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await signOut();
    queryClient.invalidateQueries({ queryKey: ["users"] });
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <List>
        {links.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton component={NavLink} to={link.path}>
              <ListItemText primary={link.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2 }}>
        <Button fullWidth variant="contained" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );
};
