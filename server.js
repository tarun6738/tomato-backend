import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config' 
import cartRouter from "./routes/cartRoute.js"
import { createClient } from 'redis';
import orderRouter from "./routes/orderRoute.js"

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    try {
        await redisClient.connect();  // Connect the Redis client, must be in an async context
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Failed to connect to Redis', error);
    }
})();

// app config
const app = express()
const PORT = process.env.PORT || 4000

// middleware
app.use(express.json())
app.use(cors())

//Database Connection
connectDB();

//API Endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("API working")
})

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})

export default redisClient;

//mongodb+srv://tarunnemali2004:Iamtarun2004@cluster0.cdklqgg.mongodb.net/?