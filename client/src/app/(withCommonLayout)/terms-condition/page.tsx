import NavBar from "@/components/pages/header/NavBar/NavBar";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";
import React from "react";

const TermCondition = async () => {
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
              Terms & Conditions
            </h1>
            <p className="mb-6 text-gray-600">
              Welcome to <strong>Nohasan</strong>! By using this website (the
              "Site"), you agree to these Terms & Conditions. If you do not
              agree, please do not use the Site.
              <br />
              Nohasan is an online beauty and personal care store that offers
              high-quality products, including perfumes, skincare, and wellness
              essentials.
              <br />
              We may update these Terms at any time without prior notice.
              Continued use of the Site after changes are posted means you
              accept the updated Terms.
            </p>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  1. Your Account
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    To purchase from Nohasan, you may need to create an account
                    and provide personal details.
                  </li>
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your account and password.
                  </li>
                  <li>
                    If you suspect unauthorized access, notify us immediately.
                  </li>
                  <li>
                    We reserve the right to suspend or terminate accounts at our
                    discretion.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  2. Privacy & Data Protection
                </h2>
                <p>
                  Your use of the Site is also governed by our Privacy Policy,
                  which explains how we collect, store, and use your personal
                  information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  3. Orders & Payments
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    All orders placed through Nohasan are subject to
                    availability and confirmation.
                  </li>
                  <li>
                    We reserve the right to refuse or cancel any order due to
                    stock limitations, pricing errors, or fraudulent activity.
                  </li>
                  <li>
                    Accepted payment methods will be displayed at checkout.
                  </li>
                  <li>
                    If your payment is declined, your order will not be
                    processed.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  4. Product Availability & Description
                </h2>
                <p>
                  We aim to ensure all product details, descriptions, and prices
                  are accurate. However, errors may occur, and we reserve the
                  right to correct them.
                </p>
                <p>
                  Product images are for illustration purposes only; actual
                  product packaging may vary.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  5. Shipping & Delivery
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    Orders are shipped via trusted couriers, and estimated
                    delivery times will be provided at checkout.
                  </li>
                  <li>
                    Delivery times may vary due to unforeseen circumstances.
                  </li>
                  <li>
                    Any shipping delays caused by third-party couriers are
                    beyond our control.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  6. Returns & Refunds
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    <strong>Returns:</strong> Only unused, sealed items may be
                    returned within 7 days of delivery.
                  </li>
                  <li>
                    <strong>Refunds:</strong> If approved, refunds will be
                    processed within 7–10 business days via the original payment
                    method.
                  </li>
                  <li>
                    For more details, refer to our Return & Refund Policy.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  7. Image Disclaimer
                </h2>
                <p>
                  Product images on our Site are for reference only. Color,
                  packaging, and appearance may vary due to lighting, screen
                  resolution, and manufacturing changes.
                </p>
                <p>
                  Models or individuals shown in images do not guarantee the
                  same results for all users.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  8. Limitation of Liability
                </h2>
                <p>
                  We are not responsible for allergic reactions or adverse
                  effects caused by our products. Always check ingredient lists
                  before use.
                </p>
                <p>
                  Nohasan is not liable for any indirect or incidental damages
                  resulting from the use of our products or services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  9. Termination
                </h2>
                <p>
                  We reserve the right to terminate your account or restrict
                  access to the Site at any time without notice.
                </p>
                <p>
                  If you have any questions, please contact our customer support
                  team.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermCondition;
