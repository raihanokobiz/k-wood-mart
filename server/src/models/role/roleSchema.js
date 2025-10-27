const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PermissionSchema = new Schema({
  access: { type: Boolean, default: false },
  create: { type: Boolean, default: false },
  // update: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
});

const Roleschema = new Schema({
  role: {
    type: String,
    unique: true
  },
  permissions: {
    aboutUs: { type: PermissionSchema, default: {} },
    banner: { type: PermissionSchema, default: {} },
    category: { type: PermissionSchema, default: {} },
    subCategory: { type: PermissionSchema, default: {} },
    chilsCategory: { type: PermissionSchema, default: {} },
    subChilsCategory: { type: PermissionSchema, default: {} },
    brand: { type: PermissionSchema, default: {} },
    product: { type: PermissionSchema, default: {} },
    wishlist: { type: PermissionSchema, default: {} },
    coupon: { type: PermissionSchema, default: {} },


    inventory: { type: PermissionSchema, default: {} },
    order: { type: PermissionSchema, default: {} },
    shippingMethod: { type: PermissionSchema, default: {} },
    paymentService: { type: PermissionSchema, default: {} },
    
    contactInfo: { type: PermissionSchema, default: {} },

    user: { type: PermissionSchema, default: {} },

  },
},
  { timestamps: true }
);

const RoleSchema = mongoose.model("role", Roleschema);

module.exports = { RoleSchema };

