import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"],
    index: true },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "Post is required"],
    index: true },
  content: {
    type: String,
    required: [true, "Content is required"] }
}, 
    { timestamps: true }
);

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;