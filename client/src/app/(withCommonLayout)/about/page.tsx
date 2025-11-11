"use server";

import React from "react";
import Image from "next/image";
import NavBar from "@/components/pages/header/NavBar/NavBar";
import aboutImage from "@/assets/logo/Logo.png";
import { getCartProducts } from "@/services/cart";
import { getUser } from "@/services/auth";
import AboutBanner from "@/assets/about/A1.jpg";

const AboutPage = async () => {
  const user = await getUser();
  const userRef = user?.id;
  const coupon = "";
  const userCartProducts = await getCartProducts(userRef, coupon);

  const aboutCards = [
    {
      icon: "🏠",
      title: "About Us",
      text: "K WOOD MART is a modern furniture and curtain brand combining craftsmanship, comfort, and elegant design for homes and offices.",
    },
    {
      icon: "📖",
      title: "Our Story",
      text: "Founded with a passion for quality and sustainability, every piece we create is designed to make your home stylish and comfortable.",
    },
    {
      icon: "✨",
      title: "What We Do",
      text: "We design, craft, and deliver premium furniture and curtains — including custom pieces tailored to your lifestyle and space.",
    },
    {
      icon: "🏆",
      title: "Quality & Craftsmanship",
      text: "Each product is made from durable, high-quality materials to ensure both beauty and long-lasting comfort.",
    },
    {
      icon: "🌱",
      title: "Sustainability",
      text: "We focus on eco-friendly production and responsibly sourced materials — because style should care for nature too.",
    },
    {
      icon: "💝",
      title: "Customer Care",
      text: "Our team ensures smooth ordering, customization, and support — every step built around your satisfaction.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      <NavBar userCartProducts={userCartProducts?.data} />
      {/* Banner Section */}
      <section className="relative h-[60vh] flex flex-col justify-center items-center text-center overflow-hidden pt-20">
        <Image
          src={AboutBanner}
          alt="About Banner"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 px-4">
          <div className="flex justify-center mb-6">
            <div className="bg-white/90 w-28 h-28 md:w-20 md:h-20  backdrop-blur-sm p-3 rounded-xl shadow-2xl">
              <Image
                src={aboutImage}
                alt="K Wood Mart Logo"
                fill
                className="rounded-lg"
              />
            </div>
          </div>
          <h1 className="text-xl md:text-3xl lg:text-5xl font-bold text-white drop-shadow-2xl mb-3">
            Welcome to{" "}
            <span className="text-[#D4A373]">K WOOD MART</span>
          </h1>
          <p className="text-gray-100 text-lg md:text-xl font-medium drop-shadow-lg">
            Crafting Comfort. Designing Dreams.
          </p>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="md:max-w-7xl mx-auto py-16 md:py-20 px-4 md:px-6 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {aboutCards.map((card, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm border border-[#D4A373]/20 rounded-xl p-6 shadow-md hover:shadow-md hover:scale-101 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-bold text-[#262626] mb-3">
                {card.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;