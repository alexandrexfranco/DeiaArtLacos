import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Shop from '@/pages/Shop';
import About from '@/pages/About';
import ExchangePolicy from '@/pages/ExchangePolicy';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import FAQ from '@/pages/FAQ';
import Checkout from '@/pages/Checkout';
import Contact from '@/pages/Contact';
import Profile from '@/pages/Profile';
import MyOrders from '@/pages/MyOrders';
import Wishlist from '@/pages/Wishlist';
import ProductDetails from '@/pages/ProductDetails';
import { AdminLayout } from '@/components/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import ProductManager from '@/pages/admin/ProductManager';
import BannerManager from '@/pages/admin/BannerManager';
import UserManager from '@/pages/admin/UserManager';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { CartProvider } from '@/contexts/CartContext';
import { Footer } from '@/components/Footer';
import { CartSidebar } from '@/components/CartSidebar';
import { Layout } from '@/components/Layout';

function App() {
    return (
        <AuthProvider>
            <ProductProvider>
                <CartProvider>
                    <Router>
                        <Toaster position="top-right" richColors />
                        <CartSidebar />
                        <div className="min-h-screen flex flex-col">
                            <Routes>
                                {/* Public Routes wrapped in Layout (Header) */}
                                <Route element={<Layout />}>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/loja" element={<Shop />} />
                                    <Route path="/sobre" element={<About />} />
                                    <Route path="/contato" element={<Contact />} />
                                    <Route path="/politica-troca" element={<ExchangePolicy />} />
                                    <Route path="/privacidade" element={<PrivacyPolicy />} />
                                    <Route path="/faq" element={<FAQ />} />
                                    <Route path="/checkout" element={<Checkout />} />
                                    <Route path="/perfil" element={<Profile />} />
                                    <Route path="/pedidos" element={<MyOrders />} />
                                    <Route path="/favoritos" element={<Wishlist />} />
                                    <Route path="/produto/:id" element={<ProductDetails />} />
                                </Route>

                                {/* Admin Routes */}
                                <Route path="/admin" element={<AdminLayout />}>
                                    <Route index element={<Dashboard />} />
                                    <Route path="produtos" element={<ProductManager />} />
                                    <Route path="banners" element={<BannerManager />} />
                                    <Route path="clientes" element={<UserManager />} />
                                </Route>

                                {/* Auth Routes */}
                                <Route path="/login" element={<Login />} />
                                <Route path="/cadastro" element={<Signup />} />
                            </Routes>

                            {/* Footer outside Layout to be everywhere except maybe auth if desired, but here it's global inside flex col */}
                            <Footer />
                        </div>
                    </Router>
                </CartProvider>
            </ProductProvider>
        </AuthProvider>
    );
}

export default App;
