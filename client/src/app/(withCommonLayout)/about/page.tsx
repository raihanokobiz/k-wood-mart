"use server";
import React from "react";
import aboutImage from "@/assets/logo/Noha.png";
import Image from "next/image";
import NavBar from "@/components/pages/header/NavBar/NavBar";
import { getCartProducts } from "@/services/cart";
import { getUser } from "@/services/auth";

const page = async () => {
  const user = await getUser();
  const userRef = user?.id;
  const coupon = "";
  const userCartProducts = await getCartProducts(userRef, coupon);
  return (
    <div>
      <NavBar userCartProducts={userCartProducts?.data} />
      {/* <div className="bg-[#1D4092] mt-20 w-full py-6 lg:flex hidden"></div> */}

      <div className="Container lg:py-6 lg:mt-0 mt-30 mb-40">
        <div className="border border-[#D4A373]/20 rounded md:p-2 p-4 inline-flex mt-2">
          <Image
            src={aboutImage}
            alt=""
            width={120}
            height={120}
            className="rounded"
          />
        </div>
        <div className="flex flex-col gap-2 lg:gap-4">
          <div className="md:text-xl text-lg  font-semibold text-[#262626] mt-8 ">
            Welcome to <span className="uppercase text-[#D4A373]">Nohasan</span>{" "}
            – a name born from the union of Noha and Hasan, and a brand built on
            trust, elegance, and authenticity.
          </div>

          <div>
            <p className="policy-page-text ">
              At <span className="uppercase text-[#D4A373]">Nohasan</span>, we
              are passionate about the art of fragrance. Our mission is to bring
              you 100% authentic perfumes sourced from globally renowned brands
              and trusted suppliers. Each scent in our collection is carefully
              curated to ensure quality, originality, and a lasting impression.
            </p>
          </div>

          <div>
            <p className="policy-page-text ">
              What began as a shared vision between husband and wife has grown
              into a commitment to provide our customers with a premium
              fragrance experience. We believe that a great perfume does more
              than smell good – it speaks of identity, mood, and memory.
            </p>
          </div>

          <div>
            <p className="policy-page-text ">
              We invite you to explore our selection and find your signature
              scent with confidence and ease.
            </p>
          </div>

          <div>
            <p className="policy-page-text ">
              <span className="uppercase text-[#D4A373]">Nohasan</span> –
              Authentic Scents. Honest Commitment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
