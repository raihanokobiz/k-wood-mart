import Image from "next/image";
import B1 from "../../../../assets/beforeAfter/B1.jpg";
import A1 from "../../../../assets/beforeAfter/A1.jpg";

export default function BeforeAfterSection() {
  return (
    <section className="pb-8 md:px-6 lg:px-8">
      <h2
        className="rounded text-[#ed1c24] text-xl md:text-2xl lg:text-3xl 2xl:text-4xl p-4 font-light text-center mb-6"
        style={{ fontFamily: "Georgia, serif" }}
      >
        See the Difference WoodMart Makes
      </h2>
      <div className="bg-gray-100 p-4 md:p-6 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="overflow-hidden">
            <div className="relative w-full h-[60vh] rounded-lg overflow-hidden">
              <Image
                src={B1}
                alt="Before"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-center text-xl lg:text-2xl mt-4 text-[#ed1c24] font-medium">
              Before
            </p>
          </div>

          <div className="overflow-hidden">
            <div className="relative w-full h-[60vh] rounded-lg overflow-hidden">
              <Image
                src={A1}
                alt="After"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-center text-xl lg:text-2xl mt-4 text-[#ed1c24] font-medium">
              After
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}