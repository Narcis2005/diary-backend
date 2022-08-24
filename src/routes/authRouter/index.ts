/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { deleteAccount, forgottenPassword, getUser, Login, Register, resetPassword, sendDeleteAccountEmail, sendResetPasswordEmail, Update } from "../../controllers/auth";
import privateEndpoint from "../../middleware/privateEndpoint";
const router = express.Router();

//"Access private" means that the authorization header(s) need to exist and be valid

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
// @access  Private
router.get("/getuser", getUser);

// @router  PUT api/auth/update
// @desc    Update the username, profile photo, email or full name
// @access  Private
router.put("/update", privateEndpoint, Update);

// @router  POST api/auth/send-delete-account-email
// @desc    Send an email with instructions to delete an account
// @access  Private
router.post("/send-delete-account-email", privateEndpoint, sendDeleteAccountEmail);

// @router  POST api/auth/send-reset-password-email
// @desc    Send an email with instructions to reset the password of an account
// @access  Private
router.post("/send-reset-password-email", privateEndpoint, sendResetPasswordEmail);

// @router  PUT api/auth/reset-password
// @desc    Reset the password
// @access  Public
router.put("/reset-password", resetPassword);

// @router  Delete api/auth/reset-password
// @desc    Delete an account
// @access  Public
router.delete("/delete", deleteAccount);

// @router  POST api/auth/forgot-password
// @desc    Send an email with instructions to reset the password of an account based on email parameter
// @access  Public
router.post("/forgot-password", forgottenPassword);
export default router;
