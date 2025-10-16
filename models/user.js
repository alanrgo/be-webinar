import mongoose from "mongoose";
import validator from "validator";
import { validatePassword } from "../utils/hash.js";

const { Schema } = mongoose;

// Regex para validar URLs
const urlRegex = /^(https?:\/\/)(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/i;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (str) {
        return validator.isEmail(str);
      },
      message: (props) => `${props.value} is not a valid address`,
    },
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegex.test(v),
      message: (props) => `${props.value} não é uma URL válida!`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials =
  async function findUserByCredentials({ email, password }) {
    const user = await this.findOne({ email }).select("+password");
    if (!user) {
      return { error: `User ${email} and/or password not found` };
    }

    if (!validatePassword(password, user.password)) {
      return { error: `invalid Credentials` };
    }

    return { id: user._id, name: user.name, about: user.about };
  };

export default mongoose.model("user", userSchema);
