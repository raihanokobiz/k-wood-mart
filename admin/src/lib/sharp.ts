export async function processImage(
  file: File,
  height?: number,
  width?: number
): Promise<Buffer> {
  const sharp = require("sharp");
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  let sharpInstance = sharp(fileBuffer);

  if (height && width) {
    sharpInstance = sharpInstance.resize(width, height, {
      fit: sharp.fit.fill,
    });
  }

  return await sharpInstance.toBuffer();
}

export async function saveImageBufferToFile(buffer: Buffer, name: string) {
  const fs = require("fs");
  fs.writeFileSync(`public/${name}`, buffer);
}
