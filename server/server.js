const express = require("express");
const cors = require("cors");
const { userRoute } = require("./routes/user.route");
const connectDatabase = require("./config/db");
const { adminRoute } = require("./routes/admin.route");
const { taskRoute } = require("./routes/task.route");
const { teacherRoute } = require("./routes/teacher.route");
require("dotenv").config();
const cloudinary = require("cloudinary");
const studentRoute = require("./routes/student.route");

const app = express();

app.use(cors());
app.use(express.json()); //middleware to work with json data
app.use(express.urlencoded({ extended: false }));
app.use("*", (req, res, next) => {
  console.log("method", req.method, "data", req.body, "headers", req.headers);
  next();
});
app.use("/user", userRoute); // user route
app.use("/admin", adminRoute); //admin route
app.use("/task", taskRoute); // taskRoute
app.use("/teacher", teacherRoute); // teacher route

app.use("/student", studentRoute); // studentRoute

connectDatabase(); // connecting to database
cloudinary.v2.config({
  cloud_name: process.env.CLD_CLIENT_NAME,
  api_key: process.env.CLD_CLIENT_API,
  api_secret: process.env.CLD_CLIENT_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log("Server Started on PORT NO:", process.env.PORT);
});
