import User from "../models/user";
import isEmailValid from "../utils/isEmailValid";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { createTokens } from "../utils/auth";
export const Register = async (req: Request, res: Response) => {
    interface IData {
        fullName: string;
        username: string;
        password: string;
        email: string;
    }
    const { fullName, username, password, email } = req.body as IData;
    if (fullName.length < 3) {
        res.status(422).send({ message: "Write a valid full name" });
        return;
    }
    if (username.length < 3) {
        res.status(422).send({ message: "An username should be at least 3 charachters" });
        return;
    }
    if (password.length < 3) {
        res.status(422).send({ message: "A password should be at least 3 charachters" });
        return;
    }
    if (!isEmailValid(email)) {
        res.status(422).send({ message: "Write a valid email address" });
        return;
    }
    const user = await User.findOne({ where: { username: username } });
    if (user) {
        res.status(400).send({ message: "An account with specified username aleardy exists" });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await User.create({
            username,
            password: hashedPassword,
            email,
            fullName,
            createdAt: new Date(),
            updatedAt: new Date(),
            imagePath: "static/images/profilePlaceholder.png",
        });
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
};
const SECRET = "JFBDSBJFBDHSBFDSbfjds@#%";
const REFRESH_SECRET = "BVFHhbjhvfJHVHVvfjvhJKBjkbjkbjbj";
export const Login = async (req: Request, res: Response) => {
    interface IData {
        username: string;
        password: string;
    }
    const { username, password } = req.body as IData;
    if (!username || !password) {
        res.status(404).send({ message: "Pleas provide a password and an username" });
        return;
    }
    const user = await User.findOne({ where: { username } });
    if (!user) {
        res.status(404).send({ message: "An account with this username does not exist" });
        return;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        res.status(403).send({ message: "Your password is incorect. If you forgot your password you can change it" });
        return;
    }
    const [token, refreshToken] = await createTokens(user, SECRET, REFRESH_SECRET + user.password);

    res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
    res.set("x-token", token);
    res.set("x-refresh-token", refreshToken);

    res.send({ message: "you are connected" });
};
