/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { getUser, Login, Register, Update } from "../../controllers/auth";
import privateEndpoint from "../../middleware/privateEndpoint";
const router = express.Router();


// @router  POST api/register
// @desc    Register user
// @access  Public
router.post("/register", Register);


// @router  POST api/auth/login
// @desc    Login an user
// @access  Public
router.post("/login", Login);


// @router  GET api/getuser
// @desc    Check if tokens are still available and return user
// @access  Public, based on params
router.get("/getuser", getUser);


// @router  PUT api/auth/update
// @desc    Update the username, profile photo, email or full name
// @access  Private
router.put("/update", privateEndpoint, Update);
export default router;
