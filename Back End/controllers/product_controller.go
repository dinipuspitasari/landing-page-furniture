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



// UpdateProduct memperbarui data produk berdasarkan ID.
// Menerima multipart/form-data agar mendukung upload foto baru.
// Field form: nama_produk, harga, deskripsi, catalog_id, foto (opsional).
func UpdateProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPut {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Method tidak diizinkan"})
		return
	}

	// Ambil ID dari URL: /api/products/:id
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "ID produk wajib dikirim di parameter query"})
		return
	}

	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil || id == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "ID produk tidak valid"})
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

	// ── Cari produk yang akan diupdate ─────────────────────────────
	var product models.Product
	if err := config.DB.First(&product, id).Error; err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Produk tidak ditemukan"})
		return
	}

	// ── Handle foto: upload baru atau pakai yang lama? ──────────────
	fotoURL := product.FotoURL // default: pakai foto lama

	file, fileHeader, err := r.FormFile("foto")
	if err == nil && file != nil {
		// Ada foto baru → proses upload
		defer file.Close()

		// Validasi tipe file
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

		// Hapus foto lama (opsional, tapi disarankan agar tidak menumpuk)
		if product.FotoURL != "" {
			// Hapus dari filesystem
			oldPath := strings.TrimPrefix(product.FotoURL, "/uploads/")
			os.Remove(filepath.Join("uploads", oldPath))
		}

		// Simpan foto baru
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

		// Update URL foto
		fotoURL = "/uploads/" + uniqueName
	}

	// ── Update data produk ─────────────────────────────────────────
	// Pastikan catalog benar-benar ada
	var catalog models.Catalog
	if err := config.DB.First(&catalog, catalogID).Error; err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Catalog tidak ditemukan"})
		return
	}

	product.NamaProduk = namaProduk
	product.Harga = harga
	product.Deskripsi = deskripsi
	product.FotoURL = fotoURL
	product.CatalogID = uint(catalogID)

	if err := config.DB.Save(&product).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Gagal update produk"})
		return
	}

	// Load relasi Catalog agar response lengkap
	config.DB.Preload("Catalog").First(&product, id)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Produk berhasil diupdate",
		"data":    product,
	})
}

// DeleteProduct menghapus produk dari database berdasarkan ID.
func DeleteProduct(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodDelete {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Method tidak diizinkan"})
		return
	}

	// Ambil ID dari URL: /api/admin/products/?id=x
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "ID produk wajib dikirim di parameter query"})
		return
	}

	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil || id == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "ID produk tidak valid"})
		return
	}

	var product models.Product
	if err := config.DB.First(&product, id).Error; err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Produk tidak ditemukan"})
		return
	}

	if product.FotoURL != "" {
		oldPath := strings.TrimPrefix(product.FotoURL, "/uploads/")
		os.Remove(filepath.Join("uploads", oldPath))
	}

	if err := config.DB.Delete(&product).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Gagal menghapus produk"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "success", "message": "Produk berhasil dihapus"})
}