import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import { productsApi, categoriesApi } from '../lib/api';
import { ProductGrid } from '../components/ProductCard';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import type { Product, Category, ProductFilters, PaginatedResponse } from '../types';
import { toast } from 'react-toastify';

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState<PaginatedResponse<Product>['meta'] | null>(null);

  // Filter states
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    sort_by: (searchParams.get('sort_by') as ProductFilters['sort_by']) || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    per_page: 12,
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getCategories();
        
        // Gérer le cas où data est un objet paginé ou un tableau
        const categoriesArray = Array.isArray(data) 
          ? data 
          : (data.data || data.results || []);
        
        setCategories(categoriesArray);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Erreur lors du chargement des catégories');
      }
    };

    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productsApi.getProducts(filters);
        setProducts(response.data);
        setPagination(response.meta);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        toast.error('Erreur lors du chargement des produits');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value, // Reset to page 1 when changing filters
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      per_page: 12,
    });
    setSearchParams({});
  };

  const activeFilterCount = [
    filters.category,
    filters.search,
    filters.min_price,
    filters.max_price,
    filters.sort_by,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tous nos produits
          </h1>
          <p className="text-gray-600">
            {pagination
              ? `${pagination.total} produit${pagination.total > 1 ? 's' : ''} disponible${pagination.total > 1 ? 's' : ''}`
              : 'Chargement...'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-orange-500 hover:text-orange-600"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              {/* Search */}
              {filters.search && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recherche
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">"{filters.search}"</span>
                    <button
                      onClick={() => updateFilter('search', undefined)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Catégories
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.category}
                      onChange={() => updateFilter('category', undefined)}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Toutes les catégories
                    </span>
                  </label>
                  {Array.isArray(categories) && categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category.slug}
                        onChange={() => updateFilter('category', category.slug)}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category.name}
                        {category.product_count !== undefined && (
                          <span className="text-gray-400 ml-1">
                            ({category.product_count})
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Prix (FCFA)
                </label>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.min_price || ''}
                    onChange={(e) =>
                      updateFilter('min_price', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.max_price || ''}
                    onChange={(e) =>
                      updateFilter('max_price', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Trier par
                </label>
                <select
                  value={filters.sort_by || ''}
                  onChange={(e) => updateFilter('sort_by', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Par défaut</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="name_asc">Nom A-Z</option>
                  <option value="name_desc">Nom Z-A</option>
                  <option value="newest">Plus récents</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<Filter className="h-5 w-5" />}
              >
                Filtres
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>

            {isLoading ? (
              <PageLoader />
            ) : (
              <>
                <ProductGrid products={products} />

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      disabled={pagination.current_page === 1}
                      onClick={() => updateFilter('page', pagination.current_page - 1)}
                    >
                      Précédent
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => updateFilter('page', page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              pagination.current_page === page
                                ? 'bg-orange-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      {pagination.last_page > 5 && (
                        <>
                          <span className="text-gray-400">...</span>
                          <button
                            onClick={() => updateFilter('page', pagination.last_page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              pagination.current_page === pagination.last_page
                                ? 'bg-orange-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pagination.last_page}
                          </button>
                        </>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      disabled={pagination.current_page === pagination.last_page}
                      onClick={() => updateFilter('page', pagination.current_page + 1)}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}