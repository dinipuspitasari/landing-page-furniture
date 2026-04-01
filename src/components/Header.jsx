import React, { useState, useEffect } from "react";
import { FiSearch, FiHeart, FiBookmark, FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Deteksi apakah sedang di halaman home ("/")
  const isHome = window.location.pathname === "/";

  // Saat bukan di home, header SELALU jadi satu warna.
  // Saat di home, header jadi satu warna HANYA ketika discroll.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const useSolidColor = !isHome || isScrolled;

  return (
    <section
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        useSolidColor
          ? "flex items-center justify-between bg-[#4da394] px-6 py-3 shadow-md md:rounded-b-2xl md:px-10"
          : "grid gap-4 bg-white px-6 py-0 md:grid-cols-2 md:gap-4 md:bg-transparent md:px-0"
      }`}
    >
      {useSolidColor ? (
        // ==========================================
        // SINGLE COLOR VIEW (Pages != home OR Scrolled)
        // ==========================================
        <>
          <div className="flex items-center gap-6">
            <a href="/">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6ebd8]/80 font-bold text-[#bd4135] shadow-sm">
                R
              </span>
            </a>
            <nav className="font-display hidden items-center gap-6 text-sm font-medium text-[#bd4135] md:flex md:rounded-full md:bg-[#f6ebd8]/80 md:px-4 md:py-2 ">
              <a
                href="/products"
                className="transition hover:text-red-500 hover:underline"
              >
                Catalog
              </a>
              <a
                href="#"
                className="transition hover:text-red-500 hover:underline"
              >
                Designs
              </a>
              <a
                href="#"
                className="transition hover:text-red-500 hover:underline"
              >
                About
              </a>
              <a
                href="#"
                className="transition hover:text-red-500 hover:underline"
              >
                Journal
              </a>
              <a
                href="#"
                className="transition hover:text-red-500 hover:underline"
              >
                Contact
              </a>
            </nav>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button className="rounded-full bg-[#f6ebd8]/50 p-2 text-[#bd4135] transition hover:bg-[#f6ebd8]">
              <FiSearch size={18} />
            </button>
            <button className="rounded-full bg-[#f6ebd8]/50 p-2 text-[#bd4135] transition hover:bg-[#f6ebd8]">
              <FiHeart size={18} />
            </button>
            <button className="rounded-full bg-[#f6ebd8]/50 p-2 text-[#bd4135] transition hover:bg-[#f6ebd8]">
              <FiBookmark size={18} />
            </button>
          </div>

          <button
            className="rounded-full bg-[#bd4135] p-2 text-white transition hover:bg-red-600 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </>
      ) : (
        // ==========================================
        // SPLIT COLOR VIEW (Home at top)
        // ==========================================
        <>
          <div className="flex flex-col justify-between rounded-t-2xl md:bg-[#4da394] md:px-8">
            <header className="relative flex items-center justify-between py-4 md:bg-transparent">
              {/* left side */}
              <div className="flex items-center gap-6">
                <a href="/">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6ebd8]/80 font-bold text-red-900 shadow-sm">
                    R
                  </span>
                </a>
                <nav className="font-display hidden items-center gap-6 text-sm text-red-900 md:flex md:rounded-full md:bg-[#f6ebd8]/80 md:px-4 md:py-2">
                  <a
                    href="/products"
                    className="transition hover:text-red-600 hover:underline"
                  >
                    Catalog
                  </a>
                  <a
                    href="#"
                    className="transition hover:text-red-600 hover:underline"
                  >
                    Designs
                  </a>
                  <a
                    href="#"
                    className="transition hover:text-red-600 hover:underline"
                  >
                    About
                  </a>
                  <a
                    href="#"
                    className="transition hover:text-red-600 hover:underline"
                  >
                    Journal
                  </a>
                  <a
                    href="#"
                    className="transition hover:text-red-600 hover:underline"
                  >
                    Contact
                  </a>
                </nav>
              </div>
              <button
                className="rounded-full bg-[#bd4135] p-2 text-white transition hover:bg-red-500 md:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            </header>
          </div>

          <div className="hidden items-start justify-start rounded-t-2xl bg-[#bd4135] p-4 md:flex md:p-0 md:pl-0">
            <div className="flex h-full w-full items-center justify-end pe-5">
              <div className="flex items-center gap-3 py-4 pl-4 md:pl-0">
                <button className="rounded-full bg-[#f6ebd8]/80 p-2 text-[#bd4135] transition hover:bg-white/50">
                  <FiSearch size={16} />
                </button>
                <button className="rounded-full bg-[#f6ebd8]/80 p-2 text-[#bd4135] transition hover:bg-white/50">
                  <FiHeart size={16} />
                </button>
                <button className="rounded-full bg-[#f6ebd8]/80 p-2 text-[#bd4135] transition hover:bg-white/50">
                  <FiBookmark size={16} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==========================================
          MOBILE BURGER MENU
      ========================================== */}
      {menuOpen && (
        <div
          className={`absolute top-full left-0 z-50 flex w-full flex-col items-center gap-5 border-t bg-white py-6 shadow-xl md:hidden`}
        >
          <a
            href="/products"
            className="font-display text-lg font-medium text-red-900 hover:text-red-500"
          >
            Catalog
          </a>
          <a
            href="#"
            className="font-display text-lg font-medium text-red-900 hover:text-red-500"
          >
            Designs
          </a>
          <a
            href="#"
            className="font-display text-lg font-medium text-red-900 hover:text-red-500"
          >
            About
          </a>
          <a
            href="#"
            className="font-display text-lg font-medium text-red-900 hover:text-red-500"
          >
            Journal
          </a>
          <a
            href="#"
            className="font-display text-lg font-medium text-red-900 hover:text-red-500"
          >
            Contact
          </a>
          <div className="mt-2 flex gap-4">
            <button className="rounded-full bg-[#f6ebd8] p-3 text-[#bd4135]">
              <FiSearch size={22} />
            </button>
            <button className="rounded-full bg-[#f6ebd8] p-3 text-[#bd4135]">
              <FiHeart size={22} />
            </button>
            <button className="rounded-full bg-[#f6ebd8] p-3 text-[#bd4135]">
              <FiBookmark size={22} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
