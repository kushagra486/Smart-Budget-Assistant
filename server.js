const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/medo_db");

const FormSchema = new mongoose.Schema({ name:String, email:String, message:String, date:{type:Date,default:Date.now} });
const Form = mongoose.model("Form", FormSchema);

app.post("/api/forms", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: "Missing fields" });
  const doc = await Form.create({ name, email, message });
  res.status(201).json({ message: "Saved", id: doc._id });
});

app.get("/api/forms", async (req, res) => {
  const items = await Form.find().sort({date:-1}).limit(100);
  res.json(items);
});

app.listen(process.env.PORT || 5000, () => console.log("Backend listening"));