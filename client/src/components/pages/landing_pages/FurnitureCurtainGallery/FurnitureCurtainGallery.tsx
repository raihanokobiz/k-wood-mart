import React from 'react';

export default function FurnitureCurtainGallery() {
  return (
    <section className=" py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8">
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Collection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover premium furniture and elegant curtains to transform your living space
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Single Large Image */}
          <div className="relative group overflow-hidden shadow-xl h-screen">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"
              alt="Modern Living Room Furniture"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-3xl font-bold mb-2">Premium Furniture</h3>
                <p className="text-gray-200">Luxury sofas and modern designs</p>
              </div>
            </div>
          </div>

          {/* Right Column - Two Stacked Images */}
          <div className="flex flex-col gap-6 h-screen">
            {/* Top Image */}
            <div className="relative group overflow-hidden  shadow-xl flex-1">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"
                alt="Elegant Curtains"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold mb-1">Designer Curtains</h3>
                  <p className="text-gray-200 text-sm">Elegant window treatments</p>
                </div>
              </div>
            </div>

            {/* Bottom Image */}
            <div className="relative group overflow-hidden  shadow-xl flex-1">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
                alt="Bedroom Furniture & Decor"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold mb-1">Bedroom Collection</h3>
                  <p className="text-gray-200 text-sm">Complete bedroom solutions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            Explore Our Collection
          </button>
        </div>
      </div>
    </section>
  );
}