import { lazy, Suspense, useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { SearchSection } from '../components/home/SearchSection';
import { MobileCategoryIcons } from '../components/home/MobileCategoryIcons';
import { MobilePromoBanner } from '../components/home/MobilePromoBanner';
import { HomeSkeleton } from '../components/home/HomeSkeleton';
import { useHomepageData } from '../hooks/queries/useHomepageData';
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

export function Home() {
  const { data, isLoading, isError } = useHomepageData();

  useEffect(() => {
    if (isError) toast.error('Erreur de chargement');
  }, [isError]);

  if (isLoading || isError || !data) return <HomeSkeleton />;

  const categoryImages: Record<number, string | null> = {};
  data.featured_per_category.forEach((product) => {
    if (product.category) categoryImages[product.category.id] = product.image_url;
  });

  return (
    <div className="min-h-screen bg-white">
      <HeroSection products={data.featured} />
      <SearchSection />
      <MobileCategoryIcons categories={data.categories} />
      <MobilePromoBanner />

      <Suspense fallback={null}>
        <DealsSection products={[...data.featured, ...data.popular]} />
        <FeaturedCategories categories={data.categories} categoryImages={categoryImages} />
        <PopularProducts products={data.popular.length > 0 ? data.popular : data.featured} />
        <FeaturedProductPerCategory products={data.featured_per_category} />
        <BenefitsSection />
        <BrandSlider brands={data.brands} />
        <WhatsAppCommunity />
      </Suspense>
    </div>
  );
}
