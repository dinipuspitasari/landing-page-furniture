import { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";

import Header from "../components/Header";
import AppFooter from "../components/AppFooter";
import ProductCard from "../components/ProductCard";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setProducts(data.data);
        } else {
          setError(data.message || "Gagal memuat daftar produk.");
        }
      })
      .catch(() => setError("Tidak dapat terhubung ke server backend."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-6">
      <div className="w-full max-w-6xl">
        <Header />

        <main className="mt-16 px-4">
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl font-bold text-red-800">
              Katalog Produk
            </h1>
            <p className="mt-2 text-gray-500">
              Temukan koleksi furnitur terbaik untuk ruang impian Anda.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center p-10">
              <Spinner size="xl" className="fill-red-700" />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-500">
              Belum ada produk yang tersedia saat ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product, index) => {
                // Pastikan path foto ditambahkan base URL backend jika dia relative (e.g. /uploads/...)
                const imageUrl = product.foto_url && product.foto_url.startsWith("/")
                  ? `${API_BASE}${product.foto_url}`
                  : product.foto_url;

                const formattedPrice = `Rp ${Number(product.harga).toLocaleString("id-ID")}`;

                // Warna kartu produk (Putih, Merah, Hijau)
                const cardThemes = [
                  {
                    bg: "#F9E4C8",
                    title: "text-red-700",
                    price: "text-gray-700",
                  },
                  {
                    bg: "#E2ECE9",
                    title: "text-red-700",
                    price: "text-gray-700",
                  }, // Merah
                  {
                    bg: "#D8E2DC",
                    title: "text-red-700",
                    price: "text-gray-700",
                  },
                  {
                    bg: "#FFE5EC",
                    title: "text-red-700",
                    price: "text-gray-700",
                  },
                  {
                    bg: "#80c6ba",
                    title: "text-white",
                    price: "text-green-100",
                  }, // Hijau
                ];
                const theme = cardThemes[index % cardThemes.length];

                return (
                  <ProductCard
                    key={product.id}
                    title={product.nama_produk}
                    price={formattedPrice}
                    image={imageUrl || "https://placehold.co/400x400?text=No+Image"}
                    bgColor={theme.bg}
                    titleColor={theme.title}
                    priceColor={theme.price}
                    onClick={() => console.log('Detail atau Add To Cart untuk:', product.id)}
                  />
                );
              })}
            </div>
          )}
        </main>

        <div className="mt-20">
          <AppFooter />
        </div>
      </div>
    </div>
  );
}
