import { Footer as FlowbiteFooter } from "flowbite-react";

export default function AppFooter() {
  return (
    <footer className="rounded-2xl border-t bg-[#bd4135]">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row">
          <p className="text-sm text-white">
            © {new Date().getFullYear()} Radi — All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-white">
            <a href="#" className="hover:text-[#4da394]">
              Privacy
            </a>
            <a href="#" className="hover:text-[#4da394]">
              Terms
            </a>
            <a href="#" className="hover:text-[#4da394]">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
