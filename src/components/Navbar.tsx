import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  Package,
  Heart,
  Settings,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/Button';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produits?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  const navigationLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/produits', label: 'Produits' },
    { path: '/demande-speciale', label: 'Demande Spéciale' },
    { path: '/comment-ca-marche', label: 'Comment ça marche' },
    { path: '/contact', label: 'Contact' },
  ];

  const userMenuItems = [
    { path: '/profil', label: 'Mon Profil', icon: User },
    { path: '/mes-commandes', label: 'Mes Commandes', icon: Package },
  ];

  return (
    <nav
      className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-lg">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">EROLS</span>
              <span className="text-xl font-bold text-orange-500 ml-1">
                EasyBuy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                  location.pathname === link.path
                    ? 'text-orange-500'
                    : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des produits..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/panier"
              className="relative p-2 text-gray-700 hover:text-orange-500 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.first_name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-gray-700">
                    {user?.first_name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Connexion
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/inscription')}
                >
                  Inscription
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-orange-500"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form
          onSubmit={handleSearch}
          className="md:hidden pb-4"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? 'bg-orange-50 text-orange-500 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {!isAuthenticated && (
              <div className="pt-4 space-y-2 border-t border-gray-200">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/login')}
                >
                  Connexion
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/inscription')}
                >
                  Inscription
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
