const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}) ); 

const dbConnect =  require("./config/database");
dbConnect();

const cloudinaryConnect = require("./config/cloudinary");
cloudinaryConnect();

const userRoutes = require("./router/User");
const courseRoutes = require("./router/Course");
const profileRoutes = require("./router/Profile");
const paymentRoutes = require("./router/Payments");

const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:3000",
  "https://study-notion-frontend-rosy.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);

app.get("/" , (req,res) => {
    return res.json({
        success:true,
        message:"Your server is running"
    })
})

app.listen(PORT,() => {
    console.log(`App is running at port ${PORT}`);
})