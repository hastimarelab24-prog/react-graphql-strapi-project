
import { factories } from "@strapi/strapi";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    async uploadFromUrl(ctx) {
      let tempPath: string | undefined;

      try {
        const url = ctx.request.body?.url;

        if (typeof url !== "string") {
          return ctx.badRequest("Image URL is required.");
        }

        let parsedUrl: URL;

        try {
          parsedUrl = new URL(url);
        } catch {
          return ctx.badRequest("Invalid image URL.");
        }

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          return ctx.badRequest("Only HTTP and HTTPS URLs are allowed.");
        }

        // Prevent requests to local/private network addresses.
        const hostname = parsedUrl.hostname.toLowerCase();

        if (
          hostname === "localhost" ||
          hostname === "127.0.0.1" ||
          hostname === "::1" ||
          hostname.endsWith(".local") ||
          hostname.startsWith("10.") ||
          hostname.startsWith("192.168.") ||
          hostname.startsWith("169.254.") ||
          /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
        ) {
          return ctx.badRequest("Private network URLs are not allowed.");
        }

        const response = await fetch(parsedUrl, {
          signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) {
          return ctx.badRequest(
            `Unable to download image. Status: ${response.status}`
          );
        }

        const contentType = (
          response.headers.get("content-type") || ""
        )
          .split(";")[0]
          .trim()
          .toLowerCase();

        const extensionMap: Record<string, string> = {
          "image/jpeg": ".jpg",
          "image/png": ".png",
          "image/webp": ".webp",
          "image/gif": ".gif",
          "image/avif": ".avif",
        };

        const extension = extensionMap[contentType];

        if (!extension) {
          return ctx.badRequest(
            "Only JPEG, PNG, WebP, GIF and AVIF images are allowed."
          );
        }

        const declaredLength = Number(
          response.headers.get("content-length") || 0
        );

        if (declaredLength > 10 * 1024 * 1024) {
          return ctx.badRequest("Image must be smaller than 10 MB.");
        }

        const buffer = Buffer.from(await response.arrayBuffer());

        if (buffer.length === 0 || buffer.length > 10 * 1024 * 1024) {
          return ctx.badRequest("Image is empty or exceeds 10 MB.");
        }

        const fileName = `url-image-${Date.now()}-${crypto
          .randomBytes(4)
          .toString("hex")}${extension}`;

        tempPath = path.join(os.tmpdir(), fileName);
        fs.writeFileSync(tempPath, buffer);

        const uploadedFiles = await strapi
          .plugin("upload")
          .service("upload")
          .upload({
            data: {},
            files: {
              path: tempPath,
              name: fileName,
              type: contentType,
              size: buffer.length,
            },
          });

        if (!uploadedFiles?.length) {
          return ctx.internalServerError("Image upload failed.");
        }

        ctx.body = {
          success: true,
          file: uploadedFiles[0],
        };
      } catch (error) {
        strapi.log.error("Upload image from URL failed", error);

        return ctx.internalServerError(
          "Unable to upload image from URL."
        );
      } finally {
        if (tempPath) {
          try {
            fs.unlinkSync(tempPath);
          } catch {
            // Temporary file may already have been removed.
          }
        }
      }
    },
  })
);