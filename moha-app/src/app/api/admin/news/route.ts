import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Helper for generating sluggified titles
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/[^\w\-]+/g, "") // remove all non-word chars
    .replace(/\-\-+/g, "-") // replace multiple - with single -
    .replace(/^-+/, "") // trim starting -
    .replace(/-+$/, ""); // trim ending -
}

export async function GET() {
  try {
    const news = await db.news.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error("Admin news fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, excerpt, imageUrl, category, author } = body;

    if (!title || title.trim().length < 5) {
      return NextResponse.json({ error: "Title must be at least 5 characters long." }, { status: 400 });
    }
    if (!content || content.trim().length < 20) {
      return NextResponse.json({ error: "Content must be at least 20 characters long." }, { status: 400 });
    }
    if (!excerpt || excerpt.trim().length < 10) {
      return NextResponse.json({ error: "Excerpt must be at least 10 characters." }, { status: 400 });
    }

    const baseSlug = slugify(title);
    // Ensure slug uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await db.news.findUnique({ where: { slug } });
      if (!existing) break;
      slug = `${baseSlug}-${counter++}`;
    }

    // Database access inside a transaction, logging the CRUD action to analytics
    const result = await db.$transaction(async (tx) => {
      const newsItem = await tx.news.create({
        data: {
          title: title.trim(),
          slug,
          content: content.trim(),
          excerpt: excerpt.trim(),
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1200&auto=format&fit=crop",
          category: category || "Update",
          author: author || "Admin",
        },
      });

      await tx.analyticsEvent.create({
        data: {
          eventType: "admin_crud",
          metadata: `Created news post: "${title}" (ID: ${newsItem.id})`,
        },
      });

      return newsItem;
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Admin news create error:", error);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}
