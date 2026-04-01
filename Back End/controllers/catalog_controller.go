package controllers

import (
	"encoding/json"
	"net/http"
	"strings"

	"furniture-backend/config"
	"furniture-backend/models"
)

// GetCatalogs mengambil semua catalog dari database.
// Digunakan publik sebagai sumber data dropdown di frontend.
func GetCatalogs(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var catalogs []models.Catalog
	if err := config.DB.Find(&catalogs).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Gagal mengambil data catalog"})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"data":   catalogs,
	})
}

// CreateCatalog menyimpan catalog baru ke database.
// Hanya bisa diakses admin (dilindungi middleware.AdminAuth).
//
// Request body (JSON):
//
//	{ "nama": "Nama Catalog Baru" }
func CreateCatalog(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Decode body request
	var payload struct {
		Nama string `json:"nama"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Request body tidak valid"})
		return
	}

	// Validasi field wajib
	payload.Nama = strings.TrimSpace(payload.Nama)
	if payload.Nama == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Nama catalog wajib diisi"})
		return
	}

	// Cek duplikasi nama catalog
	var existing models.Catalog
	if err := config.DB.Where("nama = ?", payload.Nama).First(&existing).Error; err == nil {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Catalog dengan nama tersebut sudah ada"})
		return
	}

	// Simpan ke database
	newCatalog := models.Catalog{Nama: payload.Nama}
	if err := config.DB.Create(&newCatalog).Error; err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Gagal menyimpan catalog"})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"message": "Catalog berhasil ditambahkan",
		"data":    newCatalog,
	})
}
