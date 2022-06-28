/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { updateDiary, getDiary } from "../../controllers/diary";
import privateEndpoint from "../../middleware/privateEndpoint";
const router = express.Router();

router.get("/", privateEndpoint, getDiary);

router.put("/update-diary", privateEndpoint, updateDiary);

export default router;
