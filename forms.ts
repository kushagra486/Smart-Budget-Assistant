import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectToDatabase } from "../../lib/mongodb";

const FormSchema = new mongoose.Schema({
  name: String, email: String, message: String, date: { type: Date, default: Date.now }
});
const Form = mongoose.models.Form || mongoose.model("Form", FormSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  if (req.method === "POST") {
    try {
      const { name, email, message } = req.body;
      if (!name || !email || !message) return res.status(400).json({ message: "Missing fields" });
      await Form.create({ name, email, message });
      return res.status(201).json({ message: "Form submitted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
  res.status(405).json({ message: "Method not allowed" });
}