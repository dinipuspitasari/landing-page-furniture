package middleware

import (
	"encoding/json"
	"net/http"
	"strings"
)

// AdminToken adalah token dummy untuk proteksi route admin.
// ⚠️ Ini hanya placeholder — ganti dengan validasi JWT asli di production.
const AdminToken = "admin-secret-token"

// AdminAuth adalah middleware yang memproteksi route admin.
//
// Cara pakai di request:
//
//	Authorization: Bearer admin-secret-token
//
// Alur validasi:
//  1. Cek apakah header Authorization ada
//  2. Pastikan formatnya "Bearer <token>"
//  3. Bandingkan token dengan AdminToken
//  4. Kalau valid → teruskan ke handler, kalau tidak → tolak dengan 401/403
func AdminAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		// Langkah 1: Cek keberadaan header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{
				"status":  "error",
				"message": "Akses ditolak: sertakan header 'Authorization: Bearer <token>'",
			})
			return
		}

		// Langkah 2: Parsing format "Bearer <token>"
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "bearer") {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{
				"status":  "error",
				"message": "Format Authorization salah. Gunakan: Bearer <token>",
			})
			return
		}

		// Langkah 3: Validasi token
		token := parts[1]
		if token != AdminToken {
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(map[string]string{
				"status":  "error",
				"message": "Token tidak valid atau tidak memiliki hak akses admin",
			})
			return
		}

		// Langkah 4: Token valid → lanjutkan ke handler
		next(w, r)
	}
}
