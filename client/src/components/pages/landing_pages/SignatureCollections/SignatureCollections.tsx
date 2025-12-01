import Image from "next/image";
import { getAllSubCategorys } from "@/services/subCategorys";
import { apiBaseUrl } from "@/config/config";
import Link from "next/link";

interface Collection {
  _id: string;
  name: string;
  slug: string;
  image: string;
  categoryRef?: {
    name?: string;
  };
  title?: string;
}


export default async function SignatureCollections() {
  const { data } = await getAllSubCategorys()

  return (
    <section className="Container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
        <div className="col-span-4"></div>
        <div className="col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.slice(0, 6).map((collection: Collection, idx: number) => {
            // Dynamic redirect logic
            const categoryName = collection?.categoryRef?.name?.toLowerCase() || "";
            const basePath = categoryName.includes("curtain")
              ? "/curtains"
              : "/furniture";

            return (
              <Link
                key={idx}
                href={`${basePath}?subCategory=${collection.slug}`}
                className="group block rounded-md"
              >
                <div className="relative overflow-hidden aspect-square cursor-pointer">
                  <Image
                    src={`${apiBaseUrl + collection?.image}`}
                    alt="image"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-md"
                  />
                  <div className="absolute inset-0 group-hover:bg-black/40 rounded-md transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className=" cursor-pointer mt-4 px-6 py-2 bg-white text-amber-900 rounded-full text-sm font-medium hover:bg-amber-50 transition-colors">
                          {collection?.name}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
