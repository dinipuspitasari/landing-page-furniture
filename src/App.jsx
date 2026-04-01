import Header from "./components/Header";
import AppFooter from "./components/AppFooter";
import Hero from "./home/Hero";
import BestSeller from "./home/BestSeller";
import CreatingStyle from "./home/CreatingStye";
import Categories from "./home/Categories";
import CreateYourOwn from "./home/CreateYourOwn";
import AdminAddProduct from "./admin/AdminAddProduct";
import LoginPage from "./login/LoginPage";
import ProductPage from "./products/ProductPage";

// Routing sederhana berbasis pathname — tanpa library tambahan
const currentPath = window.location.pathname;

export default function App() {
  // Route: /login → halaman login admin
  if (currentPath === "/login") {
    return <LoginPage />;
  }

  // Route: /admin → halaman tambah produk (ada auth guard di dalamnya)
  if (currentPath === "/admin") {
    return <AdminAddProduct />;
  }

  // Route: /products → halaman daftar produk page
  if (currentPath === "/products") {
    return <ProductPage />;
  }

  // Default: landing page
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-start py-6">
        <div className="w-full max-w-6xl">
          <Header />
          <Hero />
          <BestSeller />
          <CreatingStyle />
          <Categories />
          <CreateYourOwn />
          <AppFooter />
        </div>
      </div>
    </>
  );
}
