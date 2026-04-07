import { useEffect } from "react";

// Component to add manifest and additional meta tags dynamically
export function AdditionalMetaTags() {
  useEffect(() => {
    // Add manifest link
    let manifest = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!manifest) {
      manifest = document.createElement("link");
      manifest.setAttribute("rel", "manifest");
      document.head.appendChild(manifest);
    }
    manifest.setAttribute("href", "/manifest.json");

    // Add humans.txt link
    let humans = document.querySelector('link[rel="author"]') as HTMLLinkElement;
    if (!humans) {
      humans = document.createElement("link");
      humans.setAttribute("rel", "author");
      humans.setAttribute("type", "text/plain");
      document.head.appendChild(humans);
    }
    humans.setAttribute("href", "/humans.txt");

    // Add DNS prefetch for performance
    const dnsPrefetchDomains = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
    ];

    dnsPrefetchDomains.forEach(domain => {
      let link = document.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "dns-prefetch");
        link.setAttribute("href", domain);
        document.head.appendChild(link);
      }
    });

    // Add preconnect for critical resources
    const preconnectDomains = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
    ];

    preconnectDomains.forEach(domain => {
      let link = document.querySelector(`link[rel="preconnect"][href="${domain}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "preconnect");
        link.setAttribute("href", domain);
        link.setAttribute("crossorigin", "");
        document.head.appendChild(link);
      }
    });

    // Set language
    document.documentElement.lang = "en-IN";

  }, []);

  return null;
}
