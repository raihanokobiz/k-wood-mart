import BulkForm from "@/components/pages/bulkOrder/BulkForm";
import NavBar from "@/components/pages/header/NavBar/NavBar";
import { getUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";

const Bulk =  async() => {
              // ==================== Product Details ====================
                const user = await getUser();
                const userRef = user?.id;
              const coupon = "";
              const userCartProducts = await getCartProducts(userRef, coupon);
  return (
    <div>
       <NavBar  userCartProducts ={ userCartProducts?.data}/>
      {/* <BulkBanner></BulkBanner>
      <BulkCustom></BulkCustom>
      <BulkLineUp></BulkLineUp> */}
      <BulkForm></BulkForm>
    </div>
  );
};

export default Bulk;
