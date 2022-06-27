/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { getUser, Login, Register, Update } from "../../controllers/auth";
import privateEndpoint from "../../middleware/privateEndpoint";
const router = express.Router();

router.post("/register", Register);

router.post("/login", Login);

router.get("/getuser", getUser);

router.put("/update", privateEndpoint, Update);
export default router;
