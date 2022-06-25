/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { getUser, Login, Register } from "../../controllers/auth";
const router = express.Router();

router.post("/register", Register);

router.post("/login", Login);

router.get("/getuser", getUser);
export default router;
