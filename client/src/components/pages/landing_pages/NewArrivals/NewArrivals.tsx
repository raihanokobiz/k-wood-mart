
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
      <div className=" rounded">
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
            <ProductCard
              key={idx}
              name={product.name}
              image={product.image}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </section>
  );
}



