import { useState, useEffect, type ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  const Tab = ({
    active,
    icon: Icon,
    label,
    badge,
    ...linkProps
  }: {
    active: boolean;
    icon: typeof Home;
    label: string;
    badge?: ReactNode;
  } & ({ to: string } | { onClick: () => void })) => {
    const content = (
      <motion.div
        className="relative flex flex-col items-center justify-center gap-0.5"
        animate={{ y: active ? -2 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {active && (
          <motion.span
            layoutId="tabbar-active-bg"
            className="absolute -inset-x-3.5 -inset-y-1.5 rounded-2xl bg-orange-50"
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          />
        )}
        <span className="relative">
          <Icon size={active ? 24 : 22} strokeWidth={active ? 2.4 : 2} className={active ? 'text-orange-500' : 'text-gray-500'} />
          {badge}
        </span>
        <span className={`relative text-[11px] ${active ? 'font-bold text-orange-500' : 'font-medium text-gray-500'}`}>
          {label}
        </span>
      </motion.div>
    );

    const className = 'flex flex-1 h-full items-center justify-center';

    return 'to' in linkProps ? (
      <Link to={linkProps.to} className={className}>
        {content}
      </Link>
    ) : (
      <button onClick={linkProps.onClick} className={className}>
        {content}
      </button>
    );
  };

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 border-t border-gray-200/60 bg-white/85 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Tab to="/" active={isActive('/')} icon={Home} label="Accueil" />
        <Tab to="/produits" active={isActive('/produits')} icon={LayoutGrid} label="Produits" />
        <Tab
          to="/panier"
          active={isActive('/panier')}
          icon={ShoppingCart}
          label="Panier"
          badge={
            cart.itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cart.itemCount}
              </span>
            )
          }
        />
        <Tab
          to={isAuthenticated ? '/profil' : '/login'}
          active={isActive('/profil') || isActive('/login')}
          icon={User}
          label="Compte"
        />
        <Tab onClick={() => setIsSheetOpen(true)} active={isSheetOpen} icon={Menu} label="Plus" />
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
