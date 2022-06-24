import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { IJWTDecode, refreshTokens } from "../utils/auth";
const SECRET = "JFBDSBJFBDHSBFDSbfjds@#%";
const REFRESH_SECRET = "BVFHhbjhvfJHVHVvfjvhJKBjkbjkbjbj";
const addUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["x-token"] as string;
    if (!token) {
        req.user = null;
        next();
        return;
    }
    try {
        const { user } = jwt.verify(token, SECRET) as IJWTDecode;
        const fullUser = await User.findByPk(user.id);
        req.user = fullUser;
    } catch (err) {
        const refreshToken = req.headers["x-refresh-token"] as string;
        const newTokens = await refreshTokens(refreshToken, SECRET, REFRESH_SECRET);
        if (newTokens.token && newTokens.refreshToken) {
            res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
            res.set("x-token", newTokens.token);
            res.set("x-refresh-token", newTokens.refreshToken);
        }
        req.user = newTokens.user;
    }
    next();
};
export default addUser;
