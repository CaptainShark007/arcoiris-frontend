import { SeoHead } from "@shared/components";
import { FormProduct } from "../components";
import { Box } from "@mui/material";

const DashboardNewProductPage = () => {
	return (
		<Box>
			<SeoHead 
				title="Nuevo Producto"
				description="Formulario para agregar un nuevo producto en el panel de administración"
			/>
			<FormProduct titleForm="Agregar Producto" />
		</Box>
	);
};

export default DashboardNewProductPage;