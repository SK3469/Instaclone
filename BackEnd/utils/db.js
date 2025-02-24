import mongoose, { Mongoose } from "mongoose";

const  connectDB= async ()=>{
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log('mongoDB connnected succesfully.')
    } catch (error) {
        console.log(error)
    }
}
export default connectDB ;