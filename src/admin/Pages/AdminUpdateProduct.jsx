import { useState, useEffect, useRef } from "react";
import { Label, TextInput, Textarea, Select, Spinner } from "flowbite-react";

import AppFooter from "../../components/AppFooter";
import ButtonPrimary from "../../components/ButtonPrimary";
import Card from "../../components/Card";
import NavAdmin from "../../components/NavAdmin";  

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function AdminUpdateProduct() {
  const adminToken = localStorage.getItem("admin_token");
  const adminNama = localStorage.getItem("admin_nama") || "Admin";

  if (!adminToken) {
    window.location.href = "/login";
    return null;
  }

  const [catalogs, setCatalogs] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); 

  const [form, setForm] = useState({
    nama_produk: "",
    harga: "",
    deskripsi: "",
    catalog_id: "",
  });

  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get('id');

  useEffect(() => {
    if (!productId) {
      alert("ID Produk tidak ditemukan.");
      window.location.href = "/admin";
      return;
    }
    
    // Fetch catalogs
    fetch(`${API_BASE}/api/catalogs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setCatalogs(data.data);
      })
      .finally(() => setLoadingCatalogs(false));

    // Fetch products to find the selected one
    fetch(`${API_BASE}/api/admin/products`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const product = data.data.find(p => p.id === parseInt(productId));
          if (product) {
            setForm({
              nama_produk: product.nama_produk,
              harga: product.harga,
              deskripsi: product.deskripsi,
              catalog_id: product.catalog_id,
            });
            if (product.foto_url) {
              setFotoPreview(`${API_BASE}${product.foto_url}`);
            }
          } else {
            alert("Produk tidak ditemukan.");
            window.location.href = "/admin";
          }
        }
      })
      .finally(() => setLoadingProduct(false));
  }, [productId, adminToken]);

  // Format angka ke format Rupiah: 3500000 → "3.500.000"
  const formatRupiah = (value) => {
    const num = String(value).replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Lepas format untuk ambil angka mentah: "3.500.000" → "3500000"
  const parseRupiah = (value) => String(value).replace(/\./g, "");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setStatus({ type: "error", message: "Foto harus berformat JPG, PNG, atau WEBP." });
      return;
    }

    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("nama_produk", form.nama_produk);
      formData.append("harga", form.harga);
      formData.append("deskripsi", form.deskripsi);
      formData.append("catalog_id", form.catalog_id);
      
      if (foto) {
        formData.append("foto", foto);
      }

      const res = await fetch(`${API_BASE}/api/admin/products/?id=${productId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", product: data.data, message: data.message });
        setTimeout(() => {
          window.location.href = "/admin";
        }, 1500);
      } else {
        setStatus({ type: "error", message: data.message || "Terjadi kesalahan." });
      }
    } catch {
      setStatus({ type: "error", message: "Tidak dapat terhubung ke server backend." });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
     return <div className="flex justify-center items-center h-screen"><Spinner size="xl" /></div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-6">
      <div className="w-full max-w-6xl">
        <NavAdmin />

        <main className="mt-10 px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-display mb-1 text-3xl font-semibold text-red-700">
                Admin — Update Produk
              </h1>
              <p className="text-sm text-gray-500">
                Memperbarui data produk: {form.nama_produk}
              </p>
            </div>
            <button
              onClick={() => { window.location.href = "/admin" }}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-200"
            >
              Kembali
            </button>
          </div>

          {status?.type === "success" && (
            <div className="mb-6">
              <Card
                title={`✅ ${status.message}`}
                description="Mengarahkan kembali ke daftar produk..."
                bgColor="bg-white"
              />
            </div>
          )}

          {status?.type === "error" && (
            <div className="mb-6">
              <Card
                title="❌ Gagal Memperbarui Produk"
                description={status.message}
                bgColor="bg-white"
              />
            </div>
          )}

          <div className="rounded-2xl border-t bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              <div>
                <Label htmlFor="nama_produk" value="Nama Produk" className="mb-1 block text-sm font-medium text-gray-700" />
                <TextInput
                  id="nama_produk"
                  name="nama_produk"
                  value={form.nama_produk}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="harga" value="Harga (Rp)" className="mb-1 block text-sm font-medium text-gray-700" />
                <TextInput
                  id="harga"
                  name="harga"
                  type="text"
                  inputMode="numeric"
                  value={formatRupiah(form.harga)}
                  onChange={(e) => {
                    const raw = parseRupiah(e.target.value);
                    setForm({ ...form, harga: raw });
                    setStatus(null);
                  }}
                  placeholder="Contoh: 3.500.000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="catalog_id" value="Katalog" className="mb-1 block text-sm font-medium text-gray-700" />
                {loadingCatalogs ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Spinner size="sm" /> Memuat daftar katalog...
                  </div>
                ) : (
                  <Select
                    id="catalog_id"
                    name="catalog_id"
                    value={form.catalog_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Pilih Katalog --</option>
                    {catalogs.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nama}
                      </option>
                    ))}
                  </Select>
                )}
              </div>

              <div>
                <Label htmlFor="deskripsi" value="Deskripsi" className="mb-1 block text-sm font-medium text-gray-700" />
                <Textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="foto" value="Foto Produk (Opsional)" className="mb-1 block text-sm font-medium text-gray-700" />
                <p className="mb-2 text-xs text-gray-400">Pilih foto baru jika ingin mengganti. Jika tidak, foto lama akan dipertahankan.</p>

                <label
                  htmlFor="foto"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-6 transition hover:border-red-300 hover:bg-red-50"
                >
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="Preview foto produk"
                      className="max-h-48 rounded-lg object-contain"
                    />
                  ) : (
                    <span className="text-sm text-gray-400">Klik untuk memilih foto</span>
                  )}
                </label>

                <input
                  ref={fileInputRef}
                  id="foto"
                  name="foto"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFotoChange}
                  className="sr-only"
                />
              </div>

              <div className="pt-2">
                <ButtonPrimary type="submit" className="w-full">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="sm" /> Menyimpan...
                    </span>
                  ) : (
                    "Update Produk"
                  )}
                 </ButtonPrimary>
              </div>

            </form>
          </div>
        </main>

        <div className="mt-10">
          <AppFooter />
        </div>
      </div>
    </div>
  );
}
