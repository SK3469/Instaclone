import express, { urlencoded } from "express";
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/user.route.js"
import messageRoute from "./routes/user.route.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import connectDB from "./utils/db.js";
dotenv.config({});
connectDB();
const app = express()
const PORT = process.env.PORT || 3000; //This always below the express app function..
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "This message from backEnd",
        success: true
    })
})

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true })); //always extended: true


const corsOption = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors(corsOption));

//apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);



//This is the port to run server ..

app.listen(PORT, () => {
    console.log(`server listen at port ${PORT}`);
});

