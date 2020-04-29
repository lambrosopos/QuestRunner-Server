import mongoose, { Schema, mongo } from "mongoose";

export type UserDocument = mongoose.Document & {
  user: {
    username: string;
    password: string;
    email: string;
    profilePic: string;
    motto: string;
    active: {
      experiencebar: number;
      background: number;
      darkmode: boolean;
    };
    experience: number;
    credits: number;
    quests: [];
    created_at: Date;
  };
  todolist: [];
  items: object;
};

const UserSchema = new Schema(
  {
    user: {
      username: String,
      password: String,
      email: String,
      profilePic: String,
      motto: String,
      active: {
        experiencebar: Number,
        background: Number,
        darkmode: Boolean,
      },
      experience: Number,
      credits: Number,
      quests: Array,
      created_at: { type: Date, default: Date.now },
    },
    todolist: Array,
    items: {
      experiencebar: Array,
      background: Array,
    },
  },
  { collection: "Users" }
);

export const User = mongoose.model("User", UserSchema);
