package models

// User merepresentasikan entitas pengguna untuk sistem autentikasi.
type User struct {
	ID       uint   `gorm:"primaryKey;autoIncrement"                  json:"id"`
	Nama     string `gorm:"type:varchar(100);not null"                json:"nama"`
	Email    string `gorm:"type:varchar(100);uniqueIndex;not null"    json:"email"`
	Password string `gorm:"type:varchar(255);not null"                json:"-"` // hash bcrypt, tidak dikirim ke client
}

// LoginRequest adalah struktur body request POST /api/auth/login.
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse adalah struktur response sukses login.
// Mengembalikan nama dan email agar frontend bisa menampilkan info pengguna.
type LoginResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Token   string `json:"token,omitempty"`
	Nama    string `json:"nama"`
	Email   string `json:"email"`
}
