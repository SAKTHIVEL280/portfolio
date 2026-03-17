import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const DEFAULT_IMAGE = "/og-image.svg";

const getSiteUrl = () => {
  const configured = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
};

const ensureMeta = (attr: "name" | "property", key: string, content: string) => {
  let tag = document.head.querySelector(`meta[${attr}='${key}']`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const ensureCanonical = (href: string) => {
  let tag = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
};

const ensureJsonLd = (payload: Record<string, unknown> | Array<Record<string, unknown>>) => {
  const id = "seo-jsonld";
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
};

const Seo = ({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  schema,
}: SeoProps) => {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const canonical = siteUrl ? `${siteUrl}${normalizedPath}` : normalizedPath;
    const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

    document.title = title;
    ensureCanonical(canonical);

    const robots = noindex
      ? "noindex,nofollow,noarchive"
      : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

    ensureMeta("name", "description", description);
    ensureMeta("name", "robots", robots);
    ensureMeta("name", "twitter:card", "summary_large_image");
    ensureMeta("name", "twitter:title", title);
    ensureMeta("name", "twitter:description", description);
    ensureMeta("name", "twitter:image", imageUrl);

    ensureMeta("property", "og:title", title);
    ensureMeta("property", "og:description", description);
    ensureMeta("property", "og:type", type);
    ensureMeta("property", "og:url", canonical);
    ensureMeta("property", "og:image", imageUrl);
    ensureMeta("property", "og:site_name", "Sakthivel Portfolio");
    ensureMeta("property", "og:locale", "en_US");

    if (schema) {
      ensureJsonLd(schema);
      return;
    }

    const fallbackSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: canonical,
    };
    ensureJsonLd(fallbackSchema);
  }, [title, description, path, image, type, noindex, schema]);

  return null;
};

export default Seo;
