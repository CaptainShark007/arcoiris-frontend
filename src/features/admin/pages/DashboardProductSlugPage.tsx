import { Box } from "@mui/material";
import { FormProduct } from "../components";
import { SeoHead } from "@shared/components";

const DashboardProductSlugPage = () => {
  return (
    <Box> {/* sx={{ p: 2 }} */}
      <SeoHead 
        title="Editar Producto"
        description="Formulario para editar un producto en el panel de administración"
      />
			<FormProduct titleForm="Editar Producto" />
		</Box>
  )
}

export default DashboardProductSlugPage;