const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const isArrayElementExist = require("../../utils/isArrayElementExist.js");
const policyRepository = require("./policy.repository.js");
const { isMainThread } = require("worker_threads");
const { log } = require("console");
const {
  convertFileNameWithPdfExt,
} = require("../../middleware/upload/convertFileNameWithPdfExt.js");
const {
  convertFileNameWithWebpExt,
} = require("../../middleware/upload/convertFileNameWithWebpExt.js");
const { uploadWorker } = require("../../middleware/upload/uploadWorker.js");
const {
  convertImgArrayToObject,
} = require("../../middleware/upload/convertImgArrayToObject.js");
const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");

class PolicyService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createPolicy(payload, session) {
    // const { files } = payloadFiles;
    const { details, type } = payload;
    // if (
    //   !header ||
    //   !title ||
    //   !description ||
    //   //   !honorName ||
    //   !whatsApp ||
    //   !email
    // ) {
    //   throw new Error("All fields are required");
    // }
    // console.log("file", files);

    // const requiredFiles = {
    //   image: false,
    // };

    // if (files) {
    //   files.forEach((file) => {
    //     if (requiredFiles.hasOwnProperty(file.fieldname)) {
    //       requiredFiles[file.fieldname] = true;
    //     }
    //   });
    // }

    // if (Object.values(requiredFiles).some((required) => !required)) {
    //   throw new Error(
    //     "All required images or documents must be provided: image, background Photo."
    //   );
    // }
    // let image;
    // if (Array.isArray(files) && files.length > 0 && isMainThread) {
    //   // Map over the files and prepare them for upload
    //   const imgFile = files.map(
    //     ({ buffer, originalname, fieldname, mimetype }) => ({
    //       buffer,
    //       originalname:
    //         mimetype === "application/pdf"
    //           ? convertFileNameWithPdfExt(originalname)
    //           : convertFileNameWithWebpExt(originalname),
    //       fieldname,
    //       mimetype,
    //     })
    //   );

    //   console.log("imgFile", imgFile);

    //   // Handle the upload of each file
    //   for (let file of imgFile) {
    //     try {
    //       await uploadWorker(file); // Assuming uploadWorker can handle one file at a time
    //     } catch (error) {
    //       console.error("Error uploading file:", error);
    //       throw new Error("File upload failed");
    //     }
    //   }

    //   // After upload, convert imgFile array to object format
    //   image = convertImgArrayToObject(imgFile);
    // } else {
    //   throw new Error("Invalid or empty files array");
    // }

    // for (const key in image) {
    //   payload[key] = image[key];
    // }

    const policyData = await this.#repository.createPolicy(payload, session);
    return policyData;
  }

  async getAllPolicy() {
    return await this.#repository.findAll();
  }

  async getPolicyWithPagination(payload) {
    const policy = await this.#repository.getPolicyWithPagination(payload);
    return policy;
  }

  async getSinglePolicy(id) {
    const policyData = await this.#repository.findById(id);
    if (!policyData) throw new NotFoundError("Policy Not Find");
    return policyData;
  }

  async updatePolicy(id, payload) {
    // const { files } = payloadFiles;
    const { details, type } = payload;
    // if (
    //   !header ||
    //   !title ||
    //   !description ||
    //   //   !honorName ||
    //   !whatsApp ||
    //   !email
    // ) {
    //   throw new Error("All fields are required");
    // }
    // const requiredFiles = { image: false };
    // if (files) {
    //   files.forEach((file) => {
    //     if (requiredFiles.hasOwnProperty(file.fieldname)) {
    //       requiredFiles[file.fieldname] = true;
    //     }
    //   });
    // }

    // // Process image files if present
    // let image;
    // if (Array.isArray(files) && files.length > 0 && isMainThread) {
    //   // Map over the files and prepare them for upload
    //   const imgFile = files.map(
    //     ({ buffer, originalname, fieldname, mimetype }) => ({
    //       buffer,
    //       originalname:
    //         mimetype === "application/pdf"
    //           ? convertFileNameWithPdfExt(originalname)
    //           : convertFileNameWithWebpExt(originalname),
    //       fieldname,
    //       mimetype,
    //     })
    //   );

    //   console.log("imgFile", imgFile);

    //   // Handle the upload of each file
    //   for (let file of imgFile) {
    //     try {
    //       await uploadWorker(file); // Assuming uploadWorker can handle one file at a time
    //     } catch (error) {
    //       console.error("Error uploading file:", error);
    //       throw new Error("File upload failed");
    //     }
    //   }

    //   // After upload, convert imgFile array to object format
    //   image = convertImgArrayToObject(imgFile);
    // } else {
    //   throw new Error("Invalid or empty files array");
    // }

    // // Update payload with new image paths
    // if (image) {
    //   Object.assign(payload, image);
    // }

    // Update the database with the new data
    const policyData = await this.#repository.updatePolicy(id, payload);

    // Remove old files if they’re being replaced
    // if (policyData) {
    //   const filesToRemove = [
    //     requiredFiles.image ? policyData.image : null,
    //   ].filter(Boolean);

    //   for (const filePath of filesToRemove) {
    //     await removeUploadFile(filePath);
    //   }
    // }

    return policyData;
  }

  async updatePolicyStatus(id, status) {
    if (!status) throw new NotFoundError("Status is required");
    status = status === "true";
    const policy = await this.#repository.updatePolicyStatus(id, {
      status: status,
    });
    console.log("policy", policy);
    if (!policy) throw new NotFoundError("Policy not found");
    return policy;
  }

  async deletePolicy(id) {
    const policy = await this.#repository.findById(id);
    if (!policy) throw new NotFoundError("Policy not found");
    const deletedPolicy = await this.#repository.deleteById(id);
    console.log("policy", policy);
    if (deletedPolicy) {
      await removeUploadFile(policy?.image);
    }
    return deletedPolicy;
  }
}

module.exports = new PolicyService(policyRepository, "policy");
