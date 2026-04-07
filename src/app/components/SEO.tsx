import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEO({
  title = "MUXION - Master UI/UX Design Course | Best Design Training in India & Pakistan",
  description = "Learn UI/UX Design, Figma, Adobe Photoshop & Illustrator with MUXION. Top-rated design courses by Mariam Parvez. Affordable pricing starting ₹299. Enroll now for lifetime access!",
  keywords = [
    "MUXION",
    "MUX",
    "UI UX design course",
    "UI UX course India",
    "UI UX course Pakistan",
    "design course online",
    "Figma course",
    "Adobe Photoshop course",
    "Adobe Illustrator course",
    "UI design training",
    "UX design training",
    "web design course",
    "graphic design course",
    "design bootcamp",
    "online design course",
    "UI UX certification",
    "learn UI design",
    "learn UX design",
    "best UI UX course",
    "affordable design course",
    "Mariam Parvez design course",
    "MUXION design",
    "MUXION India",
    "MUXION Pakistan",
    "user interface design course",
    "user experience design course",
    "design thinking course",
    "product design course",
    "digital design course",
    "app design course",
    "website design course",
    "UI UX masterclass",
    "design course ₹299",
    "design course ₹599",
    "cheap UI UX course",
    "best design platform",
    "online learning platform",
    "maths physics chemistry course",
    "school students course",
    "CBSE course",
    "state board course"
  ],
  image = "https://muxion.in/og-image.jpg",
  url = "https://muxion.in",
  type = "website",
  author = "Mariam Parvez",
  publishedTime,
  modifiedTime
}: SEOProps) {
  
  useEffect(() => {
    // Set document title
    document.title = title;

    // Set or update meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute("content", content);
    };

    // Basic Meta Tags
    setMetaTag("description", description);
    setMetaTag("keywords", keywords.join(", "));
    setMetaTag("author", author);
    setMetaTag("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMetaTag("googlebot", "index, follow");
    setMetaTag("bingbot", "index, follow");
    setMetaTag("language", "English, Hindi, Urdu");
    setMetaTag("revisit-after", "7 days");
    setMetaTag("rating", "General");
    setMetaTag("distribution", "global");
    setMetaTag("coverage", "Worldwide");
    setMetaTag("target", "all");
    setMetaTag("audience", "Students, Designers, Professionals");

    // Geo Tags for India & Pakistan
    setMetaTag("geo.region", "IN");
    setMetaTag("geo.placename", "India");
    setMetaTag("geo.region", "PK");
    setMetaTag("geo.placename", "Pakistan");

    // Open Graph Tags (Facebook, LinkedIn)
    setMetaTag("og:title", title, true);
    setMetaTag("og:description", description, true);
    setMetaTag("og:type", type, true);
    setMetaTag("og:url", url, true);
    setMetaTag("og:image", image, true);
    setMetaTag("og:image:width", "1200", true);
    setMetaTag("og:image:height", "630", true);
    setMetaTag("og:site_name", "MUXION", true);
    setMetaTag("og:locale", "en_IN", true);
    setMetaTag("og:locale:alternate", "en_PK", true);

    // Twitter Card Tags
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description);
    setMetaTag("twitter:image", image);
    setMetaTag("twitter:site", "@MUXION");
    setMetaTag("twitter:creator", "@MariamParvez");

    // Mobile & App Tags
    setMetaTag("mobile-web-app-capable", "yes");
    setMetaTag("apple-mobile-web-app-capable", "yes");
    setMetaTag("apple-mobile-web-app-status-bar-style", "black-translucent");
    setMetaTag("apple-mobile-web-app-title", "MUXION");
    setMetaTag("application-name", "MUXION");
    setMetaTag("msapplication-TileColor", "#3b82f6");
    setMetaTag("theme-color", "#0a0f1e");

    // Article specific tags
    if (publishedTime) {
      setMetaTag("article:published_time", publishedTime, true);
    }
    if (modifiedTime) {
      setMetaTag("article:modified_time", modifiedTime, true);
    }
    if (author) {
      setMetaTag("article:author", author, true);
    }

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // Alternate links for language
    const setAlternateLink = (lang: string, href: string) => {
      let link = document.querySelector(`link[hreflang="${lang}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "alternate");
        link.setAttribute("hreflang", lang);
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    setAlternateLink("en-IN", url);
    setAlternateLink("en-PK", url);
    setAlternateLink("en", url);
    setAlternateLink("x-default", url);

  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime]);

  return null;
}
