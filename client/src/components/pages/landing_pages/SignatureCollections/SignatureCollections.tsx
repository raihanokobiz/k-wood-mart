import Image from "next/image";
import { getAllSubCategorys } from "@/services/subCategorys";
import { apiBaseUrl } from "@/config/config";

export default async function SignatureCollections() {
  const { data } = await getAllSubCategorys()



  return (
    <section className="Container">
      <h2
        className=" text-[#ed1c24] text-xl md:text-2xl lg:text-3xl 2xl:text-4xl p-4 font-light text-center mb-6"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Our Collections
      </h2>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data?.map((collection, idx) => (
            <div key={idx}>
              {/* Image Section */}
              <div className="relative overflow-hidden aspect-square group cursor-pointer">
                <Image
                  src={`${apiBaseUrl + collection?.image}`}
                  alt={collection.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 group-hover:bg-black/40 transition-colors" />
                <div className=" absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="cursor-pointer mt-4 px-6 py-2 bg-white text-amber-900 rounded-full text-sm font-medium hover:bg-amber-50 transition-colors">
                    View Collection
                  </button>
                </div>
              </div>
              {/* Name Section */}
              <h3 className="text-2xl font-light mt-4 text-center">{collection?.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
