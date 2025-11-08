
import Image from "next/image";
import N1 from "../../../../assets/kwoodmart/N1.jpg"
import ProductCard from "../../products/ProductCard/ProductCard";
import { getNewArrivals } from "@/services/newArrivals/newArrivals";

export default async function NewArrivals() {

  const products = await getNewArrivals()

  console.log(products, "ok");


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
          {products?.map((product, idx) => (
            <ProductCard
              key={idx}
              name={product.name}
              thumbnailImage={product.thumbnailImage}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
}



