/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import  { Request, Response } from "express";
import isEmailValid from "../utils/isEmailValid";
import emailTransporter from "../utils/emailTransporter";

const sendEmail = (req: Request, res: Response) => {
    interface ISendEmail {
        email: string;
        fullName: string;
        subject: string;
        message: string;
    }
    const {email, fullName, subject, message} = req.body as ISendEmail;
    if(!email || !fullName || !subject || !message) {
        res.status(400).send({message: "You need to specify an email, fullName, subject and message"});
        return;
    }
    if(!isEmailValid(email)) {
        res.status(400).send({message: "Email is not valid"});
        return;
    }

    const messageToSend = {
        to: "chirilov.narcis@yahoo.ro",
        from: "Portofoliu personal",
        subject: "New message from Diary",
        text: `From: ${fullName} \n email: ${email} \n subject: ${subject} \n message:${message}`   
    };
    
        emailTransporter.sendMail(messageToSend, (error, info) => {
        if (error) {
             res.status(500).send({message: "There is a problem with the system right now. Try again later or simply contact me at contact@chirilovnarcis.ro"});

            console.log(error);
            throw error;
        }
        console.log("Message sent: %s", info.messageId);
    });
    res.send({message: "Thank you for your message"});
};



export default sendEmail;
