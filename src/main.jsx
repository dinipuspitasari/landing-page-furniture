import { initThemeMode } from "flowbite-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeInit } from "../.flowbite-react/init.tsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeInit />
    <App />
  </StrictMode>,
);

// Menghapus dark mode inisialisasi paksa dari sistem
// initThemeMode();

// Memaksa menghapus class 'dark' di elemen HTML agar aplikasi selalu dalam versi Light Mode
if (typeof document !== "undefined") {
  document.documentElement.classList.remove("dark");
  // Menonaktifkan kemampuan sistem menambahkan ulang (opsional)
  localStorage.setItem("flowbite-theme-mode", "light");
}
