import { useState, useEffect } from "react";
import { Label, TextInput, Spinner, Modal, ModalHeader, ModalBody, Button } from "flowbite-react";
import { HiOutlineExclamationCircle, HiCheckCircle, HiXCircle } from "react-icons/hi";

import NavAdmin from "../../components/NavAdmin";
import AppFooter from "../../components/AppFooter";
import ButtonPrimary from "../../components/ButtonPrimary";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function AdminUpdateCatalog() {
  const adminToken = localStorage.getItem("admin_token");
  if (!adminToken) {
    window.location.href = "/login";
    return null;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const catalogId = searchParams.get('id');

  const [form, setForm] = useState({
    nama: "",
  });

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [confirmModal, setConfirmModal] = useState(false);
  const [resultModal, setResultModal] = useState({ isOpen: false, type: "", title: "", message: "" });

  useEffect(() => {
    if (!catalogId) {
      alert("ID Katalog tidak ditemukan.");
      window.location.href = "/admin/catalog";
      return;
    }

    fetch(`${API_BASE}/api/catalogs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          const catalog = data.data.find(c => c.id === parseInt(catalogId));
          if (catalog) {
            setForm({ nama: catalog.nama });
          } else {
            alert("Katalog tidak ditemukan.");
            window.location.href = "/admin/catalog";
          }
        }
      })
      .catch(() => alert("Gagal mengambil data katalog."))
      .finally(() => setLoadingInitial(false));
  }, [catalogId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    if (!form.nama) {
      setResultModal({ isOpen: true, type: "error", title: "Validasi Gagal", message: "Nama katalog tidak boleh kosong!" });
      return;
    }
    setConfirmModal(true);
  };

  const executeUpdate = async () => {
    setConfirmModal(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/admin/catalogs/?id=${catalogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ nama: form.nama }),
      });

      const data = await res.json();

      if (res.ok) {
        setResultModal({ isOpen: true, type: "success", title: "Berhasil!", message: data.message });
      } else {
        setResultModal({ isOpen: true, type: "error", title: "Gagal", message: data.message || "Terjadi kesalahan." });
      }
    } catch {
      setResultModal({ isOpen: true, type: "error", title: "Error", message: "Tidak dapat terhubung ke server backend." });
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return <div className="flex justify-center items-center h-screen bg-[#f6ebd8]"><Spinner size="xl" /></div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-6 bg-[#f6ebd8]">
      <div className="w-full max-w-6xl">
        <NavAdmin />

        <main className="mt-10 px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-display mb-1 text-3xl font-semibold text-[#bd4135]">
                Admin — Update Katalog
              </h1>
              <p className="text-sm font-medium text-gray-600">
                Merubah nama katalog.
              </p>
            </div>
            <button
              onClick={() => { window.location.href = "/admin/catalog" }}
              className="rounded-full bg-white border-2 border-gray-300 font-bold px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
            >
              Kembali
            </button>
          </div>

          <div className="rounded-2xl border-2 border-[#bd4135] bg-white p-6 shadow-sm">
            <form onSubmit={handleUpdateClick} className="flex flex-col gap-5">
              
              <div>
                <Label htmlFor="nama" value="Nama Katalog Baru" className="mb-1 block text-sm font-bold text-gray-700" />
                <TextInput
                  id="nama"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Contoh: Meja Belajar"
                  required
                />
              </div>

              <div className="mt-4 flex justify-end">
                <ButtonPrimary type="submit" className="w-full sm:w-auto bg-[#bd4135]" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" light={true} className="mr-2" /> Menyimpan...
                    </>
                  ) : (
                    "Update Katalog"
                  )}
                </ButtonPrimary>
              </div>
            </form>
          </div>
        </main>

        {/* --- Modals --- */}
        {/* Modal Konfirmasi */}
        <Modal show={confirmModal} size="md" onClose={() => setConfirmModal(false)} popup>
          <ModalHeader />
          <ModalBody>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-yellow-400" />
              <h3 className="mb-5 text-lg font-normal text-gray-500">
                Apakah Anda yakin ingin memperbarui katalog menjadi <span className="font-bold text-[#bd4135]">"{form.nama}"</span>?
              </h3>
              <div className="flex justify-center gap-4">
                <Button className="bg-[#bd4135] hover:bg-red-800" onClick={executeUpdate}>
                  Ya, Perbarui
                </Button>
                <Button color="gray" onClick={() => setConfirmModal(false)}>
                  Tidak, Batal
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        {/* Modal Hasil */}
        <Modal 
          show={resultModal.isOpen} 
          size="md" 
          onClose={() => {
            setResultModal({ ...resultModal, isOpen: false });
            if (resultModal.type === "success") {
              window.location.href = "/admin/catalog";
            }
          }} 
          popup
        >
          <ModalHeader />
          <ModalBody>
            <div className="text-center">
              {resultModal.type === "success" ? (
                <HiCheckCircle className="mx-auto mb-4 h-16 w-16 text-[#4da394]" />
              ) : (
                <HiXCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
              )}
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {resultModal.title}
              </h3>
              <p className="text-gray-500 mb-6">{resultModal.message}</p>
              <div className="flex justify-center">
                <Button 
                  className={resultModal.type === "success" ? "bg-[#4da394]" : "bg-red-600"} 
                  onClick={() => {
                    setResultModal({ ...resultModal, isOpen: false });
                    if (resultModal.type === "success") {
                      window.location.href = "/admin/catalog";
                    }
                  }}
                >
                  Tutup
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <div className="mt-10">
          <AppFooter />
        </div>
      </div>
    </div>
  );
}
