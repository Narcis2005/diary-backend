import dotenv from "dotenv";
dotenv.config();
const checkEnv = () => {
    if(!process.env.DB_HOST){
        throw "Please specify the DB host in .env file";
      }
      if(!process.env.DB_USERNAME){
        throw "Please specify the DB username in .env file";
      }
      if(!process.env.DB_PASSWORD){
        throw "Please specify the DB password in .env file";
      }
      if(!process.env.SECRET){
        throw "Please specify the JWT secret in .env file";
      }
      if(!process.env.REFRESH_SECRET){
        throw "Please specify the JWT refresh token in .env file";
      }
      if(!process.env.DATABASE_NAME){
        throw "Please specify the DB name in .env file";
      }
      if(!process.env.DIARY_SECRET || process.env.DIARY_SECRET.length <32 ) {
        throw "Please specify the diary secret name longer than 32 char in .env file";
      }
};

export default checkEnv;