export interface SubNavLink {
  id: string;
  title: string;
  url: string;
}

export interface NavLink {
  id: string;
  title: string;
  url: string;
  subLinks?: SubNavLink[];
}

// Default navigation links
export const defaultNavLinks: NavLink[] = [
  {
    id: "masterclass",
    title: "Join Masterclass",
    url: "https://topmate.io/mariamparvez/1298664",
  },
  {
    id: "free-resources",
    title: "Free Resources",
    url: "#testimonials",
  },
  {
    id: "courses",
    title: "Courses",
    url: "#courses",
    subLinks: [], // Will be populated dynamically from courses
  },
  {
    id: "about",
    title: "About",
    url: "#about-coach",
  },
];

// Get all nav links from localStorage or return defaults
export function getNavLinks(): NavLink[] {
  try {
    const stored = localStorage.getItem("muxion_nav_links");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading nav links:", error);
  }
  
  // Initialize with defaults if not found
  localStorage.setItem("muxion_nav_links", JSON.stringify(defaultNavLinks));
  return defaultNavLinks;
}

// Save nav links to localStorage
export function saveNavLinks(links: NavLink[]): void {
  localStorage.setItem("muxion_nav_links", JSON.stringify(links));
}

// Add a new nav link
export function addNavLink(link: Omit<NavLink, "id">): NavLink {
  const navLinks = getNavLinks();
  const newLink: NavLink = {
    ...link,
    id: `nav-${Date.now()}`,
  };
  navLinks.push(newLink);
  saveNavLinks(navLinks);
  return newLink;
}

// Update a nav link
export function updateNavLink(id: string, updates: Partial<NavLink>): void {
  const navLinks = getNavLinks();
  const index = navLinks.findIndex((link) => link.id === id);
  if (index !== -1) {
    navLinks[index] = { ...navLinks[index], ...updates };
    saveNavLinks(navLinks);
  }
}

// Delete a nav link
export function deleteNavLink(id: string): void {
  const navLinks = getNavLinks();
  const filtered = navLinks.filter((link) => link.id !== id);
  saveNavLinks(filtered);
}

// Add a sub-link to a nav link
export function addSubLink(navLinkId: string, subLink: Omit<SubNavLink, "id">): void {
  const navLinks = getNavLinks();
  const navLink = navLinks.find((link) => link.id === navLinkId);
  if (navLink) {
    if (!navLink.subLinks) {
      navLink.subLinks = [];
    }
    const newSubLink: SubNavLink = {
      ...subLink,
      id: `sub-${Date.now()}`,
    };
    navLink.subLinks.push(newSubLink);
    saveNavLinks(navLinks);
  }
}

// Update a sub-link
export function updateSubLink(
  navLinkId: string,
  subLinkId: string,
  updates: Partial<SubNavLink>
): void {
  const navLinks = getNavLinks();
  const navLink = navLinks.find((link) => link.id === navLinkId);
  if (navLink && navLink.subLinks) {
    const index = navLink.subLinks.findIndex((sub) => sub.id === subLinkId);
    if (index !== -1) {
      navLink.subLinks[index] = { ...navLink.subLinks[index], ...updates };
      saveNavLinks(navLinks);
    }
  }
}

// Delete a sub-link
export function deleteSubLink(navLinkId: string, subLinkId: string): void {
  const navLinks = getNavLinks();
  const navLink = navLinks.find((link) => link.id === navLinkId);
  if (navLink && navLink.subLinks) {
    navLink.subLinks = navLink.subLinks.filter((sub) => sub.id !== subLinkId);
    saveNavLinks(navLinks);
  }
}
