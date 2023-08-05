import Tweet from "../models/tweet";
import User from "../models/user";
import mongoose from "mongoose";
import { Request,Response } from "express";

export const createTweet = async (req: Request, res: Response) => {
  const newTweet = new Tweet(req.body);
  try {
    const savedTweet = await newTweet.save();
    res.status(200).json(savedTweet);
  } catch (err) {
    res.status(500).json({err:err});
  }
};
export const deleteTweet = async (req:Request, res:Response) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (tweet?.userId.toString() === req.query.id) {
      await tweet?.deleteOne();
      res.status(200).json("tweet has been deleted");
    } else {
      res.status(500).json({message: "Error while deleting"});
    }
  } catch (err) {
    res.status(500).json({err:err});
  }
};

export const likeOrDislike = async (req: Request, res: Response) => {
  try {
    const tweet = await Tweet.findById(req.params.id);
    if (!tweet?.likes.includes(req.body.id)) {
      await tweet?.updateOne({ $push: { likes: req.body.id } });
      res.status(200).json("tweet has been liked");
    } else {
      await tweet.updateOne({ $pull: { likes: req.body.id } });
      res.status(200).json("tweet has been disliked");
    }
  } catch (err) {
    res.status(500).json({err:err});
  }
};

export const getAllTweets = async (req: Request, res: Response) => {
  try {
    const currentPage: any = req.query.currentPage;
    const limit:any = parseInt(req.query.limit as string);

    const currentUser = await User.findById(req.params.id)
    let ids = currentUser ? [currentUser._id,...currentUser.following]: [];
    ids = ids.map(id=>new mongoose.Types.ObjectId(id));

    const userTweetsReq = Tweet.aggregate([
      {
        $match:{ userId: {$in: ids } }
      }, 
      {
        $sort:{ likes: -1 }
      }, 
      {
        $skip:(currentPage-1)*limit
      }, 
      {
        $limit:limit
      },   
      {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
      },  
    ]);
    const countReq = Tweet.find({ userId: {$in:ids }}).count();

    const [uerTweets, count] = await Promise.all([userTweetsReq,countReq]);
    const response = { results: uerTweets, count, currentPage}
  
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({err:err});
  }
};

export const getUserTweets = async (req: Request, res: Response) => {
  try {
    const currentPage: any = req.query.currentPage;
    const limit = parseInt(req.query.limit as string);
    const userTweetsReq = Tweet.aggregate([
      {
        $match:{ userId: new mongoose.Types.ObjectId(req.params.id) }
      }, 
      {
        $sort:{ createAt: -1, }
      }, 
      {
        $skip:(currentPage-1)*limit
      }, 
      {
        $limit:limit
      },   
      {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
      },  
    ]);
    const totalTweetsCountReq = Tweet.find({userId: new mongoose.Types.ObjectId(req.params.id)}).count();

    const [userTweets, count] = await Promise.all([userTweetsReq,totalTweetsCountReq]);
    const response = { results: userTweets, count, currentPage}

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({err:err});
  }
};
export const getExploreTweets = async (req: Request, res: Response) => {
  try {
    const currentPage: any = req.query.currentPage;
    const limit = parseInt(req.query.limit as string);
    const getTweetsReq = Tweet.aggregate([
      {
        $match:{ likes: { $exists: true }}
      }, 
      {
        $sort:{ likes: -1 }
      }, 
      {
        $skip:(currentPage-1)*limit
      }, 
      {
        $limit:limit
      },   
      {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
      },  
    ]);
    const totalTweetsCountReq = Tweet.countDocuments();
    const [exploreTweets, count] = await Promise.all([getTweetsReq,totalTweetsCountReq]);
    const response = { results: exploreTweets, count, currentPage}
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({err:err});
  }
};
