import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { Reveal } from "./reveal";

export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  const latest = Array.isArray(posts) ? posts.slice(0, 3) : [];
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {latest.map((post, i) => (
        <Reveal key={post.slug} delay={i * 0.05}>
          <article className="group flex h-full flex-col border-b border-charcoal/10 pb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-teal">
              {post.category}
            </span>
            <h3 className="mt-3 font-heading text-lg font-bold leading-snug text-charcoal group-hover:text-teal">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/60">
              {post.excerpt}
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-charcoal/45">
              <span className="flex items-center gap-1">
                <Clock size={13} /> {post.read_time} min read
              </span>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1 font-medium text-teal"
              >
                Read <ArrowUpRight size={14} />
              </Link>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
