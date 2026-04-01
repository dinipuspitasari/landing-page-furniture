package controllers

import (
	"encoding/json"
	"net/http"

	"furniture-backend/config"
	"furniture-backend/middleware"
	"furniture-backend/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Login memproses autentikasi: cari user by email, verifikasi password hash.
// Response sukses mengembalikan token yang sama dengan middleware.AdminToken
// agar bisa langsung dipakai untuk mengakses route admin.
func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Method tidak diizinkan"})
		return
	}

	var req models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Request body tidak valid"})
		return
	}

	// Cari user berdasarkan email di database
	var user models.User
	if err := config.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Email atau password salah"})
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Kesalahan server"})
		return
	}

	// Verifikasi password menggunakan bcrypt
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"status": "error", "message": "Email atau password salah"})
		return
	}

	// Token dikembalikan = middleware.AdminToken agar cocok saat validasi route admin
	json.NewEncoder(w).Encode(models.LoginResponse{
		Status:  "success",
		Message: "Login berhasil",
		Token:   middleware.AdminToken,
		Nama:    user.Nama,
		Email:   user.Email,
	})
}
