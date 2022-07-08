/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { Upload } from "../../controllers/upload";
import privateEndpoint from "../../middleware/privateEndpoint";
const router = express.Router();

// @router  POST api/uploads
// @desc    Upload a photo to use as a profile picture. It returns the saved name of the picture, after some cropping
// @access  Private
router.post("/", privateEndpoint, Upload);
export default router;
