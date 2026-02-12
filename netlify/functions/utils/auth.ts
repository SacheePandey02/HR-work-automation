import jwt from "jsonwebtoken";

export const getUserFromToken = (event: any) => {
  const authHeader =
    event.headers.authorization || event.headers.Authorization;

  if (!authHeader) {
    throw new Error("Authorization header missing");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("Token missing");
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  if (!decoded?.id) {
    throw new Error("Invalid token: id missing");
  }

  return decoded; // must contain id
};
