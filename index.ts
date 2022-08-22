import express, { Application} from 'express';
import cors from 'cors';
import database from './src/config/database';
import addUser from './src/middleware/addUser';
import authRouter from "./src/routes/authRouter";
import uploadRouter from "./src/routes/uploads";
import diaryRouter from "./src/routes/diaryRouter";
import checkEnv from './src/utils/checkEnv';
import contactRouter from "./src/routes/contactRouter";
export const app:Application = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());
checkEnv();
database.authenticate()
  .then(() => console.log("connected to postgres"))
  .catch((err) => console.log(err));
app.use('/api/static', express.static(__dirname +'/static'));
app.use(addUser);
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/diary", diaryRouter);
app.use("/api/contact", contactRouter);
//Creating port variable from env variable or setting it mannualy

const PORT = process.env.PORT || 3026;


//Listening on the PORT variable and then console logging the port
if(process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
});
}
