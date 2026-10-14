import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  slug: { 
    type: String, 
    required: [true, "Slug is required"],
    unique: true },
  name: { 
    type: String, 
    required: [true, "Name is required"] },
  description: { 
    type: String, 
    default: "" },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Creator is required"] },
  topics: {
    type: [String], 
    default: [] },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"}]
});

const Community = mongoose.models.Community || mongoose.model("Community", communitySchema);

export default Community;