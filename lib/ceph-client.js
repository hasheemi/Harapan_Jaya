const axios = require("axios");
const sharp = require("sharp");

class CephClient {
  constructor() {
    this.endPoint = process.env.CEPH_ENDPOINT || "https://is3.cloudhost.id";
    this.accessKey = process.env.CEPH_ACCESS_KEY;
    this.secretKey = process.env.CEPH_SECRET_KEY;
    this.bucket = process.env.CEPH_BUCKET || "resapling";
  }

  // Generate signature untuk S3 API
  generateSignature(stringToSign) {
    const crypto = require("crypto");
    return crypto
      .createHmac("sha1", this.secretKey)
      .update(stringToSign)
      .digest("base64");
  }

  // Upload file ke Ceph
  async uploadObject(fileName, fileBuffer, contentType = "image/webp") {
    const date = new Date().toUTCString();
    const stringToSign = `PUT\n\n${contentType}\n${date}\n/${this.bucket}/${fileName}`;
    const signature = this.generateSignature(stringToSign);

    try {
      const response = await axios.put(
        `${this.endPoint}/${this.bucket}/${fileName}`,
        fileBuffer,
        {
          headers: {
            "Content-Type": contentType,
            Date: date,
            Authorization: `AWS ${this.accessKey}:${signature}`,
          },
        }
      );

      return `${this.endPoint}/${this.bucket}/${fileName}`;
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      throw new Error("Failed to upload file to Ceph");
    }
  }

  // Get file dari Ceph
  async getObject(fileName) {
    const date = new Date().toUTCString();
    const stringToSign = `GET\n\n\n${date}\n/${this.bucket}/${fileName}`;
    const signature = this.generateSignature(stringToSign);

    try {
      const response = await axios.get(
        `${this.endPoint}/${this.bucket}/${fileName}`,
        {
          headers: {
            Date: date,
            Authorization: `AWS ${this.accessKey}:${signature}`,
          },
          responseType: "arraybuffer",
        }
      );

      return response.data;
    } catch (error) {
      console.error("Get object error:", error.response?.status);
      throw new Error("File not found");
    }
  }
}

module.exports = new CephClient();
