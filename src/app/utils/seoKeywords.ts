/**
 * SEO Keywords for MUXION
 * Optimized for India & Pakistan markets
 */

export const PRIMARY_KEYWORDS = [
  "MUXION",
  "MUX",
  "UI UX design course",
  "UI UX course India",
  "UI UX course Pakistan",
  "design course online",
  "best UI UX course",
  "Mariam Parvez"
];

export const SECONDARY_KEYWORDS = [
  "Figma course",
  "Adobe Photoshop course",
  "Adobe Illustrator course",
  "affordable design course",
  "online learning platform",
  "design training India",
  "design training Pakistan",
  "UI design course",
  "UX design course",
  "graphic design course"
];

export const LONG_TAIL_KEYWORDS = [
  "best UI UX design course in India",
  "affordable online design courses Pakistan",
  "learn Figma online India",
  "UI UX certification course",
  "design bootcamp online",
  "user interface design course online",
  "user experience design training",
  "Mariam Parvez design course",
  "design course ₹299",
  "design course ₹599",
  "cheap UI UX course India",
  "best design learning platform",
  "online design courses with certificate",
  "UI UX masterclass India",
  "Figma training online Pakistan"
];

export const ACADEMIC_KEYWORDS = [
  "maths course online",
  "physics course online",
  "chemistry course online",
  "CBSE online courses",
  "class 9 online courses",
  "class 10 online courses",
  "class 11 online courses",
  "class 12 online courses",
  "state board online courses",
  "Farzana Shaheen maths",
  "Syed Yaseen physics"
];

export const LOCATION_KEYWORDS = [
  "India",
  "Pakistan",
  "Indian design course",
  "Pakistani design course",
  "South Asia design training",
  "online courses India Pakistan"
];

export const BRAND_VARIATIONS = [
  "MUXION",
  "MUX",
  "Muxion",
  "muxion.in",
  "Muxion Design",
  "Muxion Learning",
  "Muxion Platform"
];

/**
 * Get all keywords combined
 */
export function getAllKeywords(): string[] {
  return [
    ...PRIMARY_KEYWORDS,
    ...SECONDARY_KEYWORDS,
    ...LONG_TAIL_KEYWORDS,
    ...ACADEMIC_KEYWORDS,
    ...LOCATION_KEYWORDS,
    ...BRAND_VARIATIONS
  ];
}

/**
 * Get keywords for specific course
 */
export function getCourseKeywords(courseId: string): string[] {
  const baseKeywords = [...PRIMARY_KEYWORDS, ...LOCATION_KEYWORDS];
  
  switch (courseId) {
    case "uiux":
      return [
        ...baseKeywords,
        "UI UX design course",
        "UI UX mastery",
        "user interface course",
        "user experience course",
        "UI UX training India",
        "UI UX certification"
      ];
    
    case "figma":
      return [
        ...baseKeywords,
        "Figma course",
        "Learn Figma",
        "Figma training",
        "Figma tutorial",
        "Figma design course",
        "Figma masterclass"
      ];
    
    case "photoshop":
      return [
        ...baseKeywords,
        "Adobe Photoshop course",
        "Photoshop training",
        "Learn Photoshop",
        "Photoshop tutorial",
        "Photo editing course",
        "Photoshop masterclass"
      ];
    
    case "illustrator":
      return [
        ...baseKeywords,
        "Adobe Illustrator course",
        "Illustrator training",
        "Learn Illustrator",
        "Vector design course",
        "Graphic design course",
        "Illustrator masterclass"
      ];
    
    case "maths":
      return [
        ...baseKeywords,
        ...ACADEMIC_KEYWORDS,
        "maths course",
        "mathematics online",
        "Farzana Shaheen maths",
        "class 9-12 maths"
      ];
    
    case "physics":
      return [
        ...baseKeywords,
        ...ACADEMIC_KEYWORDS,
        "physics course",
        "physics online",
        "Syed Yaseen physics",
        "class 9-12 physics"
      ];
    
    case "chemistry":
      return [
        ...baseKeywords,
        ...ACADEMIC_KEYWORDS,
        "chemistry course",
        "chemistry online",
        "Farzana Shaheen chemistry",
        "class 9-12 chemistry"
      ];
    
    default:
      return baseKeywords;
  }
}

/**
 * Generate dynamic page title
 */
