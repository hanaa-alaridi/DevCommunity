import { z } from "zod";

export const userProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be under 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(160, "Bio cannot exceed 160 characters").optional(),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  skills: z.array(z.string()).optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;