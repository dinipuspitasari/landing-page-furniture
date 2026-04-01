package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"furniture-backend/config"
	"furniture-backend/routes"

	"github.com/joho/godotenv"
)

func main() {
	// 1. Load konfigurasi dari file .env
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  File .env tidak ditemukan, menggunakan environment variable sistem")
	}

	// 2. Inisialisasi koneksi database MySQL + AutoMigrate
	config.InitDB()

	// 3. Daftarkan semua route API
	mux := http.NewServeMux()
	routes.RegisterRoutes(mux)

	// 4. Jalankan server
	port := os.Getenv("PORT") // Railway/Render dan PaaS modern menggunakan variable "PORT"
	if port == "" {
		port = os.Getenv("APP_PORT")
	}
	if port == "" {
		port = "8080"
	}

	fmt.Println("🚀 Server furniture-backend berjalan di http://localhost:" + port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal("❌ Gagal menjalankan server:", err)
	}
}