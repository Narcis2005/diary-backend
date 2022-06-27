/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { Upload } from "../../controllers/upload";
import privateEndpoint from "../../middleware/privateEndpoint";
const router = express.Router();
import multer from "multer";

// https://stackoverflow.com/questions/45154069/display-uploaded-image-with-multer
const storage = multer.diskStorage({
    destination: "static/images",
    filename: function (req, file, cb) {
        let filename = Date.now().toString();
        switch (file.mimetype) {
            case "image/png":
                filename = filename + ".png";
                break;
            case "image/jpeg":
                filename = filename + ".jpeg";
                break;
            default:
                break;
        }
        cb(null, filename);
    },
});
const upload = multer({ storage });
router.post("/", [privateEndpoint, upload.single("file")], Upload);
export default router;
