package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"furniture-backend/config"
	"furniture-backend/models"
)

// GetProducts mengambil semua produk dari database beserta data catalog-nya (Preload).
func GetProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var products []models.Product
	// Preload("Catalog") = otomatis JOIN dan isi field Catalog di setiap produk
	if err := config.DB.Preload("Catalog").Find(&products).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Gagal mengambil data produk"})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"data":   products,
	})
}

// CreateProduct menyimpan produk baru ke database.
// Menerima multipart/form-data agar mendukung upload foto.
// Field form: nama_produk, harga, deskripsi, catalog_id, foto (file).
func CreateProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Method tidak diizinkan"})
		return
	}

	// Parse multipart form — batas 10 MB untuk file foto
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Gagal membaca form data"})
		return
	}

	// Baca field teks dari form
	namaProduk := strings.TrimSpace(r.FormValue("nama_produk"))
	deskripsi := strings.TrimSpace(r.FormValue("deskripsi"))
	hargaStr := strings.TrimSpace(r.FormValue("harga"))
	catalogIDStr := strings.TrimSpace(r.FormValue("catalog_id"))

	// Validasi field teks wajib
	if namaProduk == "" || deskripsi == "" || hargaStr == "" || catalogIDStr == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "error",
			"message": "nama_produk, harga, deskripsi, dan catalog_id wajib diisi",
		})
		return
	}

	harga, err := strconv.ParseFloat(hargaStr, 64)
	if err != nil || harga <= 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Harga tidak valid"})
		return
	}

	catalogID, err := strconv.ParseUint(catalogIDStr, 10, 64)
	if err != nil || catalogID == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "catalog_id tidak valid"})
		return
	}

	// Pastikan catalog benar-benar ada
	var catalog models.Catalog
	if err := config.DB.First(&catalog, catalogID).Error; err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Catalog tidak ditemukan"})
		return
	}

	// ── Upload foto ────────────────────────────────────────────────
	file, fileHeader, err := r.FormFile("foto")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Foto produk wajib diunggah"})
		return
	}
	defer file.Close()

	// Validasi tipe file (hanya gambar)
	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
	allowedExt := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".webp": true}
	if !allowedExt[ext] {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Foto harus berformat JPG, PNG, atau WEBP"})
		return
	}

	// Pastikan folder uploads/ ada
	uploadDir := "uploads"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Gagal membuat folder upload"})
		return
	}

	// Nama file unik: timestamp + nama asli
	uniqueName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), fileHeader.Filename)
	savePath := filepath.Join(uploadDir, uniqueName)

	dst, err := os.Create(savePath)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Gagal menyimpan file foto"})
		return
	}
	defer dst.Close()

	if _, err := io.Copy(dst, file); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Gagal menulis file foto"})
		return
	}

	// URL publik yang bisa diakses frontend: /uploads/<nama-file>
	fotoURL := "/uploads/" + uniqueName

	// ── Simpan ke database ─────────────────────────────────────────
	newProduct := models.Product{
		NamaProduk: namaProduk,
		Harga:      harga,
		Deskripsi:  deskripsi,
		FotoURL:    fotoURL,
		CatalogID:  uint(catalogID),
	}

	if err := config.DB.Create(&newProduct).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Gagal menyimpan produk ke database"})
		return
	}

	// Load relasi Catalog agar response lengkap
	newProduct.Catalog = catalog

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Produk berhasil ditambahkan",
		"data":    newProduct,
	})
}
