import { Schema, Model, model, Document } from 'mongoose';
 interface IUser extends Document {
    username: string,
    email: string,
    password: string,
    followers: string[],
    following: string[],
    description: string,

 }


const UserSchema = new Schema<IUser, Model<IUser>>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    followers: [{
      type: String,
      default:[]
    }],
    following: [{
      type: String,
      default:[]
    }],
    description: { type: String },
  },
  { timestamps: true },

);
export default model<IUser>("User", UserSchema);
