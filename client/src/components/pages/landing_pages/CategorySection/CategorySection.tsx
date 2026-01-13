import { apiBaseUrl } from "@/config/config";
import { getAllCategorys } from "@/services/categorys";
import Link from "next/link";

export default async function CategorySection() {
    const { data: categories } = await getAllCategorys();

    // Check if categories exists and is an array
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return null; // or return a loading/empty state
    }

    // Map actual category data with fallback titles and descriptions
    const categoriesList = categories.slice(0, 2).map((category) => {
        const isFurniture = category.name.toLowerCase() === 'furniture';

        return {
            _id: category._id,
            name: category.name,
            slug: category.slug || category.name.toLowerCase(),
            image: apiBaseUrl + category.image,
            title: isFurniture
                ? 'Premium Furniture Collection'
                : 'Luxury Curtains & Drapes',
            description: isFurniture
                ? 'Discover handcrafted furniture that combines elegance with functionality for your dream home'
                : 'Elevate your interior with our exquisite curtain designs that blend style and sophistication'
        };
    });


    return (
        <section className="Container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {categoriesList.map((item) => {
                    const isFurniture = item.name.toLowerCase() === 'furniture';

                    return (
                        <Link
                            href={`/${item.slug}`}
                            key={item._id}
                            className="relative group rounded overflow-hidden hover:shadow-md transition-all duration-500 h-[50vh] md:h-[80vh] 2xl:h-[700px] block"
                        >
                            {/* Background Image with Gradient Overlay */}
                            <div className="absolute inset-0">
                                <div
                                    className="w-full h-full bg-cover bg-center transition-opacity duration-700"
                                    style={{ backgroundImage: `url(${item.image})` }}
                                />
                            </div>
                            {/* Animated Background Pattern */}
                            <div className="absolute inset-0 bg-black/30">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] group-hover:scale-150 transition-transform duration-1000" />
                            </div>
                            {/* Content */}
                            <div className="relative h-full flex flex-col justify-between p-8 md:p-10">
                                {/* Category Badge */}
                                <div className="flex justify-between items-start">
                                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase ${isFurniture
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                        }`}>
                                        {item.name}
                                    </span>
                                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                        <svg
                                            className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Main Content */}
                                <div className="space-y-4 transform group-hover:translate-y-[-10px] transition-transform duration-500">
                                    <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                        {isFurniture ? (
                                            <>
                                                Premium Furniture
                                                <br />
                                                <span className="text-amber-400">Collection</span>
                                            </>
                                        ) : (
                                            <>
                                                Luxury Curtains
                                                <br />
                                                <span className="text-blue-400">& Drapes</span>
                                            </>
                                        )}
                                    </h3>

                                    <p className="text-white text-base md:text-lg leading-relaxed max-w-md opacity-90">
                                        {item.description}
                                    </p>

                                    {/* CTA Button */}
                                    <span
                                        className={`group/btn inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-gray-900 transition-all duration-300 group-hover:gap-4 ${isFurniture
                                            ? 'bg-gradient-to-r from-amber-400 to-amber-500 group-hover:from-amber-500 group-hover:to-amber-600'
                                            : 'bg-gradient-to-r from-blue-400 to-blue-500 group-hover:from-blue-500 group-hover:to-blue-600'
                                            }`}
                                    >
                                        <span>Explore {item.name}</span>
                                        <svg
                                            className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </span>
                                </div>

                                {/* Bottom Decorative Line */}
                                <div className={`h-1 w-20 rounded-full group-hover:w-32 transition-all duration-500 ${isFurniture ? 'bg-amber-500' : 'bg-blue-500'
                                    }`} />
                            </div>

                            {/* Shine Effect on Hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section >
    );
}