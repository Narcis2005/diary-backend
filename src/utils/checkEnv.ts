import dotenv from "dotenv";
import config from "../config/env";
dotenv.config(config);
const checkEnv = () => {
    if (!process.env.DB_HOST) {
        throw "Please specify the DB host in .env file";
    }
    if (!process.env.DB_USERNAME) {
        throw "Please specify the DB username in .env file";
    }
    if (!process.env.DB_PASSWORD) {
        throw "Please specify the DB password in .env file";
    }
    if (!process.env.SECRET) {
        throw "Please specify the JWT secret in .env file";
    }
    if (!process.env.REFRESH_SECRET) {
        throw "Please specify the JWT refresh token in .env file";
    }
    if (!process.env.DATABASE_NAME) {
        throw "Please specify the DB name in .env file";
    }
    if (!process.env.DIARY_SECRET || process.env.DIARY_SECRET.length < 32) {
        throw "Please specify the diary secret name longer than 32 char in .env file";
    }
    if(!process.env.EMAIL_ADRESS) {
        throw "Please specify the email adress in .env file";
    }
    if(!process.env.REFRESH_TOKEN_EMAIL) {
        throw "Please specify the email refresh token in .env file";
    }
    if(!process.env.CLIENT_SECRET_EMAIL) {
        throw "Please specify the email client secret in .env file";
    }
    if(!process.env.CLIENT_ID_EMAIL) {
        throw "Please specify the email client id in .env file";
    }
    if(!process.env.DELETE_TOKEN) {
        throw "Please specify the delete token key in .env file";
    }
    if(!process.env.RESET_TOKEN) {
        throw "Please specify the RESET token key in .env file";
    }
};

export default checkEnv;
