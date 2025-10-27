import { Sequelize } from "sequelize";
import { CouponAbandoned } from "../../models/coupon/coupon.abandoned.model.js";
import { Cart, Coupon, CouponCustomerUsed } from "../../models/index.js";
import { abandonedCartQueue } from "./abandonedCartQueue.js";

export const abandonedCartTaskManager = async ({
  customer_id,
}) => {
  try {
    const { Op } = Sequelize;

    const jobId = `abandoned-cart-notify-${customer_id}`;

    await abandonedCartQueue.remove(jobId); // remove if already exist

    const customerCart = await Cart.findAll({
      where: {
        customer_id
      }
    });

    if (customerCart.length === 0) {
      return;
    }

    // if coupon available
    const currentDate = new Date().toISOString().slice(0, 10);

    const findCoupon = await Coupon.findOne({
      where: {
        coupon_use_type: 'abandoned-cart',
        status: true,
        start_date: { // start date should be less than or equal to current date
          [Op.lte]: currentDate,
        },
        [Op.or]: [ // either unlimited or end date should be greater than or equal to current date
          {
            unlimited_date: true,
          },
          {
            unlimited_date: false,
            end_date: {
              [Op.gte]: currentDate,
            },
          },
        ],
        // unlimited equal true or use_limit greater than used
        [Op.or]: [
          {
            unlimited: true,
          },
          {
            unlimited: false,
            use_limit: {
              [Op.gt]: Sequelize.col('used'),
            },
          },
        ],
      },
      order: [
        ['created_at', 'DESC'],
      ]
    });

    if (!findCoupon) {
      return;
    }

    const previousUsed = await CouponCustomerUsed.count({
      where: {
        customer_id,
        coupon_id: findCoupon.id,
      }
    });

    if (previousUsed >= findCoupon.single_user_use_limit) {
      return;
    }

    const findInAbandoned = await CouponAbandoned.findOne({
      where: {
        customer_id,
        coupon_id: findCoupon.id,
      }
    });

    if (findInAbandoned) {
      return;
    }

    await abandonedCartQueue.add(
      jobId,
      {
        data: {
          customer_id,
          cart_ids: customerCart.map((cart) => cart.id),
          coupon_code: findCoupon.code,
          coupon_id: findCoupon.id,
        }
      },
      {
        delay: (parseInt(findCoupon.abandoned_hours) || 1) * 60 * 60 * 1000,
        // delay: 1000,
        // delay: parseInt(findCoupon.abandoned_hours),
        jobId,
      }
    );
  } catch (error) {
  }

};