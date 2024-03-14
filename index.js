const express = require("express");
const { connection } = require("./config/db");
const cors = require("cors");
const { userRouter } = require("./routes/user.routes");
const { noteRouter } = require("./routes/note.routes");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/notes", noteRouter);
app.listen(8080, async () => {
  try {
    await connection;
    console.log("Connected to DB");
    console.log("Server is running at port 8080");
  } catch (error) {
    console.log(error);
  }
});
