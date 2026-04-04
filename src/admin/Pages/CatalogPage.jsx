import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Spinner, Modal, ModalHeader, ModalBody, Button } from "flowbite-react";
import { HiPencilAlt, HiTrash, HiOutlineExclamationCircle, HiCheckCircle, HiXCircle } from "react-icons/hi";

import NavAdmin from "../../components/NavAdmin";
import AppFooter from "../../components/AppFooter";
import ButtonPrimary from "../../components/ButtonPrimary";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function CatalogPage() {
  const adminToken = localStorage.getItem("admin_token");
  
  if (!adminToken) {
    window.location.href = "/login";
    return null;
  }

  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, nama: "" });
  const [resultModal, setResultModal] = useState({ isOpen: false, type: "", title: "", message: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCatalogs = () => {
    setLoading(true);
    fetch(`${API_BASE}/api/catalogs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setCatalogs(data.data || []);
        } else {
          setCatalogs([]);
        }
      })
      .catch(() => {
        setCatalogs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCatalogs();
  }, [adminToken]);

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    fetch(`${API_BASE}/api/admin/catalogs/?id=${deleteModal.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDeleteModal({ isOpen: false, id: null, nama: "" });
        if (data.status === "success") {
          setResultModal({ isOpen: true, type: "success", title: "Berhasil", message: data.message });
          fetchCatalogs();
        } else {
          setResultModal({ isOpen: true, type: "error", title: "Gagal", message: data.message || "Terjadi kesalahan saat menghapus katalog." });
        }
      })
      .catch(() => {
        setDeleteModal({ isOpen: false, id: null, nama: "" });
        setResultModal({ isOpen: true, type: "error", title: "Error", message: "Gagal terhubung ke server backend." });
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-6 bg-[#f6ebd8]">
      <div className="w-full max-w-6xl">
        <NavAdmin />

        <main className="mt-10 px-4">
          <div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h1 className="font-display mb-1 text-3xl font-semibold text-[#bd4135]">
                Daftar Katalog
              </h1>
              <p className="text-sm font-medium text-gray-600">
                Data kategori/katalog furnitur Anda.
              </p>
            </div>
            
            <ButtonPrimary 
              onClick={() => { window.location.href = "/admin/add-catalog"; }}
              className="w-full sm:w-auto"
            >
              + Tambah Katalog Baru
            </ButtonPrimary>
          </div>

          <div className="rounded-2xl border-t border-[#bd4135] bg-white shadow-sm overflow-hidden border-2">
            {loading ? (
              <div className="flex justify-center p-10"><Spinner size="xl" /></div>
            ) : catalogs.length === 0 ? (
              <div className="p-10 text-center font-bold text-gray-500">
                Belum ada katalog terbentuk. Silakan tambah katalog baru.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHead className="bg-[#bd4135] text-white">
                    <TableRow>
                      <TableHeadCell className="bg-[#bd4135] text-white rounded-none">No.</TableHeadCell>
                      <TableHeadCell className="bg-[#bd4135] text-white text-left w-full">Nama Katalog</TableHeadCell>
                      <TableHeadCell className="bg-[#bd4135] text-white rounded-none">Aksi</TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="divide-y text-gray-900 border-[#bd4135]">
                    {catalogs.map((c, index) => (
                      <TableRow
                        key={c.id}
                        className="border-b odd:bg-[#f9d26b] even:bg-[#f6ebd8] font-medium border-gray-400"
                      >
                        <TableCell className="w-12 text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-md text-gray-900 text-left">
                          {c.nama}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ButtonPrimary
                              className="bg-emerald-800"
                              onClick={() => { window.location.href = `/admin/update-catalog?id=${c.id}`; }}
                            >
                              <HiPencilAlt className="mr-1 h-4 w-4" /> Edit
                            </ButtonPrimary>

                            <ButtonPrimary
                              onClick={() => setDeleteModal({ isOpen: true, id: c.id, nama: c.nama })}
                              className="hover:bg-red-700"
                            >
                              <HiTrash className="mr-1 h-4 w-4 inline" /> Hapus
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
        </main>

        {/* --- Modals --- */}
        {/* Modal Konfirmasi Hapus */}
        <Modal show={deleteModal.isOpen} size="md" onClose={() => setDeleteModal({ isOpen: false, id: null, nama: "" })} popup>
          <ModalHeader />
          <ModalBody>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-yellow-400" />
              <h3 className="mb-5 text-lg font-normal text-gray-500">
                Apakah Anda yakin ingin menghapus katalog <span className="font-bold">"{deleteModal.nama}"</span>?
              </h3>
              <p className="mb-6 text-sm text-red-500">Peringatan: Seluruh produk yang terhubung ke katalog ini mungkin akan ikut bermasalah jika tidak dipindah terlebih dahulu.</p>
              <div className="flex justify-center gap-4">
                <ButtonPrimary onClick={handleDeleteConfirm} isProcessing={isDeleting} className="bg-emerald-700 hover:bg-emerald-900">
                  Ya, Hapus
                </ButtonPrimary>
                <ButtonPrimary onClick={() => setDeleteModal({ isOpen: false, id: null, nama: "" })} disabled={isDeleting}>
                  Tidak, Batal
                </ButtonPrimary>
              </div>
            </div>
          </ModalBody>
        </Modal>

        {/* Modal Hasil Konfirmasi */}
        <Modal 
          show={resultModal.isOpen} 
          size="md" 
          onClose={() => setResultModal({ ...resultModal, isOpen: false })} 
          popup
        >
          <ModalHeader />
          <ModalBody>
            <div className="text-center">
              {resultModal.type === "success" ? (
                <HiCheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
              ) : (
                <HiXCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
              )}
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {resultModal.title}
              </h3>
              <p className="text-gray-500 mb-6">{resultModal.message}</p>
              <div className="flex justify-center">
                <Button 
                  color={resultModal.type === "success" ? "success" : "failure"} 
                  onClick={() => setResultModal({ ...resultModal, isOpen: false })}
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
