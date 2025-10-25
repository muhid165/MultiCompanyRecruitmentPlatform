import multer from "multer";
import path from "path";
import { randomBytes } from "crypto";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = randomBytes(8).toString("hex");
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);

  },
});
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}); // file size 1MB
