import { Handler } from "@netlify/functions";
import { connectDB } from "./utils/db";

export const handler: Handler = async () => {
  try {
    const db = await connectDB();
    const collections = await db.connection.db.listCollections().toArray();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Connected to Atlas!",
        collections: collections.map(c => c.name)
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Connection failed", details: err })
    };
  }
};
