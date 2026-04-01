package config

import (
	"fmt"
	"log"
	"os"

	"furniture-backend/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB adalah instance koneksi database yang bisa diakses dari seluruh package.
var DB *gorm.DB

// InitDB membaca konfigurasi dari environment variable,
// membuka koneksi ke MySQL, lalu menjalankan AutoMigrate untuk semua model.
func InitDB() {
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		getEnv("DB_USER", "root"),
		getEnv("DB_PASSWORD", ""),
		getEnv("DB_HOST", "127.0.0.1"),
		getEnv("DB_PORT", "3306"),
		getEnv("DB_NAME", "furniture_db"),
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info), // tampilkan query SQL di terminal
	})
	if err != nil {
		log.Fatal("❌ Gagal koneksi ke database:", err)
	}

	DB = db
	log.Println("✅ Database terkoneksi ke", getEnv("DB_NAME", "furniture_db"))

	// AutoMigrate: buat/update tabel secara otomatis sesuai struct model.
	// Urutan penting: Catalog dulu sebelum Product (karena Product punya FK ke Catalog).
	err = DB.AutoMigrate(
		&models.Catalog{},
		&models.User{},
		&models.Product{},
	)
	if err != nil {
		log.Fatal("❌ AutoMigrate gagal:", err)
	}
	log.Println("✅ AutoMigrate selesai — tabel siap digunakan")

	// Seed data awal jika tabel masih kosong
	seedCatalogs()
	seedUsers()
}

// seedCatalogs mengisi tabel catalog dengan data awal jika masih kosong.
func seedCatalogs() {
	var count int64
	DB.Model(&models.Catalog{}).Count(&count)
	if count > 0 {
		return // sudah ada data, skip
	}

	catalogs := []models.Catalog{
		{Nama: "Sofa & Kursi"},
		{Nama: "Meja"},
		{Nama: "Lemari & Rak"},
		{Nama: "Tempat Tidur"},
		{Nama: "Dekorasi"},
	}
	DB.Create(&catalogs)
	log.Println("✅ Data catalog awal berhasil di-seed")
}

// seedUsers mengisi tabel users dengan akun admin awal jika masih kosong.
// Mirip dengan UserSeeder di Laravel — berjalan otomatis saat server pertama kali start.
func seedUsers() {
	var count int64
	DB.Model(&models.User{}).Count(&count)
	if count > 0 {
		return // sudah ada user, skip
	}

	// Hash password menggunakan bcrypt sebelum disimpan ke database
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("❌ Gagal hash password saat seeding user:", err)
	}

	users := []models.User{
		{
			Nama:     "Administrator",
			Email:    "admin@furniture.com",
			Password: string(hashedPassword),
		},
	}

	DB.Create(&users)
	log.Println("✅ User admin awal berhasil di-seed")
	log.Println("   📧 Email    : admin@furniture.com")
	log.Println("   🔑 Password : password123")
}

// getEnv mengambil nilai environment variable, atau fallback jika tidak ada.
func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return fallback
}
