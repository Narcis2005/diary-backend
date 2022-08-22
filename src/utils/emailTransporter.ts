import { google } from "googleapis";
import nodemailer from "nodemailer";
const emailTransporter = () => {
    const CLIENT_ID = process.env.CLIENT_ID_EMAIL;
    const CLIENT_SECRET = process.env.CLIENT_SECRET_EMAIL;
    const REDIRECT_URI = "https://developers.google.com/oauthplayground";
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN_EMAIL;
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
    const accessToken = oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
        type: "OAuth2",
        user: process.env.EMAIL_ADRESS,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: String(accessToken)
        }
    });
    return transporter;
};
export default emailTransporter();