export function generatePageTitle(page: string, courseName?: string): string {
  switch (page) {
    case "home":
      return "MUXION - Best UI/UX Design Course in India & Pakistan | Learn from Expert Mariam Parvez";
    
    case "course":
      return `${courseName} - MUXION | Affordable Online Course with Lifetime Access`;
    
    case "login":
      return "Login to MUXION - Access Your Design Courses | India & Pakistan";
    
    case "profile":
      return "My Profile - MUXION | Manage Your Learning Journey";
    
    case "admin":
      return "Admin Dashboard - MUXION | Manage Courses & Revenue";
    
    default:
      return "MUXION - Best UI/UX Design & Academic Courses Online";
  }
}

/**
 * Generate dynamic meta description
 */
export function generateMetaDescription(page: string, courseName?: string): string {
  switch (page) {
    case "home":
      return "Learn UI/UX Design, Figma, Adobe Photoshop & Illustrator with MUXION. India & Pakistan's top-rated design courses by Mariam Parvez. Affordable pricing starting ₹299. Plus Maths, Physics, Chemistry for Classes 9-12. Enroll now for lifetime access!";
    
    case "course":
      return `Master ${courseName} with MUXION's comprehensive online course. Expert instruction, lifetime access, and affordable pricing. Join thousands of students learning design in India & Pakistan.`;
    
    case "login":
      return "Sign in to MUXION to access your design courses. Learn UI/UX, Figma, Adobe Creative Suite from expert instructor Mariam Parvez. Start your design journey today!";
    
    case "profile":
      return "Manage your MUXION profile, track course progress, and access your purchased design courses. Lifetime learning with expert support.";
    
    default:
      return "MUXION - Premier online learning platform for UI/UX Design and Academic courses in India & Pakistan. Affordable, expert-led courses with lifetime access.";
  }
}

/**
 * SEO Best Practices Checklist
 */
export const SEO_CHECKLIST = {
  technical: [
    "Sitemap.xml created and submitted",
    "Robots.txt configured",
    "Canonical URLs set",
    "Meta tags on all pages",
    "Schema markup implemented",
    "Mobile responsive",
    "Fast page load (<3s)",
    "HTTPS enabled",
    "404 page created",
    "301 redirects configured"
  ],
  content: [
    "Unique title tags (50-60 chars)",
    "Meta descriptions (155-160 chars)",
    "H1 tags with keywords",
    "H2/H3 tags optimized",
    "Alt text on images",
    "Internal linking structure",
    "Keyword density 2-3%",
    "Long-form content (2000+ words)",
    "FAQ sections",
    "Regular content updates"
  ],
  offPage: [
    "Google My Business listing",
    "Social media profiles",
    "Quality backlinks (50+)",
    "Guest posting",
    "Directory submissions",
    "Student reviews/testimonials",
    "Video content (YouTube)",
    "Blog/articles",
    "Community engagement",
    "Influencer partnerships"
  ],
  local: [
    "India geo-targeting",
    "Pakistan geo-targeting",
    "Local keywords",
    "Local citations",
    "Regional content",
    "Language alternatives",
    "Local business directories",
    "Regional testimonials"
  ]
};

/**
 * Track keyword performance (for future analytics)
 */
export function trackKeywordUsage(keyword: string, location: string) {
  const trackingData = {
    keyword,
    location,
    timestamp: new Date().toISOString(),
    url: window.location.href
  };
  
  // Store in localStorage for now (in production, send to analytics)
  const existing = JSON.parse(localStorage.getItem("muxion_keyword_tracking") || "[]");
  existing.push(trackingData);
  
  // Keep only last 1000 entries
  if (existing.length > 1000) {
    existing.shift();
  }
  
  localStorage.setItem("muxion_keyword_tracking", JSON.stringify(existing));
}

/**
 * Get suggested keywords based on course
 */
export function getSuggestedKeywords(courseId: string): string[] {
  const suggestions: Record<string, string[]> = {
    uiux: [
      "Add blog post: 'How to Start UI/UX Career in India'",
      "Create comparison: 'UI vs UX Design'",
      "Add case study: 'Student Success Stories'",
      "Write guide: 'Best UI/UX Tools 2024'"
    ],
    figma: [
      "Add tutorial: 'Figma for Beginners'",
      "Create guide: 'Figma vs Adobe XD'",
      "Add tips: 'Top 10 Figma Plugins'",
      "Write article: 'Figma Auto Layout Guide'"
    ],
    photoshop: [
      "Add tutorial: 'Photo Editing Basics'",
      "Create guide: 'Photoshop Shortcuts'",
      "Add tips: 'Color Correction Techniques'",
      "Write article: 'Photoshop vs Lightroom'"
    ]
  };
  
  return suggestions[courseId] || [];
}
