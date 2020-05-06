import mongoose, { Schema, mongo } from 'mongoose';
import bcrypt from 'bcrypt';

export type UserDocument = mongoose.Document & {
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
  todolist: [];
  items: object;
};

const UserSchema = new Schema(
  {
    username: String,
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: { type: String, default: '' },
    motto: { type: String, default: '' },
    active: {
      exp_bar: { type: Object },
      background: { type: Object },
      darkmode: { type: Object },
    },
    experience: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },
    quests: Array,

    todolist: Array,
    items: {
      exp_bar: Array,
      background: Array,
    },
    created_at: { type: Date, default: Date.now },
  },
  { collection: 'Users' }
);

UserSchema.pre('save', function (next) {
  var user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (
  candidatePassword: any,
  cb: any
) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

export const User = mongoose.model<UserDocument>('User', UserSchema);
