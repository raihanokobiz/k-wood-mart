import Image from "next/image";
import S1 from "../../../../assets/signature/S1.jpg";
import S2 from "../../../../assets/signature/S2.jpg";
import S3 from "../../../../assets/signature/S3.jpg";

export default function SignatureCollections() {
  const collections = [
    {
      title: "Modern Living",
      image: S1,
      description: "Contemporary designs for the modern home",
    },
    {
      title: "Classic Bedroom",
      image: S2,
      description: "Timeless comfort and sophistication",
    },
    {
      title: "Curtain Gallery",
      image: S3,
      description: "Bespoke window designs",
    },
  ];

  return (
    <section className="py-4 md:px-6 lg:px-8">
      <h2
        className=" text-[#ed1c24] text-xl md:text-2xl lg:text-3xl 2xl:text-4xl p-4 font-light text-center mb-6"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Our Signature Collections
      </h2>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collections.map((collection, idx) => (
            <div
              key={idx}
              className="p-8 group relative overflow-hidden aspect-square cursor-pointer"
            >
              <Image
                src={collection.image || "/placeholder.svg"}
                alt={collection.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 group-hover:bg-black/40 transition-colors" />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-2xl font-light mb-2">{collection.title}</h3>
                <p className="text-sm text-center px-4">
                  {collection.description}
                </p>
                <button className="mt-4 px-6 py-2 bg-white text-amber-900 rounded-full text-sm font-medium hover:bg-amber-50 transition-colors">
                  View Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
