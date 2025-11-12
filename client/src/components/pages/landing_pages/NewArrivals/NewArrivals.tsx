
import { TProduct } from "@/types";
import ProductCard from "../../products/ProductCard/ProductCard";
import { getNewArrivals } from "@/services/newArrivals/newArrivals";


export default async function NewArrivals() {
  const products = await getNewArrivals();

  return (
    <section className="Container">
      <h2
        className="rounded text-[#D4A373] text-xl md:text-2xl lg:text-3xl 2xl:text-4xl p-4 font-light text-center mb-6"
      >
        New Arrivals
      </h2>
      <div className="rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-10">
          {products?.data?.result?.map((product : TProduct) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

