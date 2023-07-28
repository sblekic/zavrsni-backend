import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

//@ts-ignore
export const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log("No token sent");
    res.status(401); // if the user did not send a jwt token, they are unauthorized
    throw new Error("User is not logged in");
  }
  try {
    const data = jwt.verify(token, process.env.AUTH_SECRET); // ovo ima smisla napraviti ako povežem neki data iz tokena sa data iz bp vj
    // res.json(data);
  } catch {
    res.status(403);
    return;
  }

  next();
});
