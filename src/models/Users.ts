import mongoose, { Schema, mongo } from "mongoose";

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

const User = mongoose.model("User", UserSchema);

export default User;
