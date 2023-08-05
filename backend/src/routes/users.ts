import express from "express";
import {
  getUser,
  follow,
  unFollow,
} from "../controllers/user";
import { verifyToken } from "./../verifyToken";

const router = express.Router();

// Get User
router.get("/find/:id", getUser);

// Follow
router.put("/follow/:id", verifyToken, follow);

// Unfollow
router.put("/unfollow/:id", verifyToken, unFollow);

export default router;
