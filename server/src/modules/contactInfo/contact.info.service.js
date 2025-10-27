const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const contactInfoRepository = require("./contact.info.repository.js");
const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");

class ContactInfoService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createContactInfo(payload, session) {
    const { name, message, subject, email, phone, whatsapp } = payload;
    const contactInfoData = await this.#repository.createContactInfo(payload);
    return contactInfoData;
  }

  async getAllContactInfo() {
    return await this.#repository.findAll();
  }

  async getContactInfoWithPagination(payload) {
    const contactInfo = await this.#repository.getContactInfoWithPagination(
      payload
    );
    return contactInfo;
  }

  async getSingleContactInfo(id) {
    const contactInfoData = await this.#repository.findById(id);
    if (!contactInfoData) throw new NotFoundError("ContactInfo Not Find");
    return contactInfoData;
  }

  async updateContactInfo(id, payload, session) {
    const { name, message, subject, email, phone, whatsapp } = payload;
    const contactInfoData = await this.#repository.updateById(id, payload);
    if (!contactInfoData) throw new NotFoundError("ContactInfo Not Find");
    return contactInfoData;
  }

  async deleteContactInfo(id) {
    const contactInfo = await this.#repository.findById(id);
    if (!contactInfo) throw new NotFoundError("ContactInfo not found");
    const deletedContactInfo = await this.#repository.deleteById(id);
    if (deletedContactInfo) {
      await removeUploadFile(contactInfo?.image);
    }
    return deletedContactInfo;
  }
}

module.exports = new ContactInfoService(contactInfoRepository, "contactInfo");
