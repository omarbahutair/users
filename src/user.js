const mongoose = require("mongoose");
const PostSchema = require("./postSchema");
const Schema = mongoose.Schema;

// a schema for the users model
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    validate: {
      validator: (name) => name.length > 2,
      message: "Name must be longer than 2 characters.",
    },
  },
  posts: [PostSchema],
  likes: Number,
  blogPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "blogPost",
    },
  ],
});

UserSchema.virtual("postCount").get(function () {
  return this.posts.length;
});

UserSchema.pre("remove", function (next) {
  const BlogPost = mongoose.model("blogPost");

  BlogPost.deleteMany({ _id: { $in: this.blogPosts } }).then(() => next());
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
