import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";
import { Prisma } from "@prisma/client";

type BlogData = {
  title: string;
  content: Prisma.InputJsonValue;
};

// Extract plain text from Tiptap JSON
function extractText(value: unknown): string {
  if (!value || typeof value !== "object") {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map(extractText).join(" ");
  }

  const node = value as Record<string, unknown>;

  const ownText = typeof node.text === "string" ? node.text : "";

  const childText = Array.isArray(node.content)
    ? extractText(node.content)
    : "";

  return `${ownText} ${childText}`.trim();
}

// Create blog
export async function createBlog(data: BlogData) {
  const slug = await generateUniqueSlug(data.title);

  return prisma.blog.create({
    data: {
      title: data.title,
      slug,
      content: data.content,
    },
  });
}

// Fetch all blogs
export async function getAllBlogs() {
  const blogs = await prisma.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return blogs.map((blog) => {
    const plainText = extractText(blog.content);
    const excerpt =
      plainText.length > 160 ? `${plainText.slice(0, 160)}...` : plainText;

    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  });
}

// Fetch single blog by ID
export async function getBlogById(id: string) {
  return prisma.blog.findUnique({
    where: { id },
  });
}

// Fetch single blog by slug
export async function getBlogBySlug(slug: string) {
  return prisma.blog.findUnique({
    where: { slug },
  });
}

// Update blog
export async function updateBlog(id: string, data: BlogData) {
  return prisma.blog.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
    },
  });
}

// Delete blog
export async function deleteBlog(id: string) {
  return prisma.blog.delete({
    where: { id },
  });
}
