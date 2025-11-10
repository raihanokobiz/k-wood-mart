import ContactFrom from "@/components/pages/contact/ContactFrom";
import NavBar from "@/components/pages/header/NavBar/NavBar";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";

const Contact = async () => {
  const user = await getUser();
  const userId = user?.id;
  const coupon = "";
  const products = await getCartProducts(userId, coupon);
  return (
    <>
      <NavBar userCartProducts={products?.data} />
      <div className="relative pt-14  lg:pt-24 bg-gradient-to-b from-white via-amber-50 to-white overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[url('/images/texture.png')] bg-repeat opacity-10 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-0 py-12 md:py-16">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#262626] mb-8 lg:mb-12">
            Contact Us
          </h2>
          {/* Content */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Contact Form */}
            <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-md p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
              <ContactFrom />
            </div>
            {/* Our Information */}
            <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-md p-6 md:p-8 shadow-lg">
              <h3 className="text-xl md:text-2xl font-semibold mb-4">Our Information</h3>
              <div className="space-y-4 text-gray-700">
                <div>
                  <div className="font-bold">Address:</div>
                  <div>
                    সাঁতারকুল রোড, পশ্চিম পদরদিয়া, লেন নাম্বার ৪, বাইতুল মামুর মসজিদ রোড, বাড়ি নম্বর ৬০, বাড্ডা ঢাকা-2941.<br />
                    OFFICE ADD: RD-122, H 37, GULSHAN-1, DHAKA 1212
                  </div>
                </div>
                <div>
                  <span className="font-bold">Hotline: </span> 01712044438
                </div>
                <div>
                  <span className="font-bold">Email: </span> k............@gmail.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
