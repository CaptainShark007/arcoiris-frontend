import { SeoHead } from "@shared/components";
import UnderConstruction from "@shared/components/UnderConstruction";

const DashboardPartnersPage = () => {
  return (
    <>
      <SeoHead 
        title="Panel de Socios"
        description="Gestión de socios en el panel de administración"
      />
      <UnderConstruction
        title='Socios'
        subtitle='El panel de socios estará disponible próximamente. Estamos trabajando en nuevas funcionalidades para mejorar tu experiencia.'
        size='large'
      />
    </>
  )
}

export default DashboardPartnersPage;
