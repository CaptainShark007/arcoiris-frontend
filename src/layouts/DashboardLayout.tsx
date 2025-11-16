import { getSession } from "@/actions";
//import { getUserRole } from "@/actions"; // comentado temporalmente para iniciar sin ser admin
import { supabase } from "@/supabase/client";
import { Loader } from "@shared/components";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Box } from "@mui/material";
import { Sidebar } from "@/components/dashboard";

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { session } = await getSession();

      if (!session) {
        navigate("/acceder");
        return;
      }

       //comentado temporalmente para acceder sin rol admin
       //const role = await getUserRole(session.user.id);
       //if (role !== "admin") {
        // navigate("/");
        // return;
       //}

      setIsLoading(false);
    };

    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/acceder");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) return <Loader />;

  return (
    <Box display="flex">
      <Sidebar />
      <Box sx={{ ml: "250px", width: "calc(100% - 250px)", p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
