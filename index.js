require("dotenv").config();
const express = require("express");
const corsOptions = require("./config/corsOptions");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const credentials = require("./middleware/credentials");
const connectDB = require("./config/dbConn");
const verifyJWT = require("./middleware/verifyJWT");
const usersController = require("./controllers/userController/usersController");

const app = express();
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// routes
app.get("/routes", (req, res) => {
  const routes = listEndpoints(app);
  res.json(routes);
});

app.get("/", (req, res) => {
  res.json("TIPI BOT BACKEND");
});

app.use("/auth", require("./routes/userRoutes"));
// app.use(verifyJWT);
app.use("", require("./routes/pictureRoutes"));

// app.use('', require('./routes/parcelRoutes'));

// app.all('*', (req, res) => {
//     res.status(404);
//     if (req.accepts('html')) {
//         res.sendStatus(404);
//     } else if (req.accepts('json')) {
//         res.json({ "error": "404 Not Found" });
//     } else {
//         res.type('txt').send("404 Not Found");
//     }
// });

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
