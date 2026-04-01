import { useState } from "react";
import { Label, TextInput, Spinner } from "flowbite-react";

// ✅ Komponen wajib dari /src/components (sesuai SKILL.md)
import Header from "../components/Header";
import AppFooter from "../components/AppFooter";
import ButtonPrimary from "../components/ButtonPrimary";
import Card from "../components/Card";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        // Simpan token dan info user ke localStorage
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_nama", data.nama);
        localStorage.setItem("admin_email", data.email);

        // Redirect ke halaman admin setelah login berhasil
        window.location.href = "/admin";
      } else {
        setError(data.message || "Email atau password salah.");
      }
    } catch {
      setError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-6">
      <div className="w-full max-w-6xl">
        
        <main className="mt-16 flex flex-col items-center px-4">
          <div className="w-full max-w-md">

            {/* Judul */}
            <h1 className="font-display mb-1 text-center text-3xl font-semibold text-red-700">
              Admin Login
            </h1>
            <p className="mb-8 text-center text-sm text-gray-500">
              Masuk untuk mengakses panel administrasi.
            </p>

            {/* ✅ Reuse: Card untuk pesan error */}
            {error && (
              <div className="mb-4">
                <Card
                  title="❌ Login Gagal"
                  description={error}
                  bgColor="bg-white"
                />
              </div>
            )}

            {/* Form Login */}
            <div className="rounded-2xl border-t bg-white p-6 shadow-sm">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Email */}
                <div>
                  <Label
                    htmlFor="email"
                    value="Email"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  />
                  <TextInput
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@furniture.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <Label
                    htmlFor="password"
                    value="Password"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  />
                  <TextInput
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Submit — ✅ Reuse: ButtonPrimary */}
                <div className="pt-1">
                  <ButtonPrimary type="submit">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Spinner size="sm" /> Memverifikasi...
                      </span>
                    ) : (
                      "Masuk"
                    )}
                  </ButtonPrimary>
                </div>

              </form>
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              Hanya admin yang berwenang mengakses halaman ini.
            </p>
          </div>
        </main>

        {/* ✅ Reuse: AppFooter */}
        <div className="mt-16">
          <AppFooter />
        </div>

      </div>
    </div>
  );
}
