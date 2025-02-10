const express = require("express");
const app = express();
require("dotenv").config();
require("./conn/conn");
const cors = require("cors");
const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task");

app.use(cors());// Allow all origins, but specify allowed origins in production

app.use(express.json());// Parse incoming JSON requests

app.use("/api/v1", UserAPI); // API route for for sign-in, sign-up, user authentication

app.use("/api/v2", TaskAPI); // API route for  creating, updating, and deleting tasks
// localhost:1000/api/v1/sign-in

app.use("/", (req, res) => {
    res.send("Hi from backend side");
});
const PORT = 1000;

app.listen(PORT, () => {
    console.log("Server started");
});