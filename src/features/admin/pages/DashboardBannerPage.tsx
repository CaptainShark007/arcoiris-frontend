import { SeoHead } from '@shared/components';
import UnderConstruction from '@shared/components/UnderConstruction';

const DashboardBannerPage = () => {
  return (
    <>
      <SeoHead 
        title="Panel de Banners"
        description="Gestión de banners en el panel de administración"
      />
      <UnderConstruction
        title='Gestión de Banners'
        subtitle='El panel de banners estará disponible próximamente. Estamos trabajando en nuevas funcionalidades para mejorar tu experiencia.'
        size='large'
      />
    </>
  );
};

export default DashboardBannerPage;
