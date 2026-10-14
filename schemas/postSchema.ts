import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(120, "Title cannot exceed 120 characters"),
  content: z
    .string()
    .min(20, "Content must be at least 20 characters long"),
  community: z
    .string()
    .min(1, "Please select a community"),
  topics: z
    .array(z.string())
    .min(1, "Select at least one topic")
    .max(5, "You can select up to 5 topics"),
});

export type PostInput = z.infer<typeof postSchema>;