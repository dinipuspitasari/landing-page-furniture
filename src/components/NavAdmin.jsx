import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";

export default function NavAdmin() {
  return (
    <Navbar fluid rounded className="md:rounded-full">
      {/* ── Kiri: Logo ── */}
      <NavbarBrand>
        <h1 className="font-display mx-3 text-center text-4xl font-bold text-[#bd4135] italic">
          Radi
        </h1>
      </NavbarBrand>

      {/* ── Kanan: Link navigasi (desktop) + Avatar + Toggle (mobile) ── */}
      <div className="flex items-center gap-3 md:order-2">
        {/* Link navigasi — hanya tampil di desktop (md+) */}
        <nav className="hidden items-center gap-1 md:flex">
          <a
            href="/admin"
            className="rounded-full px-3 py-1.5 text-sm font-bold text-[#bd4135] transition hover:bg-[#f6ebd8]"
          >
            Dashboard
          </a>
          <a
            href="/admin/catalog"
            className="rounded-full px-3 py-1.5 text-sm font-bold text-[#bd4135] transition hover:bg-[#f6ebd8]"
          >
            Katalog
          </a>
          <a
            href="/admin/products"
            className="rounded-full px-3 py-1.5 text-sm font-bold text-[#bd4135] transition hover:bg-[#f6ebd8]"
          >
            Produk
          </a>
          <a
            href="#"
            className="rounded-full px-3 py-1.5 text-sm font-bold text-[#bd4135] transition hover:bg-[#f6ebd8]"
          >
            Riwayat Pembelian
          </a>
        </nav>

        {/* Divider visual (desktop) */}
        <div className="hidden h-6 w-px bg-[#bd4135]/20 md:block" />

        {/* Avatar Dropdown */}
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
            />
          }
        >
          <DropdownHeader className="font-bold text-[#bd4135]">
            <span className="block text-sm">
              {localStorage.getItem("admin_nama")}
            </span>
            <span className="block truncate text-sm font-medium">
              {localStorage.getItem("admin_email")}
            </span>
          </DropdownHeader>
          <DropdownItem onClick={() => (window.location.href = "/admin")}>
            Dashboard
          </DropdownItem>
          <DropdownItem
            onClick={() => (window.location.href = "/admin/add-product")}
          >
            Tambah Produk
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem>
            <button
              onClick={() => {
                localStorage.removeItem("admin_token");
                localStorage.removeItem("admin_nama");
                localStorage.removeItem("admin_email");
                window.location.href = "/";
              }}
            >
              Log Out
            </button>
          </DropdownItem>
        </Dropdown>

        {/* Hamburger toggle — hanya tampil di mobile */}
        <NavbarToggle />
      </div>

      {/* ── Menu mobile (muncul saat hamburger diklik) ── */}
      <NavbarCollapse className="md:hidden">
        <NavbarLink href="/admin" className="font-bold text-[#bd4135]">
          Dashboard
        </NavbarLink>
        <NavbarLink href="/admin/catalog" className="font-bold text-[#bd4135]">
          Katalog
        </NavbarLink>
        <NavbarLink
          href="/admin/products"
          className="font-bold text-[#bd4135]"
        >
          Produk
        </NavbarLink>
        <NavbarLink href="/" className="font-bold text-[#bd4135]">
          Riwayat Pembelian
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
