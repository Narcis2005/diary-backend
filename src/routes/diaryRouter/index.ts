/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { updateDiary, getDiary, Download } from "../../controllers/diary";
import privateEndpoint from "../../middleware/privateEndpoint";
const router = express.Router();

// @router  GET api/diary
// @desc    Get the diary of an user
// @access  Private
router.get("/", privateEndpoint, getDiary);

// @router  PUT api/diary/update-diary
// @desc    Add, delete, or modify the content of a diary
// @access  Private
router.put("/update-diary", privateEndpoint, updateDiary);

// @router  GET api/diary/download
// @desc    Download an user's diary in pdf
// @access  Private
router.get("/download", privateEndpoint, Download);
export default router;
