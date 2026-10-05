require("dotenv").config();
const path = require("path");
const fs = require("fs");
const https = require("https");
const axios = require("axios");

const express = require("express");
const connectDB = require("./utils/db-connections");
const expenseRoute = require("./routes/expenseRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
const forgotPassRoute = require("./routes/forgotRoutes");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");


const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" },
);

const app = express();
const cors = require("cors");

// models
// require("./models");
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       useDefaults: false,
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'"],
//         connectSrc: ["'self'", "http://localhost:8000"],
//         imgSrc: ["'self'", "data:"],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//       },
//     },
//   })
// );

app.use(express.json());
app.use(cors());

app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home', 'index.html'));

});


// routes
app.use("/user", userRoutes);
app.use("/expense", expenseRoute);
app.use("/password", forgotPassRoute);
app.use("/payment", paymentRoutes);

const PORT = process.env.PORT || 3000;

console.log("mongoDb connecting....")

connectDB()
    .then(() => {
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log("Server running on PORT",PORT);
        });
    })
    .catch(err => {
        console.log(err);
});