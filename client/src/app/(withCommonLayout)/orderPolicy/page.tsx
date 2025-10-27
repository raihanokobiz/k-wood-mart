import NavBar from "@/components/pages/header/NavBar/NavBar";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";
import Link from "next/link";
import React from "react";

const orderPolicy = async () => {
  const user = await getUser();
  const userId = user?.id;
  const coupon = "";
  const products = await getCartProducts(userId, coupon);
  return (
    <>
      <NavBar userCartProducts={products?.data} />
      <div className="Container py-10 ">
        <div className="">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-[#D4A373] mb-4">
              Delivery Options
            </h1>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  Regular Delivery
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <ol>Available Areas:</ol>
                  <li>Inside Dhaka</li>
                  <li>Dhaka Suburb</li>
                  <li>Outside Dhaka</li>
                  <li>
                    <strong> Order Cut-Off Time:</strong> 1:30 PM (On working
                    days, except Govt. holidays)
                  </li>
                  <ol>Delivery Fee:</ol>
                  <li>Inside Dhaka – BDT 60</li>
                  <li>Dhaka Suburb – BDT 60</li>
                  <li>Outside Dhaka – BDT 150</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  Payment Methods:
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Inside Dhaka – Online / Cash on Delivery (COD)</li>
                  <li>Dhaka Suburb – Online / COD</li>
                  <li>Outside Dhaka – Online / COD</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-2">Delivery Time: 2 to 7 working days</h2>

                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  Express Delivery (Next Working Day)
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Available Area: Inside Dhaka only</li>
                  <li>
                    Order Cut-Off Time: 11:00 AM (Orders placed after this will
                    be processed the next working day)
                  </li>
                  <li>Delivery Fee: BDT 300</li>
                  <li>Payment Method: Online only.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  Working Hours:
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Sunday to Thursday: 10:00 AM – 06:30 PM</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  Additional Delivery Information
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    Free Delivery: Orders above BDT 5000 (VAT excluded) qualify
                    for free delivery nationwide.
                  </li>
                  <li>
                    COD Limit: Cash on Delivery is not available for orders
                    above BDT 30,000 (VAT excluded).
                  </li>
                  <li>
                    Next Working Day Orders: Orders placed before 11:00 AM on
                    Thursday will be delivered the next day. Orders placed after
                    this time will be processed on Sunday at 9:30 AM.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  Exchange Policy
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    Eligible for Exchange: Only if the product is damaged or
                    broken upon delivery.
                  </li>
                  <li>
                    Exchange Request Timeframe: Must contact customer service
                    within 12 hours of delivery. After this period, no returns
                    or exchanges are allowed.
                  </li>
                  <li>
                    Customer Service Contact: +880 1735 775 093 (Sunday –
                    Thursday, 10:00 AM – 06:30 PM)
                  </li>
                  <li>
                    More Information: Visit{" "}
                    <Link
                      href="/returnPolicy"
                      className="underline text-[#D4A373] cursor-pointer hover:text-[red] duration-300"
                    >
                      Return & Refund Policy
                    </Link>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  Delivery Process
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    Quality Check: Each product is inspected before packaging.
                  </li>
                  <li>
                    Secure Packaging: Items are carefully packed using
                    protective materials. Fragile items are wrapped with bubble
                    wrap.
                  </li>
                  <li>
                    Delivery Partner: Once packed, the package is handed over to
                    a trusted delivery service.
                  </li>
                  <li>
                    Address Issues: If the delivery partner cannot reach you,
                    they will contact you to arrange a suitable time.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  Secure Delivery Policies
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <ol>
                    <strong>Closed Box Delivery:</strong>
                    <li>
                      Products are delivered in a sealed box to prevent
                      tampering.
                    </li>
                    <li>
                      The recipient can open the box only after payment is
                      completed.
                    </li>
                  </ol>
                  <ol>
                    <strong>OTP Verified Delivery:</strong>
                    <li>
                      A one-time password (OTP) is sent to the recipient’s
                      phone.
                    </li>
                    <li>
                      The recipient must provide the OTP to confirm delivery.
                    </li>
                  </ol>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default orderPolicy;
