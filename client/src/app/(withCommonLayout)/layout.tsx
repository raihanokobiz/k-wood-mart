// import NavBar from "@/components/pages/header/NavBar/NavBar";

import Footer from "@/components/pages/landing_pages/Footer/Footer";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";
import MessengerBtn from "@/shared/MessengerBtn/MessengerBtn";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const userId = user?.id;
  const coupon = "";
  const products = await getCartProducts(userId, coupon);
  console.log(
    "---------------------------layout call products ---------------------",
    products
  );
  return (
    <div className="">
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className=" mt-11 md:mt-18"
        // style={{ marginTop: '70px' }}
      />

      <MessengerBtn />
      {/* <NavBar /> */}
      {children}
      <Footer userCartProducts={products?.data} />
    </div>
  );
}
