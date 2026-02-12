import { Handler } from "@netlify/functions";
import bcrypt from "bcryptjs";
import { connectDB } from "./utils/db";
import User from "./utils/user";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { name, email, password } = JSON.parse(event.body || "{}");

  if (!name ||!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "All fields required" })
    };
  }

  await connectDB("lite");

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return {
      statusCode: 409,
      body: JSON.stringify({ message: "User already exists" })
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({name, email, password: hashedPassword });

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "User registered successfully" })
  };
};
