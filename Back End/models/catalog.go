package models

// Catalog merepresentasikan kategori/katalog produk furniture.
// Digunakan admin sebagai pilihan dropdown saat menambah produk.
type Catalog struct {
	ID       uint      `gorm:"primaryKey;autoIncrement"        json:"id"`
	Nama     string    `gorm:"type:varchar(100);not null"      json:"nama"`
	Products []Product `gorm:"foreignKey:CatalogID"            json:"products,omitempty"`
}
