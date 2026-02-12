import { Handler } from "@netlify/functions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "./utils/db";
import User from "./utils/user";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email, password } = JSON.parse(event.body || "{}");

  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "All fields required" })
    };
  }

  await connectDB("lite");

  const user = await User.findOne({ email });
  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Invalid credentials" })
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Invalid credentials" })
    };
  }

  // ✅ FIX HERE
  const token = jwt.sign(
    {
      id: user._id,
      name:user.name,         // 🔥 MUST be `id`
      email: user.email
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      token,
      message: "Login successful"
    })
  };
};
