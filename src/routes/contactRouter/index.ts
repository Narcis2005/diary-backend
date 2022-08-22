/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import sendEmail from "../../controllers/contact";
const router = express.Router();

// @router  POST api/contact
// @desc    Send me a message
// @access  Public
router.post("/", sendEmail);
export default router;
