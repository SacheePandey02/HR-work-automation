import { Handler } from "@netlify/functions";
import jwt from "jsonwebtoken";

export const handler: Handler = async (event) => {
  const authHeader = event.headers.authorization;

  if (!authHeader) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "No token provided" })
    };
  }

  const token = authHeader.split(" ")[1]; // Bearer TOKEN

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ valid: true, user: decoded })
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Invalid token" })
    };
  }
};
