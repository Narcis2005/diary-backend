import User from "../models/user";
import isEmailValid from "../utils/isEmailValid";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { createTokens } from "../utils/auth";
import dotenv from "dotenv";
import { encryptContent } from "./diary";
import fs from "fs";
import Path from "path";
import config from "../config/env";
import emailTransporter from "../utils/emailTransporter";
import jwt from "jsonwebtoken";

dotenv.config(config);
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
        await user.createDiaryEntry({
            content: encryptContent({
                content: "Modify me to start writing",
                id: user.id.toString(),
                secret: process.env.DIARY_SECRET,
            }),
            createdAt: new Date(),
            updatedAt: new Date(),
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
                ? "https://diary.chirilovnarcis.ro/api/" + user.imagePath
                : "http://localhost:3026/api/" + user.imagePath,
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
                    ? "https://diary.chirilovnarcis.ro/api/" + req.user.imagePath
                    : "http://localhost:3026/api/" + req.user.imagePath,
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
        const imagePath = "static/uploads/images/" + imageName;
        try {
            if (fs.existsSync(Path.normalize(__dirname + "/../../" + imagePath))) {
                user.imagePath = imagePath;
            }
        } catch (error) {
            res.status(403).send({ message: "The image does not exists on server. You need to upload it first" });
        }
    }
    user.updatedAt = new Date();
    await user.save();
    res.sendStatus(200);
};
export const sendDeleteAccountEmail = async  (req: Request, res: Response) => {
    interface IBody {
        password: string;
    }
    const {password} = req.body as IBody;
    const valid = await bcrypt.compare(password, req.user.password);
    if (!valid) {
        res.status(403).send({ message: "Your password is incorect. If you forgot your password you can change it" });
        return;
    }
    const jwtToken = jwt.sign({user: {id: req.user.id}}, process.env.DELETE_TOKEN, {expiresIn: "1h"});
    const link = process.env.NODE_ENV === "production" ? `https://diary.chirilovnarcis.ro/profile/delete/${jwtToken}` : `http://localhost:3000/profile/delete/${jwtToken}`;
    const messageToSend = {
        to: req.user.email,
        from: "Diary - Your safe place",
        subject: "Delete your account",
        html: `Hi! We are very sorry that you choose to delete your account. You can ignore this email and contiune writing. If you still choose to delete it, follow <a href=${link}>this link</a> . The link is valid for 1 hour.`   
    };
    
        emailTransporter.sendMail(messageToSend, (error, info) => {
        if (error) {
             res.status(500).send({message: "There is a problem with the system right now. Try again later or simply contact me at contact@chirilovnarcis.ro"});

            console.log(error);
            throw error;
        }
        console.log("Message sent: %s", info.messageId);
    });
    res.send({message: "An email with instructions has been send to the email adress linked with this account"});
};
export const deleteAccount = async (req: Request, res: Response) => {

    interface IJWTUser {
        user: {id: string};
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const token = req.body.token as string;
    if(!token) {
        res.status(400).send({message: "Specify the token please"});
        return;
    }
    try {
        const {user} = jwt.verify(token, process.env.DELETE_TOKEN) as IJWTUser;
        const findedUser = await User.findByPk(user.id);
        await findedUser.destroy();
        res.send({message: "Account deleted sucesfully"});
        return;
    } catch (error) {
        res.status(400).send({message: "please specify a valid token and be sure the user still exists", error: error});
        return;
    }


 };
 export const sendResetPasswordEmail =  (req: Request, res: Response) => {
    const jwtToken = jwt.sign({user: {id: req.user.id}}, process.env.RESET_TOKEN, {expiresIn: "1h"});
    const link = process.env.NODE_ENV === "production" ? `https://diary.chirilovnarcis.ro/profile/reset-password/${jwtToken}` : `http://localhost:3000/profile/reset-password/${jwtToken}`;
    const messageToSend = {
        to: req.user.email,
        from: "Diary - Your safe place",
        subject: "Reset your password",
        html: `Hi! You need to follow <a href=${link}>this link</a> to change your password. The link is valid for 1 hour. If you didn't ask for password reset, just ignore this email.`   
    };
    
        emailTransporter.sendMail(messageToSend, (error, info) => {
        if (error) {
             res.status(500).send({message: "There is a problem with the system right now. Try again later or simply contact me at contact@chirilovnarcis.ro"});

            console.log(error);
            throw error;
        }
        console.log("Message sent: %s", info.messageId);
    });
    res.send({message: "An email with instructions has been send to the email adress linked with this account"});
};
export const resetPassword = async (req: Request, res: Response) => {
    interface IBody {
        newPassword: string;
        repeatedNewPassword: string;
        token: string;
    }
    interface IJWTUser {
        user: {id: string};
    }
    const {newPassword, repeatedNewPassword, token} = req.body as IBody;
    if(!newPassword || !repeatedNewPassword || !token) {
        res.status(400).send({message: "Please specify all parameters: newPassword, newRepeteadPassword, token"});
        return;
    }
    if(newPassword !== repeatedNewPassword) {
        res.status(400).send({message: "The passwords don't match"});
        return;
    }
    try {
        const {user} = jwt.verify(token, process.env.RESET_TOKEN) as IJWTUser;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const findedUser = await User.findByPk(user.id);
        findedUser.password = hashedPassword;
        findedUser.updatedAt = new Date();
        await findedUser.save();
        res.send({message: "Password updated succesfully"});
        return;
    } catch (error) {
        res.status(400).send({message: "Please specify a valid token and be sure the user still exists", error: error});
        return;
    }

};
export const forgottenPassword = async (req: Request, res: Response) => { 
    interface IBody {
        email: string;
    }
    const {email} = req.body as IBody;
    if(!email) {
        res.status(400).send({message: "Specify the email parameter"});
        return;
    }
    const users = await User.findAll({where: {email: email}});
    if (users.length === 0) {
        res.send({message: "An email with further actions was send, if there was an account linked to this email"});
        return;
    }
    const messageForEveryAccount = users.map( user => {
        const jwtToken =  jwt.sign({user: {id: user.id}}, process.env.RESET_TOKEN, {expiresIn: "1h"});
        const link = process.env.NODE_ENV === "production" ? `https://diary.chirilovnarcis.ro/profile/reset-password/${jwtToken}` : `http://localhost:3000/profile/reset-password/${jwtToken}`;
        return `User: ${user.username} - <a href=${link}>Follow this</a> </br>`;
    });
    const message = `Hi. Follow the link for the account which password needs to be reseted </br> ${messageForEveryAccount}`;
    const messageToSend = {
        to: email,
        from: "Diary - Your safe place",
        subject: "You forgot your password",
        html: message  
    };
    
        emailTransporter.sendMail(messageToSend, (error, info) => {
        if (error) {
             res.status(500).send({message: "There is a problem with the system right now. Try again later or simply contact me at contact@chirilovnarcis.ro"});

            console.log(error);
            throw error;
        }
        console.log("Message sent: %s", info.messageId);
    });
    res.send({message: "An email with further actions was send, if there was an account linked to this email"});
};