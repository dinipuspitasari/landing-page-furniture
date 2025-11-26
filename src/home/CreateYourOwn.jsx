import { Card } from "flowbite-react";
import ButtonPrimary from "../components/ButtonPrimary";
import Images from "../components/Images";

export default function CreateYourOwn() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl">
        <Card className="rounded-3xl border-none bg-[#fbe4a3] p-8 shadow-sm">
          <div className="mb-6 flex items-start justify-between">
            <h2 className="font-display text-4xl leading-tight font-bold text-red-700">
              Create your own armchair <br /> or coffee table
            </h2>

            <ButtonPrimary>Start creating</ButtonPrimary>
          </div>

          {/* grid */}
          <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* kiri */}
            <div className="flex h-full flex-col">
              <p className="mb-4 max-w-md text-sm text-gray-700">
                Create a unique accent for your space by choosing the shape,
                color and style. Make it truly yours!
              </p>

              <div className="flex flex-grow items-center justify-center rounded-3xl bg-[#fde7e1] p-6">
                <div className="flex items-center justify-center gap-6">
                  <Images
                    src="https://cdn3d.iconscout.com/3d/premium/thumb/chair-3d-icon-png-download-11402741.png"
                    alt="Chair"
                    className="h-40 w-40 object-contain"
                  />
                  <Images
                    src="https://png.pngtree.com/png-clipart/20230611/ourmid/pngtree-a-royal-round-table-perspective-view-png-image_7134219.png"
                    alt="Mini table"
                    className="h-32 w-32 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* kanan */}
            <div className="h-full overflow-hidden rounded-3xl">
              <Images
                src="/src/img/woman.jpg"
                alt="Model"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
