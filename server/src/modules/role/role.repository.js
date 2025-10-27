const { RoleSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");



class RoleRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createRole(payload) {
    const existingRole = await this.#model.findOne({ role: { $regex: `^${payload.role}$`, $options: 'i' } });
    if (existingRole) {
      throw new Error("Role already exists");
    }
    payload.role = payload.role?.toLowerCase();
    console.log("Role created", payload);
//  lll
    const newRole = await this.#model.create(payload);
    return newRole;
  }
  async findAndCreateRole(payload) {
    const existingRole = await this.#model.findOne({ role: { $regex: `^${payload.role}$`, $options: 'i' } });
    if (existingRole) {
      return existingRole;
    }
    payload.role = payload.role?.toLowerCase();
    return await this.createRole(payload);
  }

  async getRoleWithPagination(payload) {
    try {
      const roles = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const roles = await this.#model
            .find({})
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit);
          // .populate('')
          // .populate('')
          const totalRole = await this.#model.countDocuments();

          return { doc: roles, totalDoc: totalRole };
        }
      );

      return roles;
    } catch (error) {
      console.error("Error getting roles with pagination:", error);
      throw error;
    }
  }

  async updateRole(id, payload, session) {
    const { permissions,role } = payload;
    const existing = await this.#model.findById(id);
    if (!existing) {throw new Error("Role not found");}
    // check this role already exists in the database
    const existingRole = await this.#model.findOne({ role: { $regex: `^${role}$`, $options: 'i' } });
    console.log("Role already exists", existingRole)
    // ll
    if (existingRole 
      && existingRole._id.toString() !== id
    ) {
      throw new Error("Role already exists");
    }
    console.log("Role already exists", permissions, role)
    existing.permissions = permissions;
    existing.role = role;
    const updatedRole = await existing.save({ session });
    return updatedRole;
  }

}

module.exports = new RoleRepository(RoleSchema);

