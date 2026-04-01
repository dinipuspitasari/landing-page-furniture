import { Card } from "flowbite-react";
import Images from "./Images";
import ButtonPrimary from "./ButtonPrimary";
import { HiShoppingCart } from "react-icons/hi";

export default function ProductCard({ image, title, price, bgColor, titleColor = "text-red-600", priceColor = "text-gray-700", onClick }) {
  return (
    <Card
      className="max-w-sm overflow-hidden rounded-3xl border-none p-0 shadow-sm transition-all hover:shadow-md"
      style={{ backgroundColor: bgColor }}
    >
      {/* gambar kotak */}
      <div className="aspect-square w-full overflow-hidden">
        <Images
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* deskripsi */}
      <div className="flex w-full items-center justify-between">
        <div>
          <h5 className={`font-display text-lg font-semibold ${titleColor}`}>
            {title}
          </h5>
          <p className={`text-sm ${priceColor}`}>{price}</p>
        </div>
        <ButtonPrimary onClick={onClick}>
          <HiShoppingCart className="h-5 w-5 text-amber-50" />
        </ButtonPrimary>
      </div>
    </Card>
  );
}
