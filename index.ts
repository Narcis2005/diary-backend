import express, { Application} from 'express';
import cors from 'cors';
import database from './src/config/database';
import addUser from './src/middleware/addUser';
import authRouter from "./src/routes/authRouter";
import uploadRouter from "./src/routes/uploads";

import privateEndpoint from './src/middleware/privateEndpoint';
import dotenv from "dotenv";
dotenv.config();
const app:Application = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());
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
database.authenticate()
  .then(() => console.log("connected to postgres"))
  .catch((err) => console.log(err));

app.use('/api/static', express.static(__dirname +'/static'));
app.use(addUser);
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.post("/api/test", privateEndpoint, (req, res) => {
  res.send({message: "esti logat inca"});
});
//Creating port variable from env variable or setting it mannualy

const PORT = process.env.PORT || 3026;


//Listening on the PORT variable and then console logging the port

app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
});