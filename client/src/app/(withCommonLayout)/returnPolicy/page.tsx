import NavBar from "@/components/pages/header/NavBar/NavBar";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";
import React from "react";

const ReturnPolicy = async () => {
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
              Return & Exchange Policy
            </h1>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  1. When You Can Return or Exchange a Product:
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>If the product is physically damaged.</li>
                  <li>If you received the wrong quantity of items.</li>
                  <li>
                    If you received a different variant from what you ordered.
                    You must check the product in front of the delivery person.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  2. Items That Cannot Be Returned or Exchanged:
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>If the product was misused or overused.</li>
                  <li>If you lost the invoice.</li>
                  <li>
                    If the original packaging (tags, labels, accessories, etc.)
                    is missing or damaged.
                  </li>
                  <li>If the serial number is tampered with.</li>
                  <li>If the product is used or altered.</li>
                  <li>Returns are not accepted for change of mind.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  3. Return & Exchange Process:
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    Check your product upon delivery and report any issues
                    immediately.
                  </li>
                  <li>
                    Call our customer experience team with your name and order
                    ID to resolve the issue quickly.
                  </li>
                  <li>
                    If a problem is found after the delivery person leaves, no
                    claims will be accepted.
                  </li>
                  <li>
                    If you want to exchange a product after delivery, you must
                  </li>
                  <li>
                    Keep the product intact and bubble-wrapped in its original
                    packaging.
                  </li>
                  <li>
                    Contact our customer experience team for an exchange
                    request.
                  </li>
                  <li>
                    Our logistics partner will pick up the product from you.
                  </li>
                  <li>
                    After assessment, if the product is exchangeable, we will
                    send the replacement.
                  </li>
                  <li>
                    You will need to pay the return and exchange delivery
                    charges.
                  </li>
                  <li>
                    If exchanging in a physical store, bring the hard copy of
                    the invoice and make sure the product is intact with price
                    tags and barcodes.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  4. For Online Payment Orders:
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    If canceled before shipment, you will receive a refund
                    (excluding shipping costs) within 7-10 working days.
                  </li>
                  <li>Shipping charges are non-refundable.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  5. Contact Us for Returns & Exchanges:
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    Call: +880 1735 775 093 (Sunday to Friday, 9:30 AM - 6:30
                    PM)
                  </li>
                  <li>Email: support@nohasan.com</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  6. Product-Specific Return Policies
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    <strong>Makeup, Skincare, and Fragrances:</strong>
                  </li>
                  <li>No return or refund for change of mind.</li>
                  <li>
                    If the item is damaged, defective, incorrect, or incomplete,
                    you can request a return.
                  </li>
                  <li>Used or opened items cannot be returned.</li>
                  <li>Niche products are non-returnable.</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReturnPolicy;
