//third-parity module require
const mongoose = require("mongoose");
const { Schema } = mongoose;
//user schema
const blogSchema = new Schema(
  {
    author: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    body: {
      type: String,
      trim: true,
      required: [true, "Please add Blog Description"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//create customer model
const Blog = mongoose.model("blog", blogSchema);
//customer Schema exports
module.exports = Blog;
