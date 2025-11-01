
import Image from "next/image";
import N1 from "../../../../assets/kwoodmart/N1.jpg"
import ProductCard from "../../products/ProductCard/ProductCard";

export default function NewArrivals() {

  const products = [
    {
      name: "Oak Wood Chair",
      image: N1,
      price: 120, // price in USD or your currency
    },
    {
      name: "Velvet Sofa",
      image: N1,
      price: 450,
    },
  ];


  return (
    <section className="pb-4 md:px-6 lg:px-8">
      <h2
        className="rounded text-[#ed1c24] text-xl md:text-2xl lg:text-3xl 2xl:text-4xl p-4 font-light text-center mb-6"
        style={{ fontFamily: "Georgia, serif" }}
      >
        New Arrivals
      </h2>
      <div className="bg-gray-100 p-4 md:p-6 lg:p-10 rounded">
        <div className="grid grid-cols-1 md:grid-cols-2  2xl:grid-cols-4 gap-4">
          {products.map((product, idx) => (
            <ProductCard
              key={idx}
              name={product.name}
              image={product.image}
              price={product.price}
            />
          ))}
          {products.map((product, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md shadow-gray-400 rounded  text-center hover:shadow-lg transition-shadow"
            >
              <div className=" relative h-[400px] mb-4">
                <Image
                  src={product.image}
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
          ))}
        </div>
      </div>
    </section>
  );
}



