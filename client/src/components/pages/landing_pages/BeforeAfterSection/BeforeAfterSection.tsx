"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import B1 from "../../../../assets/beforeAfter/B1.jpg";
import A1 from "../../../../assets/beforeAfter/A1.jpg";

export default function BeforeAfterSection() {
  const router = useRouter();
  return (
    <section className="Container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Furniture Section (After) */}
        <div
          onClick={() => router.push("/furniture")}
          className="relative group overflow-hidden cursor-pointer"
        >
          <div className="relative w-full h-[calc(100vh-80px)]">
            <Image
              src={A1}
              alt="Furniture"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Hover Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <h3 className="text-3xl md:text-4xl font-light mb-3 tracking-wide">
                Modern Furniture Elegance
              </h3>
              <p className="max-w-md text-sm md:text-base font-light leading-relaxed">
                Transform your space with our premium furniture — a blend of craftsmanship,
                comfort, and timeless beauty.
              </p>
              <button className="mt-6 px-6 py-2 bg-white text-gray-800 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                Explore Furniture
              </button>
            </div>
          </div>
        </div>

        {/* Curtain Section (Before) */}
        <div
          onClick={() => router.push("/curtain")}
          className="relative group overflow-hidden cursor-pointer"
        >
          <div className="relative w-full h-[calc(100vh-80px)]">
            <Image
              src={B1}
              alt="Curtain"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Hover Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <h3 className="text-3xl md:text-4xl font-light mb-3 tracking-wide">
                Elegant Curtain Designs
              </h3>
              <p className="max-w-md text-sm md:text-base font-light leading-relaxed">
                Discover bespoke curtain styles that add warmth, privacy, and elegance
                to your interiors.
              </p>
              <button className="mt-6 px-6 py-2 bg-white text-gray-800 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                Explore Curtains
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
