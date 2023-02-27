require("colors");
require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

const notFoundMiddleware = require("./middleware/not-found");
const { errorHandlerMiddleware } = require("./middleware/error-handler");
const authRouter = require("./routes/user");
const { authenticateUser } = require("./middleware/authenticate-user");
const libraryRoute = require("./routes/libraryRoutes");
app.use("/api/v1/authorize", authRouter);
app.use("/api/v1/library", authenticateUser, libraryRoute);
// app.use("/api/v1/student", authenticateUser);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const { connectDB } = require("./db/connect");
const PORT = process.env.PORT || 5001;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("DATABASE CONNECTED".yellow.bold);
    app.listen(PORT, () => {
      console.log(`SERVER `.yellow.bold, PORT.blue);
    });
  } catch (error) {
    console.log(`${error}`.red);
  }
};

start();
