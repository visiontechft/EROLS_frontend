import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { MobileTabBar } from './components/MobileTabBar';
import { ScrollToTop } from './components/ScrollToTop'; // ⬅️ 1. Ajoutez cet import
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';
import { SpecialRequest } from './pages/SpecialRequest';
import { About } from './pages/About';
import { HowItWorks } from './pages/HowItWorks';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { AdminProducts } from './pages/admin/AdminProducts';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> {/* ⬅️ 2. Ajoutez cette ligne */}
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pb-16 lg:pb-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/produits" element={<Products />} />
                <Route path="/produits/:slug" element={<ProductDetail />} />
                <Route path="/panier" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/inscription" element={<Register />} />
                <Route path="/profil" element={<Profile />} />
                <Route path="/mes-commandes" element={<Orders />} />
                <Route path="/demande-speciale" element={<SpecialRequest />} />
                <Route path="/a-propos" element={<About />} />
                <Route path="/comment-ca-marche" element={<HowItWorks />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/conditions" element={<Terms />} />
                <Route path="/politique-confidentialite" element={<Privacy />} />
                <Route
                  path="/admin/produits"
                  element={
                    <ProtectedRoute requireStaff>
                      <AdminProducts />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
            <MobileTabBar />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;