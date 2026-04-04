import Header from "./components/Header";
import AppFooter from "./components/AppFooter";
import Hero from "./home/Hero";
import BestSeller from "./home/BestSeller";
import CreatingStyle from "./home/CreatingStye";
import Categories from "./home/Categories";
import CreateYourOwn from "./home/CreateYourOwn";
import AdminAddProduct from "./admin/AdminAddProduct";
import AdminUpdateProduct from "./admin/Pages/AdminUpdateProduct";
import LoginPage from "./login/LoginPage";
import ProductPage from "./products/ProductPage";
import AdminProductPage from "./admin/Pages/ProductPage";
import AdminDashboard from "./admin/Pages/AdminDashboard";
import CatalogPage from "./admin/Pages/CatalogPage";
import AdminAddCatalog from "./admin/Pages/AdminAddCatalog";
import AdminUpdateCatalog from "./admin/Pages/AdminUpdateCatalog";

// Routing sederhana berbasis pathname — tanpa library tambahan
const currentPath = window.location.pathname;

export default function App() {
  // Route: /login → halaman login admin
  if (currentPath === "/login") {
    return <LoginPage />;
  }

  // Route: /admin → halaman dashboard admin utama
  if (currentPath === "/admin") {
    return <AdminDashboard />;
  }

  // Route: /admin/products → halaman list produk admin
  if (currentPath === "/admin/products") {
    return <AdminProductPage />;
  }

  // Route: /admin/add-product → halaman tambah produk (ada auth guard di dalamnya)
  if (currentPath === "/admin/add-product") {
    return <AdminAddProduct />;
  }

  // Route: /admin/update-product → halaman update produk
  if (currentPath === "/admin/update-product") {
    return <AdminUpdateProduct />;
  }

  // Route: /admin/catalog → halaman list katalog admin
  if (currentPath === "/admin/catalog") {
    return <CatalogPage />;
  }

  // Route: /admin/add-catalog → halaman tambah katalog
  if (currentPath === "/admin/add-catalog") {
    return <AdminAddCatalog />;
  }

  // Route: /admin/update-catalog → halaman update katalog
  if (currentPath === "/admin/update-catalog") {
    return <AdminUpdateCatalog />;
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
