const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const roleRepository = require("./role.repository.js");

class RoleService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createRole(payload, session) {
    const { role } = payload;
    if (!role) throw new Error("role is required");
    const roleData = await this.#repository.createRole(payload);
    return roleData;
  }

  async getAllRole() {
    return await this.#repository.findAll();
  }

  async getRoleWithPagination(payload) {
    const role = await this.#repository.getRoleWithPagination(payload);
    return role;
  }

  async getSingleRole(id, permission) {
    const selectedFields = {};
    if (permission) {
        selectedFields[`permissions.${permission}`] = 1;
    }
    const roleData = await this.#repository.findById(id, [],selectedFields);

    if (!roleData) throw new NotFoundError("Role Not Found");
    return roleData;
}


  async updateRole(id, payload, session) {
        const updatedRole = await this.#repository.updateRole(id, payload, session);
        return updatedRole;
  }
  async deleteRole(id) {
    const role = await this.#repository.findById(id);
    if (!role) throw new NotFoundError("Role not found");
    const deletedRole = await this.#repository.deleteById(id);
    return deletedRole;
  }
}

module.exports = new RoleService(roleRepository, "role");

