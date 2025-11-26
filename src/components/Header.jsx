import React, { useState } from "react";
import { FiSearch, FiHeart, FiBookmark, FiMenu, FiX } from "react-icons/fi";


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="sticky top-0 z-50 grid gap-4 rounded-full px-6 py-0 md:grid-cols-2 md:gap-4 md:px-0 bg-white md:bg-transparent">
      <div className="flex flex-col justify-between rounded-t-2xl md:bg-[#4da394] md:px-8">
        <header className="relative flex items-center justify-between py-4 md:bg-transparent">
          {/* left side */}
          <div className="flex items-center gap-6">
            <span className="px- flex h-8 w-8 items-center justify-center rounded-full bg-[#f6ebd8]/80 font-bold text-red-900 shadow-sm">
              R
            </span>
            <nav className="font-display hidden items-center gap-6 text-sm text-red-900 md:flex md:rounded-full md:bg-[#f6ebd8]/80 md:px-4 md:py-2">
              <a
                href="#"
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
          {/* burger menu mobile*/}
          <button
            className="rounded-full bg-[#bd4135] p-2 text-white transition hover:bg-red-500 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
          {/* mobile menu disini */}
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
    </section>
  );
}
