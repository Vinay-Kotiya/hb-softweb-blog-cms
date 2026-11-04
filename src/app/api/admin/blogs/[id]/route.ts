import { NextRequest, NextResponse } from "next/server";

import { getBlogById, updateBlog, deleteBlog } from "@/services/blog.service";

import { blogSchema } from "@/lib/validations/blog";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const isValidId = (id: string) => /^[a-f\d]{24}$/i.test(id);

// GET single blog
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID" },
        { status: 400 },
      );
    }

    const blog = await getBlogById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Get blog error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch blog" },
      { status: 500 },
    );
  }
}

// UPDATE blog
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID" },
        { status: 400 },
      );
    }

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

    const existingBlog = await getBlogById(id);

    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 },
      );
    }

    const blog = await updateBlog(id, {
      ...validation.data,
      content: validation.data.content as Parameters<typeof updateBlog>[1]["content"],
    });

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Update blog error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update blog" },
      { status: 500 },
    );
  }
}

// DELETE blog
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!isValidId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid blog ID" },
        { status: 400 },
      );
    }

    const existingBlog = await getBlogById(id);

    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 },
      );
    }

    await deleteBlog(id);

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete blog" },
      { status: 500 },
    );
  }
}
