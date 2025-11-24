import { FormProduct } from "../components";
import { Box } from "@mui/material";

const DashboardNewProductPage = () => {
	return (
		<Box sx={{ p: 2 }}>
			<FormProduct titleForm="Agregar Producto" />
		</Box>
	);
};

export default DashboardNewProductPage;