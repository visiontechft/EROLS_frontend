import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  User,
  Menu,
  X,
  MessageSquareText,
  HelpCircle,
  Mail,
  Package,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../contexts/CartContext';

export function MobileTabBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    setIsSheetOpen(false);
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    setIsSheetOpen(false);
    await logout();
  };

  const tabClass = (active: boolean) =>
    `flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-medium transition-colors ${
      active ? 'text-orange-500' : 'text-gray-500'
    }`;

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex h-16"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Link to="/" className={tabClass(isActive('/'))}>
          <Home size={22} />
          Accueil
        </Link>
        <Link to="/produits" className={tabClass(isActive('/produits'))}>
          <LayoutGrid size={22} />
          Produits
        </Link>
        <Link to="/panier" className={`${tabClass(isActive('/panier'))} relative`}>
          <span className="relative">
            <ShoppingCart size={22} />
            {cart.itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cart.itemCount}
              </span>
            )}
          </span>
          Panier
        </Link>
        <Link
          to={isAuthenticated ? '/profil' : '/login'}
          className={tabClass(isActive('/profil') || isActive('/login'))}
        >
          <User size={22} />
          Compte
        </Link>
        <button onClick={() => setIsSheetOpen(true)} className={tabClass(isSheetOpen)}>
          <Menu size={22} />
          Plus
        </button>
      </nav>

      {isSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-[45] bg-black/50" onClick={() => setIsSheetOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 pb-8 space-y-1"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-900">Menu</span>
              <button onClick={() => setIsSheetOpen(false)} className="p-1 text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <Link to="/demande-speciale" className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-50 text-gray-700">
              <MessageSquareText size={18} /> Demande Spéciale
            </Link>
            <Link to="/comment-ca-marche" className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-50 text-gray-700">
              <HelpCircle size={18} /> Comment ça marche
            </Link>
            <Link to="/contact" className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-50 text-gray-700">
              <Mail size={18} /> Contact
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/mes-commandes" className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-50 text-gray-700">
                  <Package size={18} /> Mes Commandes
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-50 text-red-600 w-full text-left"
                >
                  <LogOut size={18} /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-50 text-gray-700 w-full text-left"
                >
                  <LogIn size={18} /> Connexion
                </button>
                <button
                  onClick={() => navigate('/inscription')}
                  className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-50 text-gray-700 w-full text-left"
                >
                  <UserPlus size={18} /> Inscription
                </button>
              </>
            )}
            {user?.is_staff && (
              <Link to="/admin/produits" className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-50 text-gray-700">
                <LayoutGrid size={18} /> Admin produits
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
