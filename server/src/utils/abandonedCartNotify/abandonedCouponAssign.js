import { CouponAbandoned } from "../../models/coupon/coupon.abandoned.model.js";
import { Customer } from "../../models/index.js";
import { sendMail } from "../sendMail.js";


export const abandonedCouponAssign = async ({ data }) => {
  try {
    const { customer_id, cart_ids, coupon_code, coupon_id } = data;

    // add user and users cart ids to coupon abandoned table
    await CouponAbandoned.create({
      customer_id,
      coupon_id,
      cart_ids: JSON.stringify(cart_ids),
    });

    const customer = await Customer.findByPk(customer_id);

    if (customer.email) {
      await sendMail({
        to: customer.email,
        subject: 'Congratulations! You have a coupon code for your current cart',
        html: `<div>
                  <h1>Congratulations! You have a coupon code for your current cart</h1>
                  <p>Coupon Code: ${coupon_code}</p>
                  <p>Use this coupon code for your current cart</p>
                </div>`
      });
    }
  }
  catch (err) {
  }
};