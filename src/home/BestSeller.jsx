import ProductCard from "../components/ProductCard";
import ButtonPrimary from "../components/ButtonPrimary";


export default function BestSellers() {
 const products = [
   {
     id: 1,
     title: "Lentera Lamp",
     price: "Rp. 1.000.000",
     image:
       "https://img.freepik.com/3d-models/v2/D/Z/F/8/L/2/S/DZF8L2SK/decorative-lamp-poster-1.png?t=st=1760692098~exp=1760695698~hmac=fae62603dca644d37e9a1273beb2c6bfc23417ca9f041be4de3dc050d24f7ecd",
     bgColor: "#F9E4C8",
   },
   {
     id: 2,
     title: "Speaker 401",
     price: "Rp. 1.200.000",
     image:
       "https://png.pngtree.com/png-vector/20240801/ourmid/pngtree-iconic-3d-volumetric-retro-speaker-for-audio-visuals-png-image_13325368.png",
     bgColor: "#D8E2DC",
   },
   {
     id: 3,
     title: "Wave Seat 1003",
     price: "$95",
     image:
       "https://png.pngtree.com/png-vector/20240810/ourmid/pngtree-3d-rendered-photo-of-chair-with-modern-look-png-image_13440470.png",
     bgColor: "#FFE5EC",
   },
   {
     id: 4,
     title: "Chair Shell 201S",
     price: "$120",
     image:
       "https://cdn3d.iconscout.com/3d/premium/thumb/sitting-chair-3d-icon-png-download-11442559.png",
     bgColor: "#80c6ba",
   },
   {
     id: 5,
     title: "Retro Lamp 204",
     price: "$75",
     image:
       "https://cdn.pixabay.com/photo/2016/03/27/19/55/table-lamp-1284505_640.png",
     bgColor: "#E2ECE9",
   },
   {
     id: 6,
     title: "Lumo Chair 500",
     price: "$110",
     image:
       "https://cdn.pixabay.com/photo/2014/04/02/10/56/chair-306844_640.png",
     bgColor: "#F8EDEB",
   },
 ];

  return (
    <section className="py-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display mb-6 text-3xl font-bold text-red-700">
          Best sellers
        </h2>

        {/* Container Scroll */}
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
          {products.map((item) => (
            <div key={item.id} className="w-64 flex-shrink-0 snap-start">
              <ProductCard
                image={item.image}
                title={item.title}
                price={item.price}
                bgColor={item.bgColor}
                onClick={() => alert(`Viewing ${item.title}`)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="pt-5 justify-items-end">
        <ButtonPrimary onClick={() => alert("Explore now")}>
          Explore now
        </ButtonPrimary>
      </div>
    </section>
  );
}
