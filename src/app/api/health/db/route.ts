import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$runCommandRaw({ ping: 1 });

    return Response.json({
      success: true,
      message: "MongoDB connected successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Log only the message to avoid triggering the broken code-frame renderer.
    console.error("MongoDB ping failed:", errorMessage);

    return Response.json(
      {
        success: false,
        message: "MongoDB connection failed",
        details:
          process.env.NODE_ENV === "development"
            ? errorMessage
            : "Check server configuration.",
      },
      { status: 500 },
    );
  }
}
