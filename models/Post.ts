import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"] },
  content: {
    type: String,
    required: [true, "Comment content is required"] },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" }]
},
  { timestamps: true }
);

const postSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, "Slug is required"],
    unique: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"],
    index: true },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
    required: [true, "Community is required"],
    index: true },
  title: {
    type: String,
    required: [true, "Title is required"] },
  content: {
    type: String,
    required: [true, "Content is required"] },
  topics: {
    type: [String],
    default: [], 
    index: true },
  comments: {
    type: [commentSchema], 
    default: [] },
  likes: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" }]
}, 
  { timestamps: true }
);

postSchema.index({ title: "text", content: "text" });

postSchema.index({ createdAt: -1 });

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;