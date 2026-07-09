import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductGrid } from '../components/ProductCard';
import { CategoryPillBar } from '../components/CategoryPillBar';
import { Button } from '../components/ui/Button';
import { useProducts } from '../hooks/queries/useProducts';
import { useCategories, usePrefetchCategoryProducts } from '../hooks/queries/useCategories';
import type { ProductFilters } from '../types';

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    sort_by: (searchParams.get('sort_by') as ProductFilters['sort_by']) || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    page_size: 12,
  });

  const { data: categories = [] } = useCategories();
  const prefetchCategory = usePrefetchCategoryProducts();
  const { data: pagination, isLoading } = useProducts(filters);
  const products = pagination?.results || [];

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    const next = {
      ...filters,
      [key]: value,
      page: key !== 'page' ? 1 : value, // Reset to page 1 when changing filters
    };
    setFilters(next);

    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ page: 1, page_size: 12 });
    setSearchParams({});
  };

  const advancedFilterCount = [filters.min_price, filters.max_price, filters.sort_by].filter(Boolean).length;
  const activeFilterCount = [
    filters.category,
    filters.search,
    filters.min_price,
    filters.max_price,
    filters.sort_by,
  ].filter(Boolean).length;

  // Calculate total pages
  const totalPages = pagination ? Math.ceil(pagination.count / (filters.page_size || 12)) : 1;
  const currentPage = filters.page || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-end justify-between gap-4">
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900">Tous nos produits</h1>
          <p className="text-xs text-gray-400 font-medium shrink-0">
            {pagination ? `${pagination.count} produit${pagination.count > 1 ? 's' : ''}` : ' '}
          </p>
        </div>
      </div>

      {/* Category pill bar — primary mobile nav, sticky under the site header (nav + mobile search bar ≈ 122px) */}
      <div className="lg:hidden sticky top-[122px] z-20 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100 py-3">
        <CategoryPillBar
          categories={categories}
          selected={filters.category}
          onSelect={(slug) => updateFilter('category', slug)}
        />
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar (desktop only) */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
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

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Catégories
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <label className="flex items-center cursor-pointer">
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
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center cursor-pointer"
                      onMouseEnter={() => prefetchCategory(category.slug)}
                    >
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
            {/* Mobile: advanced filters trigger (price + sort only — categories live in the pill bar above) */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowAdvancedFilters(true)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtres avancés
                {advancedFilterCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {advancedFilterCount}
                  </span>
                )}
              </button>
            </div>

            {isLoading ? (
              <ProductGrid isLoading />
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="mt-4"
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            ) : (
              <>
                <ProductGrid products={products} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-1.5 sm:gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => updateFilter('page', currentPage - 1)}
                      className="shrink-0 !px-3 sm:!px-4"
                    >
                      <ChevronLeft className="h-4 w-4 sm:hidden" />
                      <span className="hidden sm:inline">Précédent</span>
                    </Button>

                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page = i + 1;

                        // Show pages around current page
                        if (totalPages > 5) {
                          if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => updateFilter('page', page)}
                            className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                              i >= 3 ? 'hidden sm:inline-flex sm:items-center sm:justify-center' : ''
                            } ${
                              currentPage === page
                                ? 'bg-orange-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <div className="hidden sm:flex items-center gap-2">
                          <span className="text-gray-400">...</span>
                          <button
                            onClick={() => updateFilter('page', totalPages)}
                            className={`shrink-0 w-10 h-10 rounded-lg font-medium transition-colors ${
                              currentPage === totalPages
                                ? 'bg-orange-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            {totalPages}
                          </button>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => updateFilter('page', currentPage + 1)}
                      className="shrink-0 !px-3 sm:!px-4"
                    >
                      <ChevronRight className="h-4 w-4 sm:hidden" />
                      <span className="hidden sm:inline">Suivant</span>
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile advanced filters bottom sheet */}
      {showAdvancedFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowAdvancedFilters(false)}
          />
          <div className="relative w-full bg-white rounded-t-3xl p-6 pb-8 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-gray-900">Filtres avancés</h2>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">Prix (FCFA)</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.min_price || ''}
                  onChange={(e) => updateFilter('min_price', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.max_price || ''}
                  onChange={(e) => updateFilter('max_price', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">Trier par</label>
              <select
                value={filters.sort_by || ''}
                onChange={(e) => updateFilter('sort_by', e.target.value || undefined)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Par défaut</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="name_asc">Nom A-Z</option>
                <option value="name_desc">Nom Z-A</option>
                <option value="newest">Plus récents</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={clearFilters}>
                Réinitialiser
              </Button>
              <Button fullWidth onClick={() => setShowAdvancedFilters(false)}>
                Voir les résultats
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
