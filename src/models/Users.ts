import mongoose, { Schema, mongo } from 'mongoose';
import bcrypt from 'bcrypt';

type quest = {
  _id: string;
  title: string;
  contents: string;
  created_at: string | Date;
  due_date: string | Date;
  checked: boolean;
  finalize: boolean;
};

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
  quests: Array<quest>;
  created_at: Date;
  todolist: Array<quest>;
  items: object;
  darkmode: boolean;
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
      exp_bar: {
        type: Object,
        default: {
          _id: '5eb22ee884db8e67425366eb',
          price: 0,
          item_name: 'default',
          category: 'exp_bar',
          data: '#ffff00',
          image: '',
          created_at: '2020-05-06T03:28:40.739+00:00',
          __v: 0,
        },
      },
      background: {
        type: Object,
        default: {
          _id: '5eb22eb684db8e67425366e2',
          price: 0,
          item_name: 'default',
          category: 'background',
          image: '',
          created_at: '2020-05-06T03:27:50.591+00:00',
          __v: 0,
        },
      },
      darkmode: { type: Object, default: {} },
    },
    experience: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },
    quests: Array,

    todolist: Array,
    items: {
      exp_bar: {
        type: Array,
        default: [
          {
            _id: '5eb22eb684db8e67425366e2',
            price: 0,
            item_name: 'default',
            category: 'exp_bar',
            data: '#ffff00',
            image:
              'https://quest-runner.s3.ap-northeast-2.amazonaws.com/exp_bar/default.png',
            created_at: '2020-05-06T03:27:50.591+00:00',
            __v: 0,
          },
        ],
      },
      background: {
        type: Array,
        default: [
          {
            _id: '5eb22eb684db8e67425366e2',
            price: 0,
            item_name: 'default',
            category: 'background',
            image:
              'https://quest-runner.s3.ap-northeast-2.amazonaws.com/background/default.png',
            data: '',
            created_at: '2020-05-06T03:27:50.591+00:00',
            __v: 0,
          },
        ],
      },
      darkmode: Array,
    },
    created_at: { type: Date, default: Date.now },
    darkmode: { type: Boolean, default: false },
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
