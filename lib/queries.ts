import {connectToDatabase} from "@/lib/db";
import User from "@/models/User";
import Community from "@/models/Community";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import Bookmark from "@/models/Bookmark";
import { GetPostsFilters } from "@/types/posts";

export async function getUserProfile(username: string) {
    await connectToDatabase();
    const user = await User.findOne({ username }).lean();
    if (!user) return null;
    const userPosts = await Post.find({ author: user._id }).populate("community", "name slug").sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify({ ...user, posts: userPosts }));
}

export async function getCommunities(search?: string) {
    await connectToDatabase();
    const query: Record<string, any> = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { descriptopn: { $regex: search, $options: "i" } }
        ];
    }
    const communities = await Community.find(query).populate("creator", "username image").sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(communities));
}

export async function getCommunityBySlug(slug: string) {
    await connectToDatabase();
    const community = await Community.findOne({ slug }).populate("creator", "username image").populate("members", "username image").lean();
    if (!community) return null;
    return JSON.parse(JSON.stringify(community));
}

export async function getPosts(filters: GetPostsFilters = {}) {
    await connectToDatabase();
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, filters.limit || 10);
    const skip = (page - 1) * limit;
    const query: Record<string, any> = {};
    if (filters.communityId) {
        query.community = filters.communityId;
    }
    if (filters.authorId) {
        query.author = filters.authorId;
    }
    if (filters.topic) {
        query.topics = { $in: [filters.topic] };
    }
    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: "i" } },
            { content: { $regex: filters.search, $options: "i" } }
        ];
    }
    let sortQuery: Record<string, any> = { createdAt: -1 };
    if (filters.sort === "oldest") {
        sortQuery = { createdAt: 1 };
    }
    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit) || 1;
    let postsQuery = Post.find(query).populate("author", "username image").populate("community", "name slug").sort(sortQuery).skip(skip).limit(limit).lean();
    const posts = await postsQuery;
    let sortedPosts = posts;
    if (filters.sort === "popular") {
        sortedPosts = [...posts].sort((a: any, b: any) => (b.comments?.length || 0) - (a.comments?.length || 0));
    }
    return JSON.parse(JSON.stringify({posts: sortedPosts, pagination: { totalPosts, totalPages, currentPage: page, limit, hasNextPage: page < totalPages, hasPrevPage: page > 1}}));
}

export async function getPostBySlug(slug: string) {
    await connectToDatabase();
    const post = await Post.findOne({ slug }).populate("author", "username bio image skills").populate("community", "name slug topics").populate({path: "comments.author", select: "username image"}).lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
}

export async function getCommentsByPostId(postId: string) {
    await connectToDatabase();
    const comments = await Comment.find({ post: postId }).populate("author", "username image").sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(comments));
}

export async function getUserBookmarks(userId: string) {
    await connectToDatabase();
    const bookmarks = await Bookmark.find({ user: userId }).populate({path: "post", populate: [ {path: "author", select: "username image"}, {path: "community", select: "name slug"}]}).sort({_id: -1}).lean();
    return JSON.parse(JSON.stringify(bookmarks));
}