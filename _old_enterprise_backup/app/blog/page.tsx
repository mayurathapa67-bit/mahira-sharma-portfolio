import { getBlogArticles } from "@/lib/data";
import { SectionHeading } from "@/components/section-heading";
import { BlogGrid } from "@/components/blog-grid";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const articles = await getBlogArticles();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="SEO Insights"
        title="Data-driven thinking"
        subtitle="Field notes on technical SEO, content systems, and the algorithm shifts that matter."
      />
      <div className="mt-10">
        <BlogGrid articles={articles} />
      </div>
    </div>
  );
}
