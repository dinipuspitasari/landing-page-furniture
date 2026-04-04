package models

// Product merepresentasikan entitas produk furniture.
// Field wajib (sesuai CRITICAL RULES di SKILL.md): NamaProduk, Harga, Deskripsi.
// Setiap produk WAJIB berelasi ke satu Catalog.
type Product struct {
	ID         uint    `gorm:"primaryKey;autoIncrement"              json:"id"`
	NamaProduk string  `gorm:"type:varchar(200);not null"            json:"nama_produk"`
	Harga      float64 `gorm:"type:decimal(15,2);not null"           json:"harga"`
	Deskripsi  string  `gorm:"type:text;not null"                    json:"deskripsi"`
	Stok       uint    `gorm:"type:int;default:0"                    json:"stok"`
	FotoURL    string  `gorm:"type:varchar(500);not null"            json:"foto_url"`
	CatalogID  uint    `gorm:"not null;index"                        json:"catalog_id"`

	// Relasi belongs-to: satu Product milik satu Catalog.
	// GORM otomatis join berdasarkan CatalogID.
	Catalog Catalog `gorm:"foreignKey:CatalogID;references:ID"    json:"catalog"`
}

// CreateProductRequest adalah struktur body request POST /api/products.
// Admin memilih catalog_id dari dropdown yang diisi oleh GET /api/catalogs.
// Foto dikirim sebagai file multipart, bukan di sini.
type CreateProductRequest struct {
	NamaProduk string  `json:"nama_produk"`
	Harga      float64 `json:"harga"`
	Deskripsi  string  `json:"deskripsi"`
	Stok       uint    `json:"stok"`
	CatalogID  uint    `json:"catalog_id"`
	FotoURL    string  `json:"foto_url"`
}

// UpdateProductRequest adalah struktur body request PUT /api/products/:id.
type UpdateProductRequest struct {
	NamaProduk string  `json:"nama_produk"`
	Harga      float64 `json:"harga"`
	Deskripsi  string  `json:"deskripsi"`
	Stok       uint    `json:"stok"`
	FotoURL    string  `json:"foto_url"`
	CatalogID  uint    `json:"catalog_id"`
}