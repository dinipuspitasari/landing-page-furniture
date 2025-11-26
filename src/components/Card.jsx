import Images from "./Images";

export default function Card({
  title,
  description,
  image,
  bgColor = "bg-gray-200",
}) {
  return (
    <div
      className={`flex w-full items-center justify-between rounded-2xl p-5 border-t ${bgColor}`}
    >
      <div className="flex-1 pr-6">
        <h3 className="font-display mb-2 text-2xl font-semibold text-red-700">
          {title}
        </h3>
        {description && (
          <p className="text-sm leading-relaxed text-gray-700">{description}</p>
        )}
      </div>

      {image && (
        <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-[#c94135] p-3">
          <Images
            src={image}
            alt={title}
            className="h-full w-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
