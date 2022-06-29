/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { updateDiary, getDiary, Download } from "../../controllers/diary";
import privateEndpoint from "../../middleware/privateEndpoint";
const router = express.Router();

router.get("/", privateEndpoint, getDiary);

router.put("/update-diary", privateEndpoint, updateDiary);

router.get("/download", privateEndpoint, Download);
export default router;
