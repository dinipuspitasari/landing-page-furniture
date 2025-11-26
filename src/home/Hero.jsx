import ButtonPrimary from "../components/ButtonPrimary";

export default function Hero() {
  return (
    <section className="grid gap-4 px-6 py-5 md:grid-cols-2 md:px-0 md:py-0">
      {/* kiri */}
      <div className="flex flex-col justify-center space-y-6 bg-[#4da394] px-5 py-5 md:rounded-b-2xl md:px-20">
        <h1 className="font-display text-center text-8xl font-bold text-[#bd4135] italic">
          Radi
        </h1>
        <p className="text-gray-900-800 font-body max-w-md leading-relaxed">
          Choose from a collection of stylish retro accents or create your own
          unique model with different colors and shapes.
        </p>
        <ButtonPrimary>Catalog</ButtonPrimary>
      </div>

      {/* kanan */}
      <div className="flex items-center justify-center bg-[#bd4135] p-6 md:rounded-b-2xl">
        <div className="md:px- grid w-full grid-cols-3 gap-1 rounded-2xl bg-[#f6ebd8]">
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/table-3d-icon-png-download-11442551.png"
            alt="chair"
            className="mx-auto h-30 w-30"
          />
          <img
            src="https://png.pngtree.com/png-clipart/20231015/original/pngtree-lamp-illustration-3d-png-image_13301357.png"
            alt="lamp"
            className="mx-auto h-30 w-30"
          />
          <img
            src="https://png.pngtree.com/png-clipart/20250823/original/pngtree-blue-speaker-3d-decoration-png-image_21194872.png"
            alt="chair"
            className="mx-auto h-30 w-30"
          />
          <img
            src="https://www.mediterraneadesign.com/cdn/shop/files/ischia-miniature-mediterranea-2-3D-Printed-Furniture-Chair.png?v=1701335343"
            alt="chair"
            className="mx-auto h-30 w-30"
          />
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/round-table-3d-icon-png-download-10138084.png"
            alt="lamp"
            className="mx-auto h-30 w-30"
          />
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/auditorium-chair-3d-icon-png-download-7693591.png"
            alt="chair"
            className="mx-auto h-30 w-30"
          />
          <img
            src="https://png.pngtree.com/png-clipart/20210309/original/pngtree-3d-red-leather-of-chair-02-png-image_5870689.png"
            alt="chair"
            className="mx-auto h-30 w-30"
          />
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/028/233/969/small/lamp-3d-rendering-icon-illustration-free-png.png"
            alt="lamp"
            className="mx-auto h-30 w-30"
          />
          <img
            src="https://www.elte.com/cdn/shop/files/125225002000_1_3be4ee36-6b0d-442c-90e8-7fdc453fc3c1_1200x1200.png?v=1753876462"
            alt="chair"
            className="mx-auto h-30 w-30"
          />
        </div>
      </div>
    </section>
  );
}
