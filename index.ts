import express, { Application} from 'express';
import cors from 'cors';
import database from './src/config/database';
import addUser from './src/middleware/addUser';
import authRouter from "./src/routes/authRouter";
import privateEndpoint from './src/middleware/privateEndpoint';
const app:Application = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());

database.authenticate()
  .then(() => console.log("connected to postgres"))
  .catch((err) => console.log(err));


app.use(addUser);
app.use("/api/auth", authRouter);
app.get("/api/test", privateEndpoint, (req, res) => {
  res.send("esti logat");
});
//Creating port variable from env variable or setting it mannualy

const PORT = process.env.PORT || 5010;


//Listening on the PORT variable and then console logging the port

app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`);
});