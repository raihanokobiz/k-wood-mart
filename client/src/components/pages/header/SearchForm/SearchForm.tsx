"use client";

import { apiBaseUrl } from "@/config/config";
import { getSearchProducts } from "@/services/products";
import { TProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { GoSearch } from "react-icons/go";

interface ResponsiveSearchFormProps {
  onClose: () => void;
}

const SearchForm: React.FC<ResponsiveSearchFormProps> = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const { data } = await getSearchProducts({ search: query });
        setProducts(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce delay

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="flex flex-col items-center gap-6">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="2xl:w-[60vh] xl:w-[50vh] lg:w-[38vh] w-[52vh] border relative border-[#262626]/50 flex items-center justify-between px-4 py-2 rounded"
      >
        <input
          className="outline-none w-full"
          type="text"
          placeholder="Eau De Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">
          <GoSearch className="text-xl text-[#262626]/50 font-semibold" />
        </button>
      </form>

      {query.trim() && (
        <div className="w-full xl:w-[65%] lg:w-[50%] absolute lg:top-[80px] top-[160px] flex flex-col gap-2 bg-[#fff] rounded p-8 border border-[#262626]/10 shadow">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : products.length > 0 ? (
            products.slice(0, 12).map((product) => (
              <div key={product._id} onClick={() => setQuery("")}>
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {product.thumbnailImage && (
                    <Image
                      src={apiBaseUrl + product.thumbnailImage}
                      alt="image"
                      width={30}
                      height={30}
                      className="rounded"
                    />
                  )}
                  <p className="text-base capitalize hover:underline duration-300">
                    {product.name}
                  </p>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchForm;
