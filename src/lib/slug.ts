import { prisma } from "@/lib/prisma";

export function slugify(value: string): string {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "blog"
  );
}

export async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title);

  let slug = baseSlug;
  let counter = 2;

  while (
    await prisma.blog.findUnique({
      where: { slug },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
