import { z } from "zod";

export const blogContentSchema = z
  .object({
    type: z.literal("doc"),
    content: z.array(z.unknown()).optional(),
  })
  .passthrough();

export const blogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Blog title is required")
    .max(180, "Title cannot exceed 180 characters"),

  content: blogContentSchema,
});

export type BlogInput = z.infer<typeof blogSchema>;
