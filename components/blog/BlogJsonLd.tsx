import { BlogPost } from "@/lib/blog/types";

interface BlogJsonLdProps {
  post: BlogPost;
}

export function BlogJsonLd({ post }: BlogJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Stylo",
      logo: {
        "@type": "ImageObject",
        url: "https://stylo.app/icon-512.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://stylo.app/${post.locale}/blog/${post.slug}`,
    },
    wordCount: post.content.split(/\s+/).length,
    inLanguage: post.locale,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
