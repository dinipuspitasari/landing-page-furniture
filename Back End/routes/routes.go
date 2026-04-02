package routes

import (
	"net/http"
	"os"

	"furniture-backend/controllers"
	"furniture-backend/middleware"
)

// corsMiddleware menambahkan header CORS agar frontend React (baik di localhost maupun Netlify) bisa mengakses API.
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		allowedOrigin := os.Getenv("FRONTEND_URL")
		if allowedOrigin == "" {
			// Jika tidak disetel, izinkan origin dinamis agar Netlify tidak diblokir
			origin := r.Header.Get("Origin")
			if origin != "" {
				allowedOrigin = origin
			} else {
				allowedOrigin = "*"
			}
		}

		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Preflight request (browser kirim OPTIONS sebelum POST/PUT)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r)
	}
}

// adminRoute membungkus handler dengan dua lapis middleware:
// CORS (luar) → AdminAuth (dalam) → handler asli.
func adminRoute(handler http.HandlerFunc) http.HandlerFunc {
	return corsMiddleware(middleware.AdminAuth(handler))
}

// RegisterRoutes mendaftarkan semua route API ke mux.
//
// Struktur endpoint:
//
//	PUBLIC  → bisa diakses siapa saja
//	ADMIN   → wajib sertakan: Authorization: Bearer admin-secret-token
func RegisterRoutes(mux *http.ServeMux) {

	// =========================================================
	// STATIC FILES — melayani foto produk yang di-upload
	// Akses: http://localhost:8080/uploads/<nama-file>
	// =========================================================
	mux.Handle("/uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir("uploads"))))

	// =========================================================
	// PUBLIC ROUTES — tidak butuh autentikasi
	// =========================================================

	// Auth
	mux.HandleFunc("/api/auth/login", corsMiddleware(controllers.Login))

	// Catalog (baca saja — untuk dropdown di frontend)
	mux.HandleFunc("/api/catalogs", corsMiddleware(controllers.GetCatalogs))

	// Product (baca saja — untuk halaman katalog publik)
	mux.HandleFunc("/api/products", corsMiddleware(controllers.GetProducts))

	// =========================================================
	// ADMIN ROUTES — wajib header: Authorization: Bearer admin-secret-token
	// =========================================================

	// POST /api/admin/catalogs → tambah catalog baru
	mux.HandleFunc("/api/admin/catalogs", adminRoute(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			controllers.CreateCatalog(w, r)
		case http.MethodGet:
			controllers.GetCatalogs(w, r) // admin juga bisa lihat semua catalog
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	// POST /api/admin/products → tambah produk baru (dengan catalog_id dari dropdown)
	mux.HandleFunc("/api/admin/products", adminRoute(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			controllers.CreateProduct(w, r)
		case http.MethodGet:
			controllers.GetProducts(w, r) // admin juga bisa lihat semua produk
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	// PUT /api/admin/products/ → update produk (dengan foto)
	// DELETE /api/admin/products/ → hapus produk
	mux.HandleFunc("/api/admin/products/", adminRoute(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPut {
			controllers.UpdateProduct(w, r)
		} else if r.Method == http.MethodDelete {
			controllers.DeleteProduct(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))
}
