const fs = require('fs/promises');
const path = require('path');
const config = require('../../config/config.js');

exports.removeUploadFile = async (fileUrl) => {
  const fileName = path.basename(fileUrl);
  const removeFile = `${config.uploadFolder}${fileName}`;
  try {
    await fs.unlink(removeFile);
  } catch (err) {
    // If file doesn't exist (ENOENT), just log and continue - don't throw
    if (err.code === 'ENOENT') {
      console.warn(`File not found, skipping deletion: ${removeFile}`);
      return;
    }
    // For other errors, log and throw
    console.error('Error removing file:', err);
    throw new Error('File removal failed');
  }
};
