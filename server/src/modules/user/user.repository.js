const { UserSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");



class UserRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createUser(payload) {
    const newUser = await this.#model.create(payload);
    return newUser;
  }

  async getUserWithPagination(payload) {
    try {
      const users = await pagination(payload, async (limit, offset, sortOrder) => {
        const users = await this.#model.find({
        })
          .sort({ createdAt: sortOrder, })
          .skip(offset)
          .limit(limit)
          .populate([
            { path: "warehouseRef", select: "" },
            { path: "roleRef", select: "role " },
          ]); 
        const totalUser = await this.#model.countDocuments();

        return { doc: users, totalDoc: totalUser };
      });

      return users;
    } catch (error) {
      console.error("Error getting users with pagination:", error);
      throw error;
    }
  }

  // async getUserWithPagination(payload) {
  //   try {
  //     const users = await pagination(
  //       payload,
  //       async (limit, offset, sortOrder) => {
  //         const users = await this.#model
  //           .find({})
  //           .sort({ createdAt: sortOrder })
  //           .skip(offset)
  //           .limit(limit)
  //           .populate([
  //             { path: "roleRef", select: "role " },
  //           ]);
  //         // .populate('')
  //         const totalUser = await this.#model.countDocuments();

  //         return { doc: users, totalDoc: totalUser };
  //       }
  //     );

  //     return users;
  //   } catch (error) {
  //     console.error("Error getting users with pagination:", error);
  //     throw error;
  //   }
  // }
}

module.exports = new UserRepository(UserSchema);

