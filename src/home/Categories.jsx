import Card from "../components/Card";

export default function Categories() {
  return (
    <section className="py-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display mb-10 text-center text-4xl font-bold text-red-700">
          Categories
        </h2>

        <div className="space-y-6">
          {/* Card 1 */}
          <Card
            title="Table lamps"
            description="Immerse yourself in a world of extraordinary light: lamps inspired by the shapes of the 80s combine art, coziness and a bit of nostalgia. Experiment with colors and shapes to create your own unique atmosphere."
            image="https://static.vecteezy.com/system/resources/thumbnails/010/881/294/small/retro-study-desk-lamp-3d-icon-illustration-png.png"
            bgColor="bg-[#f9d26b]"
          />

          {/* Card 2 */}
          <Card title="Furniture" bgColor="bg-[#b8d7e8]" />

          {/* Card 3 */}
          <Card title="Décor" bgColor="bg-[#4da394]" />

          {/* Card 4 */}
          <Card title="Accents" bgColor="bg-[#f7b5c8]" />
        </div>
      </div>
    </section>
  );
}
