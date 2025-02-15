// Backend (Node.js + Express + MongoDB)
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/userApp")
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log(err));

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const DataSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  phone: String,
});

const User = mongoose.model("User", UserSchema);
const Data = mongoose.model("Data", DataSchema);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.json({ message: "User registered" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user._id }, "secretKey");
  res.json({ token });
});

app.post("/addData", async (req, res) => {
  const { token, name, phone } = req.body;
  try {
    const decoded = jwt.verify(token, "secretKey");
    const newData = new Data({ userId: decoded.userId, name, phone });
    await newData.save();
    res.json({ message: "Data added" });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get("/getData", async (req, res) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, "secretKey");
    const data = await Data.find({ userId: decoded.userId });
    res.json(data);
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
