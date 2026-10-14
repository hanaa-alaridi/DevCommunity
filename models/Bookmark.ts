import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
    index: true },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "Post is required"],
    index: true },
  savedAt: {
    type: Date,
    default: Date.now }
});

bookmarkSchema.index({ user: 1, post: 1 }, { unique: true });

const Bookmark = mongoose.models.Bookmark || mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;