import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
// appType: 'spa' (default) sudah menangani fallback ke index.html untuk semua route.
// Tidak perlu konfigurasi tambahan untuk routing berbasis pathname.
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
});
