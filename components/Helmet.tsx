"use client";
import { useEffect } from "react";

export interface HelmetProps {
  title: string;
  description?: string;
  keywords?: string;
  noIndex?: boolean;
}

/**
 * Helmet component to dynamically manage document head, title, and meta tags
 * across all client and server pages in the StockSense AI application.
 */
export default function Helmet({
  title,
  description = "StockSense AI - Intelligent market insights, price alerts, and stock analysis.",
  keywords,
  noIndex = false,
}: HelmetProps) {
  useEffect(() => {
    // 1. Set document title
    const fullTitle = title.toLowerCase().includes("stocksense")
      ? title
      : `${title} | StockSense AI`;
    document.title = fullTitle;

    // Helper to get or create meta tag
    const getOrCreateMeta = (attr: "name" | "property", value: string) => {
      let el = document.querySelector(`meta[${attr}="${value}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      return el;
    };

    // 2. Set description
    if (description) {
      const descMeta = getOrCreateMeta("name", "description");
      descMeta.setAttribute("content", description);

      const ogDescMeta = getOrCreateMeta("property", "og:description");
      ogDescMeta.setAttribute("content", description);
    }

    // 3. Set OpenGraph Title
    const ogTitleMeta = getOrCreateMeta("property", "og:title");
    ogTitleMeta.setAttribute("content", fullTitle);

    // 4. Set keywords
    if (keywords) {
      const kwMeta = getOrCreateMeta("name", "keywords");
      kwMeta.setAttribute("content", keywords);
    }

    // 5. Robots
    const robotsMeta = getOrCreateMeta("name", "robots");
    robotsMeta.setAttribute(
      "content",
      noIndex ? "noindex, nofollow" : "index, follow"
    );
  }, [title, description, keywords, noIndex]);

  return null;
}
