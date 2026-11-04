import { NextRequest, NextResponse } from "next/server";
import { createBlog, getAllBlogs } from "@/services/blog.service";

import { blogSchema } from "@/lib/validations/blog";

export async function GET() {
  try {
    const blogs = await getAllBlogs();

    return NextResponse.json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    console.error("Fetch blogs error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = blogSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const blog = await createBlog(
      validation.data as unknown as Parameters<typeof createBlog>[0],
    );

    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully",
        data: blog,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create blog error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create blog" },
      { status: 500 },
    );
  }
}
