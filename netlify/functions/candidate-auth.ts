import { Handler } from "@netlify/functions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "./utils/db";
import CandidateUser from "./utils/CandidateUser";

export const handler: Handler = async (event) => {
  try {
    await connectDB("lite");
    const body = JSON.parse(event.body || "{}");
    const { type, name, email, password } = body; // type = 'login' or 'register'

    if (type === "register") {
      const existing = await CandidateUser.findOne({ email });
      if (existing) return { statusCode: 409, body: JSON.stringify({ message: "Email already exists" }) };

      const hashed = await bcrypt.hash(password, 10);
      const user = await CandidateUser.create({ name, email, password: hashed });
      
      const token = jwt.sign({ id: user._id, role: "candidate" }, process.env.JWT_SECRET!);
      return { statusCode: 201, body: JSON.stringify({ token, user: { name, email } }) };
    } 
    
    else if (type === "login") {
      const user = await CandidateUser.findOne({ email });
      if (!user) return { statusCode: 404, body: JSON.stringify({ message: "User not found" }) };

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return { statusCode: 401, body: JSON.stringify({ message: "Invalid credentials" }) };

      const token = jwt.sign({ id: user._id, role: "candidate" }, process.env.JWT_SECRET!);
      return { statusCode: 200, body: JSON.stringify({ token, user: { name: user.name, email } }) };
    }

    return { statusCode: 400, body: "Invalid type" };
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
};