
import ProductCard from "../../products/ProductCard/ProductCard";
import { getFeaturedProducts } from "@/services/products";
import { TProduct } from "@/types";


export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="Container">
      <h2 className="rounded text-[#D4A373] text-xl md:text-2xl lg:text-3xl 2xl:text-4xl p-4 font-light text-center mb-6">
        Featured Products
      </h2>
      <div className="rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-10">
          {products?.data?.result?.map((product: TProduct) => (
            <ProductCard
              key={product?._id}
              product={product}
            />
          ))}
        </div>
        {/* {products.map((product, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md shadow-gray-400 rounded  text-center hover:shadow-lg transition-shadow"
            >
              <div className=" relative h-[400px] mb-4">
                <Image
                  src="https://cdn.pixabay.com/photo/2022/07/05/14/59/living-room-7303275_640.jpg"
                  alt={product.name}
                  fill
                  className="mx-auto mb-4"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-secondary text-left px-4">
                {product.name}
              </h3>
              <p className="text-base text-secondary text-right px-8 pb-4" style={{ fontVariantNumeric: 'lining-nums' }}>
                ৳ {product.price}
              </p>
            </div>
          ))} */}
      </div>
    </section>
  );
}
