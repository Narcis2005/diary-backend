import User from "../models/user";
import isEmailValid from "../utils/isEmailValid";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { createTokens } from "../utils/auth";
import dotenv from "dotenv";
dotenv.config();
export const Register = async (req: Request, res: Response) => {
    interface IData {
        fullName: string;
        username: string;
        password: string;
        email: string;
    }
    const { fullName, username, password, email } = req.body as IData;
    if (!fullName || !username || !password || !email) {
        res.status(400).send({ message: "Specify all params" });
        return;
    }
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
        const user = await User.create({
            username,
            password: hashedPassword,
            email,
            fullName,
            createdAt: new Date(),
            updatedAt: new Date(),
            imagePath: "static/images/profilePlaceholder.png",
        });
        const [token, refreshToken] = await createTokens(user, SECRET, REFRESH_SECRET + user.password);
        res.set("Access-Control-Expose-Headers", "x-token, x-refresh-token");
        res.set("x-token", token);
        res.set("x-refresh-token", refreshToken);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
};
const SECRET = process.env.SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
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

    res.send({
        message: "you are connected",
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        imageURL:
            process.env.NODE_ENV === "production"
                ? "https://diary.chirilovnarcis.ro/" + user.imagePath
                : "http://localhost:3026/" + user.imagePath,
    });
};
export const getUser = (req: Request, res: Response) => {
    if (req.user) {
        res.send({
            message: "you are connected",
            id: req.user.id,
            username: req.user.username,
            fullName: req.user.fullName,
            email: req.user.email,
            imageURL:
                process.env.NODE_ENV === "production"
                    ? "https://diary.chirilovnarcis.ro/" + req.user.imagePath
                    : "http://localhost:3026/" + req.user.imagePath,
        });
        return;
    }
    res.status(403).send({ message: "You could not be logged in" });
};
export const Update = async (req: Request, res: Response) => {
    interface IBody {
        username: string;
        email: string;
        fullName: string;
        imageName: string;
    }
    const { username, email, fullName, imageName } = req.body as IBody;
    const user = await User.findByPk(req.user.id);
    if (!username && !email && !fullName && !imageName) {
        res.status(400).send({ message: "You need to update at least one information" });
    }
    if (username) {
        if (username.length < 3) {
            res.status(422).send({ message: "An username should be at least 3 charachters" });
            return;
        }
        const findedUserByUsername = await User.findOne({ where: { username } });
        if (findedUserByUsername && findedUserByUsername.id != req.user.id) {
            res.status(400).send({ message: "An account with specified username aleardy exists" });
            return;
        }
        user.username = username;
    }
    if (email) {
        if (!isEmailValid(email)) {
            res.status(422).send({ message: "Write a valid email address" });
            return;
        }
        user.email = email;
    }
    if (fullName) {
        if (fullName.length < 3) {
            res.status(422).send({ message: "Write a valid full name" });
            return;
        }
        user.fullName = fullName;
    }
    if (imageName) {
        const imagePath = "static/images/" + imageName;
        user.imagePath = imagePath;
    }
    await user.save();
    res.sendStatus(200);
};
