
import Image from "next/image";
import N1 from "../../../../assets/kwoodmart/N1.jpg"
import ProductCard from "../../products/ProductCard/ProductCard";
import { getNewArrivals } from "@/services/newArrivals/newArrivals";
import { apiBaseUrl } from "@/config/config";

export default async function NewArrivals() {

  const products = await getNewArrivals()


  return (
    <section className="Container">
      <h2
        className="rounded text-[#ed1c24] text-xl md:text-2xl lg:text-3xl 2xl:text-4xl p-4 font-light text-center mb-6"
        style={{ fontFamily: "Georgia, serif" }}
      >
        New Arrivals
      </h2>
      <div className=" rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  2xl:grid-cols-4 gap-4">
          {products?.data?.result?.map((product, idx) => (
            <div
              key={idx}
              className="bg-white  text-center mb-8"
            >
              <div className=" relative h-[400px] mb-4">
                <Image
                  src={`${apiBaseUrl}${product?.thumbnailImage}`}
                  alt={product?.name}
                  fill
                  className="mx-auto mb-4"
                />
              </div>
              <div className="flex items-center justify-between text-xl font-medium text-secondary text-secondaryt p-4 ">
                <h3 className="">
                  {product?.name}
                </h3>
                <p className="" style={{ fontVariantNumeric: 'lining-nums' }}>
                  ৳ {product?.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



