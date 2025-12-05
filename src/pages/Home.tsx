import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Truck, HeadphonesIcon } from 'lucide-react';
import { productsApi, categoriesApi } from '../lib/api';
import { ProductGrid } from '../components/ProductCard';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import type { Product, Category } from '../types';
import { toast } from 'react-toastify';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productsApi.getFeaturedProducts(),
          categoriesApi.getCategories(),
        ]);

        setFeaturedProducts(productsData);
        setCategories(categoriesData.slice(0, 6)); // Show only first 6 categories
      } catch (error: any) {
        console.error('Error fetching home data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Achetez des produits américains
                <span className="block text-yellow-300">depuis la Côte d'Ivoire</span>
              </h1>
              <p className="text-lg lg:text-xl text-orange-100">
                Découvrez notre sélection de produits de qualité importés directement
                des États-Unis. Commandez en toute simplicité et recevez rapidement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => window.location.href = '/produits'}
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Explorer les produits
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = '/demande-speciale'}
                  className="bg-white/10 border-white text-white hover:bg-white hover:text-orange-600"
                >
                  Demande spéciale
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-3xl" />
                <img
                  src="/hero-image.png"
                  alt="Shopping"
                  className="relative rounded-3xl shadow-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Paiement sécurisé',
                description: 'Vos transactions sont 100% sécurisées',
              },
              {
                icon: Truck,
                title: 'Livraison rapide',
                description: 'Recevez vos produits en 2-3 semaines',
              },
              {
                icon: TrendingUp,
                title: 'Meilleurs prix',
                description: 'Les meilleurs tarifs du marché',
              },
              {
                icon: HeadphonesIcon,
                title: 'Support 24/7',
                description: 'Une équipe à votre écoute',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-3 p-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <feature.icon className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Catégories populaires
                </h2>
                <p className="text-gray-600 mt-2">
                  Découvrez nos différentes catégories de produits
                </p>
              </div>
              <Link
                to="/produits"
                className="hidden sm:flex items-center text-orange-500 hover:text-orange-600 font-medium"
              >
                Voir tout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/produits?category=${category.slug}`}
                  className="group bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                    <span className="text-2xl">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        '📦'
                      )}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                    {category.name}
                  </h3>
                  {category.product_count !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">
                      {category.product_count} produit{category.product_count > 1 ? 's' : ''}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Produits en vedette
                </h2>
                <p className="text-gray-600 mt-2">
                  Découvrez notre sélection de produits populaires
                </p>
              </div>
              <Link
                to="/produits"
                className="hidden sm:flex items-center text-orange-500 hover:text-orange-600 font-medium"
              >
                Voir tout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <ProductGrid products={featuredProducts.slice(0, 8)} />

            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/produits'}
              >
                Voir tous les produits
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Vous ne trouvez pas ce que vous cherchez?
          </h2>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            Faites une demande spéciale et nous ferons de notre mieux pour vous
            trouver le produit parfait depuis les États-Unis.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => window.location.href = '/demande-speciale'}
            className="bg-white text-orange-600 hover:bg-gray-100"
          >
            Faire une demande spéciale
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Commander vos produits américains est simple et rapide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Parcourez & Choisissez',
                description: 'Explorez notre catalogue ou faites une demande spéciale',
              },
              {
                step: '2',
                title: 'Commandez & Payez',
                description: 'Passez votre commande et effectuez le paiement en toute sécurité',
              },
              {
                step: '3',
                title: 'Recevez',
                description: 'Recevez vos produits directement à votre porte',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-orange-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/comment-ca-marche">
              <Button variant="outline" size="lg">
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
