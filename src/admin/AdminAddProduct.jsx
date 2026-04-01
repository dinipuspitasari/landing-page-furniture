import { useState, useEffect, useRef } from "react";
import { Label, TextInput, Textarea, Select, Spinner } from "flowbite-react";

// ✅ Komponen wajib dari /src/components (sesuai SKILL.md)
import AppFooter from "../components/AppFooter";
import ButtonPrimary from "../components/ButtonPrimary";
import Card from "../components/Card";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function AdminAddProduct() {
  // Auth guard: ambil token dari localStorage — diisi saat login berhasil
  const adminToken = localStorage.getItem("admin_token");
  const adminNama = localStorage.getItem("admin_nama") || "Admin";

  // Jika tidak ada token, redirect ke halaman login
  if (!adminToken) {
    window.location.href = "/login";
    return null;
  }

  const [catalogs, setCatalogs] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', product: {} | message: '' }

  const [form, setForm] = useState({
    nama_produk: "",
    harga: "",
    deskripsi: "",
    catalog_id: "",
  });

  // State untuk file foto
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Ambil daftar catalog dari API saat halaman dimuat (untuk dropdown)
  useEffect(() => {
    fetch(`${API_BASE}/api/catalogs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setCatalogs(data.data);
      })
      .catch(() =>
        setStatus({ type: "error", message: "Gagal memuat daftar catalog dari server." })
      )
      .finally(() => setLoadingCatalogs(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe file di sisi frontend
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

    if (!foto) {
      setStatus({ type: "error", message: "Foto produk wajib diunggah." });
      setLoading(false);
      return;
    }

    try {
      // Gunakan FormData agar bisa mengirim file sekaligus
      const formData = new FormData();
      formData.append("nama_produk", form.nama_produk);
      formData.append("harga", form.harga);
      formData.append("deskripsi", form.deskripsi);
      formData.append("catalog_id", form.catalog_id);
      formData.append("foto", foto);

      const res = await fetch(`${API_BASE}/api/admin/products`, {
        method: "POST",
        headers: {
          // JANGAN set Content-Type secara manual saat pakai FormData
          // browser akan otomatis set multipart/form-data dengan boundary yang benar
          Authorization: `Bearer ${adminToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", product: data.data, message: data.message });
        setForm({ nama_produk: "", harga: "", deskripsi: "", catalog_id: "" });
        setFoto(null);
        setFotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setStatus({ type: "error", message: data.message || "Terjadi kesalahan." });
      }
    } catch {
      setStatus({ type: "error", message: "Tidak dapat terhubung ke server backend." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-6">
      <div className="w-full max-w-6xl">

        <main className="mt-10 px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-display mb-1 text-3xl font-semibold text-red-700">
                Admin — Tambah Produk
              </h1>
              <p className="text-sm text-gray-500">
                Login sebagai <span className="font-medium text-gray-700">{adminNama}</span>
              </p>
            </div>
            {/* Tombol Logout */}
            <button
              onClick={() => {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_nama");
                localStorage.removeItem("admin_email");
                window.location.href = "/";
              }}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-200"
            >
              Keluar
            </button>
          </div>

          {/* Feedback Status — ✅ Reuse: Card dari /src/components */}
          {status?.type === "success" && status.product && (
            <div className="mb-6">
              <Card
                title={`✅ ${status.message}`}
                description={`"${status.product.nama_produk}" — Rp ${status.product.harga.toLocaleString("id-ID")} | Katalog: ${status.product.catalog?.nama ?? "-"}`}
                bgColor="bg-white"
              />
            </div>
          )}

          {status?.type === "error" && (
            <div className="mb-6">
              <Card
                title="❌ Gagal Menambahkan Produk"
                description={status.message}
                bgColor="bg-white"
              />
            </div>
          )}

          {/* Form Container */}
          <div className="rounded-2xl border-t bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Nama Produk */}
              <div>
                <Label htmlFor="nama_produk" value="Nama Produk" className="mb-1 block text-sm font-medium text-gray-700" />
                <TextInput
                  id="nama_produk"
                  name="nama_produk"
                  value={form.nama_produk}
                  onChange={handleChange}
                  placeholder="Contoh: Sofa Minimalis 3-Dudukan"
                  required
                />
              </div>

              {/* Harga */}
              <div>
                <Label htmlFor="harga" value="Harga (Rp)" className="mb-1 block text-sm font-medium text-gray-700" />
                <TextInput
                  id="harga"
                  name="harga"
                  type="number"
                  value={form.harga}
                  onChange={handleChange}
                  placeholder="Contoh: 3500000"
                  min="0"
                  required
                />
              </div>

              {/* Katalog (Dropdown) — data dari GET /api/catalogs */}
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

              {/* Deskripsi */}
              <div>
                <Label htmlFor="deskripsi" value="Deskripsi" className="mb-1 block text-sm font-medium text-gray-700" />
                <Textarea
                  id="deskripsi"
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                  placeholder="Deskripsikan produk secara singkat dan menarik..."
                  rows={4}
                  required
                />
              </div>

              {/* ── Foto Produk ────────────────────────────────────── */}
              <div>
                <Label htmlFor="foto" value="Foto Produk" className="mb-1 block text-sm font-medium text-gray-700" />
                <p className="mb-2 text-xs text-gray-400">Format: JPG, PNG, atau WEBP. Maks 10 MB.</p>

                {/* Area upload foto */}
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
                    <>
                      <svg className="mb-2 h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 10l-4-4m0 0L8 10m4-4v12" />
                      </svg>
                      <span className="text-sm text-gray-400">Klik untuk memilih foto</span>
                    </>
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
                  required
                />

                {/* Nama file yang dipilih */}
                {foto && (
                  <p className="mt-2 text-xs text-gray-500">
                    📎 {foto.name} ({(foto.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {/* Submit — ✅ Reuse: ButtonPrimary dari /src/components */}
              <div className="pt-2">
                <ButtonPrimary type="submit" className="w-full">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="sm" /> Menyimpan...
                    </span>
                  ) : (
                    "Simpan Produk"
                  )}
                </ButtonPrimary>
              </div>

            </form>
          </div>
        </main>

        {/* ✅ Reuse: AppFooter dari /src/components */}
        <div className="mt-10">
          <AppFooter />
        </div>

      </div>
    </div>
  );
}
