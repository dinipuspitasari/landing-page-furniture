import Images from "../components/Images";

export default function CreatingStyle() {
  return (
    <section className="w-full py-10">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        {/* kiri */}
        <div>
          <Images
            src="https://img.freepik.com/premium-psd/medium-shot-woman-posing-studio_23-2150074050.jpg"
            alt="Model Style"
            className="h-[400px] w-full rounded-2xl object-cover"
          />
        </div>

        {/* kanan */}
        <div className="flex flex-col space-y-6">
          <h2 className="text-4xl leading-tight font-bold text-red-700">
            Creating a style
          </h2>

          <p className="leading-relaxed text-gray-700">
            At Raya, we help you craft your perfect space with bold, unique
            design pieces. From retro accents to modern vibes, our collection
            brings your vision to life. Let’s create something special for your
            home.
          </p>

          <Images
            src="https://cdn3d.iconscout.com/3d/premium/thumb/auditorium-chair-3d-icon-png-download-7693591.png"
            alt="Chair"
            className="h-[260px] w-full rounded-2xl bg-[#d3e4ed] object-contain p-4"
          />

          
        </div>
      </div>
    </section>
  );
}
