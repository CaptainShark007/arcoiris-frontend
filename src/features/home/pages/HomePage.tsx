import { carouselSlides, categories, allProducts } from '../data/mockData';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { HeroCarousel } from '../components/HeroCarousel';
import { Newsletter } from '../components/Newsletter';
import { ProductCarousel } from '../components/ProductCarousel';

const HomePage = () => {
  return (
    <div className='homepage'>
      {/* Carrusel inical */}
      <HeroCarousel slides={carouselSlides} />
      {/* Categorias */}
      {/* <CategoryGrid categories={categories} /> */}
      <CategoryCarousel categories={categories} />
      {/* Secciones */}
      <ProductCarousel
        title='Nuevos Ingresos'
        products={allProducts}
        showOriginalPrice={false}
      />
      <ProductCarousel
        title='Los Más Vendidos'
        products={allProducts}
        showOriginalPrice={false}
      />
      <ProductCarousel
        title='Ofertas especiales'
        products={allProducts}
        showOriginalPrice={true}
      />
      <Newsletter /> {/* Hoja informativa / Footer */}
    </div>
  );
};

export default HomePage;
