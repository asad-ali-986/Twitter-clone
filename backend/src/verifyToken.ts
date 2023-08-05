import jwt from "jsonwebtoken";
import createError from "http-errors";

export const verifyToken = (req: any,res: any, next:any) => {
  const token = req.cookies.access_token;

  if (!token) res.status(401).json({message:"You are not authenticated"});

  jwt.verify(token, process.env.JWTTOKEN as string, (err: any, user: any) => {
    if (err) return next(createError(403, "Token is invalid"));
    req.user = user;
    next();
  });
};
