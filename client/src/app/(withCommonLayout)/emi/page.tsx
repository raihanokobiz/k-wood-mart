import NavBar from "@/components/pages/header/NavBar/NavBar";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";
import Link from "next/link";
import Pic from "./Pic";

const interestRates = [
  { termMonths: 3, interestRate: "0%" },
  { termMonths: 6, interestRate: "5%" },
  { termMonths: 9, interestRate: "8%" },
  { termMonths: 12, interestRate: "9%" },
];

export default async function page() {
  const user = await getUser();
  const userRef = user?.id;
  const coupon = "";
  const userCartProducts = await getCartProducts(userRef, coupon);

  return (
    <div>
      <NavBar userCartProducts={userCartProducts?.data} />
      {/* <div className="bg-[#1D4092] mt-20 w-full py-6 lg:flex hidden"></div> */}
      <div className="w-full bg-slate-600 py-16 lg:py-20 mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Financing Available
            </h2>
            <p className="text-blue-200 text-lg">
              Get 0% EMI through card payments
            </p>
          </div>

<<<<<<< HEAD

    return (
        <div>
            <NavBar userCartProducts={userCartProducts?.data} />
            {/* <div className="bg-[#1D4092] mt-20 w-full py-6 lg:flex hidden"></div> */}
            <div className="w-full bg-slate-600 py-16 lg:py-20 mt-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                            Financing Available
                        </h2>
                        <p className="text-blue-200 text-lg">
                            Get 0% EMI through card payments
                        </p>
                    </div>
                    {/* Interest Rates Card */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl">

                        {/* Table Header */}
                        <div className="bg-white/5 border-b border-white/20 py-4 px-6">
                            <h3 className="text-xl font-semibold text-white text-center">
                                Interest Rates
                            </h3>
                        </div>

                        {/* Rates Grid */}
                        <div className="grid grid-cols-4 divide-x divide-white/20">
                            {interestRates.map((rate, idx) => (
                                <div
                                    key={idx}
                                    className="text-center py-8 px-4 hover:bg-white/5 transition-colors"
                                >
                                    <p className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                        {rate.interestRate}
                                    </p>
                                    <p className="text-sm lg:text-base text-blue-200 font-medium">
                                        {rate.termMonths} Months
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shop Now Button */}
                    <div className="text-center mt-8">
                        <Link href="/furniture" className="bg-gray-600 hover:bg-gray-900 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>
            <div>
            </div>
=======
          {/* Interest Rates Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl">
            {/* Table Header */}
            <div className="bg-white/5 border-b border-white/20 py-4 px-6">
              <h3 className="text-xl font-semibold text-white text-center">
                Interest Rates
              </h3>
            </div>

            {/* Rates Grid */}
            <div className="grid grid-cols-4 divide-x divide-white/20">
              {interestRates.map((rate, idx) => (
                <div
                  key={idx}
                  className="text-center py-8 px-4 hover:bg-white/5 transition-colors"
                >
                  <p className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {rate.interestRate}
                  </p>
                  <p className="text-sm lg:text-base text-blue-200 font-medium">
                    {rate.termMonths} Months
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shop Now Button */}
          <div className="text-center mt-8">
            <Link
              href="/furniture"
              className="bg-gray-600 hover:bg-gray-900 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Shop Now
            </Link>
          </div>
>>>>>>> 1609d47f05288ec72dd972d77052d3967aef5c70
        </div>
      </div>
      <Pic />
    </div>
  );
}
