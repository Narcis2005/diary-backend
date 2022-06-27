/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { Upload } from "../../controllers/upload";
import privateEndpoint from "../../middleware/privateEndpoint";
const router = express.Router();

router.post("/", privateEndpoint, Upload);
export default router;
