import { Request, Response, NextFunction } from "express"
import createError from "http-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user";

export const signup = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser:any = new User({ ...req.body, password: hash });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWTTOKEN as string);

    const { password, ...othersData } = newUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(othersData);
  } catch (err) {
    next(err);
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: any = await User.findOne({ username: req.body.username });

    if (!user) return next(createError(404, "User not found"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Wrong password"));

    const token = jwt.sign({ id: user._id }, process.env.JWTTOKEN as string);
    const { password, ...othersData } = user._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(othersData);
  } catch (err) {
    next(err);
  }
};
