import { z } from "zod";

export const communitySchema = z.object({
  name: z
    .string()
    .min(5, "Community name must be at least 5 characters long")
    .max(50, "Community name cannot exceed 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(300, "Description cannot exceed 300 characters"),
  topics: z
    .array(z.string())
    .min(1, "Select at least one topic")
    .max(5, "You can select up to 5 topics"),
});

export type CommunityInput = z.infer<typeof communitySchema>