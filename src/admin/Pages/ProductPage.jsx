import { useState, useEffect, useMemo } from "react";
import {
  Table, TableHead, TableHeadCell, TableBody,
  TableRow, TableCell, Spinner, Select,
} from "flowbite-react";
import { HiPlus, HiPencilAlt, HiTrash, HiSearch, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import NavAdmin from "../../components/NavAdmin";
import AppFooter from "../../components/AppFooter";
import ButtonPrimary from "../../components/ButtonPrimary";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const ITEMS_PER_PAGE = 15; // jumlah produk per halaman

export default function ProductPage() {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);

  // ── State untuk Search, Filter & Pagination ──────────
  const [searchQuery, setSearchQuery]         = useState("");
  const [selectedCatalog, setSelectedCatalog] = useState(""); // "" = semua
  const [currentPage, setCurrentPage]         = useState(1);

  // ── Fetch data produk ─────────────────────────────────
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.status === "success") setProducts(result.data || []);
      else console.error(result.message);
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { window.location.href = "/login"; return; }
    fetchProducts();
  }, []);

  // ── Hapus produk ──────────────────────────────────────
  const handleDelete = async (id, namaProduk) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus produk "${namaProduk}"?`)) return;
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API_BASE}/api/admin/products/?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.status === "success") fetchProducts();
      else alert(result.message || "Gagal menghapus produk");
    } catch {
      alert("Terjadi kesalahan pada server.");
    }
  };

  // ── Ambil daftar katalog unik dari data produk ────────
  const catalogOptions = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      if (p.catalog?.id) map.set(p.catalog.id, p.catalog.nama);
    });
    return Array.from(map, ([id, nama]) => ({ id, nama }));
  }, [products]);

  // ── Filter: search + katalog ──────────────────────────
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by search query (nama produk, case-insensitive)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.nama_produk.toLowerCase().includes(q)
      );
    }

    // Filter by catalog
    if (selectedCatalog) {
      result = result.filter((p) => String(p.catalog?.id) === selectedCatalog);
    }

    return result;
  }, [products, searchQuery, selectedCatalog]);

  // Reset ke halaman 1 saat filter berubah
  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedCatalog]);

  // ── Pagination ────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Buat array nomor halaman (max 5 tombol terlihat)
  const pageNumbers = useMemo(() => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end   = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-6">
      <div className="w-full max-w-6xl">
        <NavAdmin />

        <main className="mx-auto w-full max-w-7xl flex-1 p-6 lg:p-10">
          {/* ── Header ── */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manajemen Produk
              </h1>
              <p className="text-sm text-gray-500">
                Kelola daftar produk furnitur Anda.
              </p>
            </div>
            <ButtonPrimary
              onClick={() => (window.location.href = "/admin/add-product")}
            >
              <HiPlus className="mr-2 h-5 w-5" /> Tambah Produk
            </ButtonPrimary>
          </div>

          {/* ── Search & Filter ── */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search input */}
            <div className="relative flex-1">
              <HiSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#bd4135]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama produk..."
                className="w-full rounded-full border-2 border-[#bd4135]/30 bg-[#f6ebd8] py-2 pr-4 pl-9 text-sm font-medium text-red-900 placeholder-[#bd4135]/40 shadow-sm transition focus:border-[#bd4135] focus:ring-2 focus:ring-[#bd4135]/20 focus:outline-none"
              />
            </div>

            {/* Filter katalog */}
            <div className="sm:w-56">
              <select
                value={selectedCatalog}
                onChange={(e) => setSelectedCatalog(e.target.value)}
                className="w-full rounded-full border-2 border-[#4da394]/40 bg-[#f6ebd8] px-4 py-2 text-sm font-semibold text-[#4da394] shadow-sm transition focus:border-[#4da394] focus:ring-2 focus:ring-[#4da394]/20 focus:outline-none"
              >
                <option value="">🗂 Semua Katalog</option>
                {catalogOptions.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Info hasil filter ── */}
          {!loading && (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#f9d26b] px-3 py-1 text-xs font-bold text-yellow-900 shadow-sm">
                {filteredProducts.length} produk
              </span>
              {searchQuery && (
                <span className="rounded-full bg-[#bd4135]/10 px-3 py-1 text-xs font-medium text-[#bd4135]">
                  🔍 &ldquo;{searchQuery}&rdquo;
                </span>
              )}
              {selectedCatalog && (
                <span className="rounded-full bg-[#4da394]/10 px-3 py-1 text-xs font-medium text-[#4da394]">
                  🗂{" "}
                  {
                    catalogOptions.find((c) => String(c.id) === selectedCatalog)
                      ?.nama
                  }
                </span>
              )}
              {(searchQuery || selectedCatalog) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCatalog("");
                  }}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 transition hover:bg-gray-200"
                >
                  ✕ Reset
                </button>
              )}
            </div>
          )}

          {/* ── Tabel ── */}
          <div className="overflow-hidden rounded-2xl border-2 border-t border-[#bd4135] bg-white shadow-sm">
            {loading ? (
              <div className="flex justify-center p-10">
                <Spinner size="xl" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                {searchQuery || selectedCatalog
                  ? "Produk tidak ditemukan. Coba ubah kata kunci atau filter."
                  : "Belum ada produk. Silakan tambah produk baru."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeadCell className="rounded-none bg-[#bd4135] text-white">
                        Foto
                      </TableHeadCell>
                      <TableHeadCell className="rounded-none bg-[#bd4135] text-white">
                        Nama Produk
                      </TableHeadCell>
                      <TableHeadCell className="rounded-none bg-[#bd4135] text-white">
                        Katalog
                      </TableHeadCell>
                      <TableHeadCell className="rounded-none bg-[#bd4135] text-white">
                        Harga
                      </TableHeadCell>
                      <TableHeadCell className="rounded-none bg-[#bd4135] text-white">
                        Stok
                      </TableHeadCell>
                      <TableHeadCell className="rounded-none bg-[#bd4135] text-white">
                        Aksi
                      </TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="border-[#bd4135] divide-y text-gray-900">
                    {paginatedProducts.map((p) => (
                      <TableRow
                        key={p.id}
                        className="border-b odd:bg-[#f9d26b] even:bg-[#E2ECE9]"
                      >
                        <TableCell>
                          <img
                            src={`${API_BASE}${p.foto_url}`}
                            alt={p.nama_produk}
                            className="h-16 w-16 rounded-md object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap text-gray-900">
                          {p.nama_produk}
                        </TableCell>
                        <TableCell>{p.catalog?.nama || "N/A"}</TableCell>
                        <TableCell>
                          Rp {p.harga.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <span className="text-md rounded-full bg-green-100 px-2 py-1 font-bold text-green-800">
                            {p.stok}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ButtonPrimary
                              className="bg-emerald-800"
                              onClick={() => {
                                window.location.href = `/admin/update-product?id=${p.id}`;
                              }}
                            >
                              <HiPencilAlt className="mr-1 h-4 w-4" /> Edit
                            </ButtonPrimary>
                            <ButtonPrimary
                              onClick={() => handleDelete(p.id, p.nama_produk)}
                              className="hover:bg-red-700"
                            >
                              <HiTrash className="mr-1 h-4 w-4" /> Hapus
                            </ButtonPrimary>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* ── Pagination ── */}
          {!loading && totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-1">
              {/* Tombol Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-full border-2 border-[#bd4135]/25 bg-[#f6ebd8] px-4 py-2 text-sm font-semibold text-[#bd4135] transition hover:border-[#bd4135] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <HiChevronLeft className="h-4 w-4" /> Prev
              </button>

              {/* Nomor halaman */}
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`h-9 w-9 rounded-full text-sm font-bold transition ${
                    n === currentPage
                      ? "scale-110 bg-[#bd4135] text-white shadow-md"
                      : "border-2 border-[#bd4135]/25 bg-[#f6ebd8] text-[#bd4135] hover:border-[#bd4135] hover:bg-white"
                  }`}
                >
                  {n}
                </button>
              ))}

              {/* Tombol Next */}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-full border-2 border-[#bd4135]/25 bg-[#f6ebd8] px-4 py-2 text-sm font-semibold text-[#bd4135] transition hover:border-[#bd4135] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next <HiChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </main>

        <AppFooter />
      </div>
    </div>
  );
}
