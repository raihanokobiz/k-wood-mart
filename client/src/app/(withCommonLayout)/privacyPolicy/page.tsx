import NavBar from "@/components/pages/header/NavBar/NavBar";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";
import React from "react";

const privacyPolicy = async () => {
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
              Privacy Policy
            </h1>

            <div className="space-y-8">
              <p>What Information We Collect</p>
              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  1. We collect, store, and process your personal data to
                  complete your purchases and provide our services. The
                  information we collect may include:
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Name, title, gender, and date of birth</li>
                  <li>
                    Email, postal address, and delivery address (if different)
                  </li>
                  <li>Phone number, mobile number, and fax number</li>
                  <li>
                    Payment details, including card or bank account information
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  2.How We Use Your Information:
                </h2>
                <p>We use your data to:</p> <br></br>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Process and fulfill your orders</li>
                  <li>Provide services and information you request</li>
                  <li>Manage your account with us</li>
                  <li>Verify and process payments</li>
                  <li>Improve our website’s layout and content</li>
                  <li>
                    Identify website visitors and analyze user demographics
                  </li>
                  <li>
                    Send you useful updates, promotions, and product details (if
                    you have not opted out)
                  </li>
                  <li>
                    Contact you via email about other products and services
                    (with your consent)
                  </li>
                  <li>
                    If you do not wish to receive marketing messages, you can
                    opt out at any time.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  3. Sharing Your Information
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    We may share your name and address with third parties (e.g.,
                    couriers or suppliers) to deliver your orders.
                  </li>
                  <li>
                    You must ensure that any information you provide is accurate
                    and up to date.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  4. Accessing Your Information
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    Your order details are securely stored but cannot be
                    retrieved directly for security reasons.
                  </li>
                  <li>
                    You can log into your account to view past and current
                    orders, update your address or payment details (for
                    refunds), and manage newsletter subscriptions.
                  </li>
                  <li>
                    Keep your login details secure and do not share them with
                    unauthorized parties.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  5. Marketing & Communication
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    We may send you updates on products, sales, and promotions.
                  </li>
                  <li>
                    If you do not want to receive these, click ‘unsubscribe’ in
                    any email.
                  </li>
                  <li>
                    We will stop sending promotional emails within 7 working
                    days of your request.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-[#D4A373] mb-2">
                  6. Your Rights
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>
                    <strong>
                      You can request access to any personal data we hold about
                      you.
                    </strong>
                  </li>
                  <li>
                    If your data is incorrect, you have the right to request
                    corrections for free.
                  </li>
                  <li>
                    You can ask us to stop using your data for marketing at any
                    time.
                  </li>
                  <li>
                    For any privacy-related concerns, feel free to contact us.
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default privacyPolicy;
