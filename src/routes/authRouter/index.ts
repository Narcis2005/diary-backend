import express from "express";
import { Login, Register } from "../../controllers/auth";
const router = express.Router();

router.post("/router", void Register);

router.post("/login", void Login);
export default router;
