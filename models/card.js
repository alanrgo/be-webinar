import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const urlRegex = /^(https?:\/\/)(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/i;

const cardSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => urlRegex.test(v),
      message: (props) => `${props.value} não é uma URL válida!`,
    },
  },
  owner: {
    type: Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('card', cardSchema);
