import { Schema, Model, model, ObjectId } from 'mongoose';

export interface ITweet {
  description: string;
  likes: string[];
  userId: ObjectId;
}

const TweetSchema = new Schema<ITweet, Model<ITweet>>(
  {
    description: {
      type: String,
      required: true,
      max: 280,
    },
    likes: [{
      type: String,
      default:[]
    }],
    userId: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);


export default model<ITweet>("Tweet", TweetSchema);

