// const { WishlistSchema } = require("../../models/index.js");
const { WishlistSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class WishlistRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createWishlist(payload, session) {
    const { userRef, productRef } = payload;
    const existingWishlist = await this.#model.findOne(
      { userRef, productRef },
      null,
      { session }
    );
    console.log(existingWishlist, "existing wishlist from wishlist repository");
    if (existingWishlist) {
      await this.#model.deleteOne({ _id: existingWishlist._id }, { session });
    } else {
      const newWishlist = await this.#model.create([payload], { session });
      return newWishlist;
    }
  }

  async updateWishlist(id, payload) {
    const updatedWishlist = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedWishlist) {
      throw new Error("About Us not found");
    }
    return updatedWishlist;
  }

  async getWishlistWithPagination(payload) {
    try {
      const wishlists = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const query = {};
          if (payload?.userId) {
            query.userRef = payload.userId;
          }
          const wishlists = await this.#model
            .find(query)
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit)
            .populate([
              { path: 'productRef' },
              { path: 'userRef', select: 'name email' },
            ]);;
          const totalWishlist = await this.#model.countDocuments(query);

          return { doc: wishlists, totalDoc: totalWishlist };
        }
      );

      return wishlists;
    } catch (error) {
      console.error("Error getting wishlists with pagination:", error);
      throw error;
    }
  }
}

module.exports = new WishlistRepository(WishlistSchema);
