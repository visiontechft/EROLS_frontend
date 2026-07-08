import { lazy, Suspense, useEffect, useState } from 'react';
import { productsApi, categoriesApi } from '../lib/api';
import { HeroSection } from '../components/home/HeroSection';
import { SearchSection } from '../components/home/SearchSection';
import { PageLoader } from '../components/ui/LoadingSpinner';
import type { Product, Category, Brand } from '../types';
import { toast } from 'react-toastify';

const FeaturedCategories = lazy(() =>
  import('../components/home/FeaturedCategories').then((m) => ({ default: m.FeaturedCategories }))
);
const PopularProducts = lazy(() =>
  import('../components/home/PopularProducts').then((m) => ({ default: m.PopularProducts }))
);
const FeaturedProductPerCategory = lazy(() =>
  import('../components/home/FeaturedProductPerCategory').then((m) => ({
    default: m.FeaturedProductPerCategory,
  }))
);
const DealsSection = lazy(() =>
  import('../components/home/DealsSection').then((m) => ({ default: m.DealsSection }))
);
const BenefitsSection = lazy(() =>
  import('../components/home/BenefitsSection').then((m) => ({ default: m.BenefitsSection }))
);
const BrandSlider = lazy(() =>
  import('../components/home/BrandSlider').then((m) => ({ default: m.BrandSlider }))
);
const WhatsAppCommunity = lazy(() =>
  import('../components/home/WhatsAppCommunity').then((m) => ({ default: m.WhatsAppCommunity }))
);

interface HomeData {
  featured: Product[];
  popular: Product[];
  featuredPerCategory: Product[];
  categories: Category[];
  brands: Brand[];
}

export function Home() {
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, popular, featuredPerCategory, categories, brands] = await Promise.all([
          productsApi.getFeatured(),
          productsApi.getPopular(),
          productsApi.getFeaturedPerCategory(),
          categoriesApi.getCategories(),
          productsApi.getBrands(),
        ]);
        setData({ featured, popular, featuredPerCategory, categories, brands });
      } catch (error) {
        console.error('Error loading home data:', error);
        toast.error('Erreur de chargement');
      }
    };
    fetchData();
  }, []);

  if (!data) return <PageLoader />;

  const categoryImages: Record<number, string | null> = {};
  data.featuredPerCategory.forEach((product) => {
    if (product.category) categoryImages[product.category.id] = product.image_url;
  });

  return (
    <div className="min-h-screen bg-white">
      <HeroSection products={data.featured} />
      <SearchSection />

      <Suspense fallback={null}>
        <FeaturedCategories categories={data.categories} categoryImages={categoryImages} />
        <PopularProducts products={data.popular.length > 0 ? data.popular : data.featured} />
        <FeaturedProductPerCategory products={data.featuredPerCategory} />
        <DealsSection products={[...data.featured, ...data.popular]} />
        <BenefitsSection />
        <BrandSlider brands={data.brands} />
        <WhatsAppCommunity />
      </Suspense>
    </div>
  );
}
