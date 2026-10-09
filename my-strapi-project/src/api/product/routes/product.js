"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");

module.exports = {
  async uploadFromUrl(ctx) {
    try {
      const { url } = ctx.request.body || {};

      if (!url) {
        return ctx.badRequest("Image URL is required.");
      }

      if (!/^https?:\/\//i.test(url)) {
        return ctx.badRequest(
          "Only http:// and https:// URLs are allowed."
        );
      }

      const response = await fetch(url);

      if (!response.ok) {
        return ctx.badRequest(
          `Unable to download image. Status: ${response.status}`
        );
      }

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.startsWith("image/")) {
        return ctx.badRequest(
          "The provided URL is not an image."
        );
      }

      const arrayBuffer = await response.arrayBuffer();

      const buffer = Buffer.from(arrayBuffer);

      const extensionMap = {
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/gif": ".gif",
        "image/svg+xml": ".svg",
      };

      const extension =
        extensionMap[contentType.split(";")[0]] || ".jpg";

      const fileName = `url-image-${Date.now()}-${crypto
        .randomBytes(4)
        .toString("hex")}${extension}`;

      const tempPath = path.join(
        os.tmpdir(),
        fileName
      );

      fs.writeFileSync(tempPath, buffer);

      const uploadedFiles =
        await strapi.plugin("upload").service("upload").upload({
          data: {},
          files: {
            path: tempPath,
            name: fileName,
            type: contentType,
            size: buffer.length,
          },
        });

      try {
        fs.unlinkSync(tempPath);
      } catch (error) {
        // Ignore temp file cleanup error
      }

      if (!uploadedFiles || uploadedFiles.length === 0) {
        return ctx.internalServerError(
          "Image upload failed."
        );
      }

      return {
        success: true,
        file: uploadedFiles[0],
      };
    } catch (error) {
      console.error(
        "Upload image from URL error:",
        error
      );

      return ctx.internalServerError(
        error.message || "Unable to upload image from URL."
      );
    }
  },
};