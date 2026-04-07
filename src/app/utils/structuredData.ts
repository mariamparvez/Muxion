import { CourseData } from "../data/coursesData";

// Generate JSON-LD structured data for organization
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "MUXION",
    "alternateName": ["MUX", "Muxion Design"],
    "url": "https://muxion.in",
    "logo": "https://muxion.in/logo.png",
    "description": "Premier online learning platform for UI/UX Design, Graphic Design, and Academic courses in India and Pakistan. Learn from industry experts with affordable, lifetime access courses.",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "Mariam Parvez",
      "jobTitle": "Lead Instructor & Founder",
      "email": "designwithmariam@gmail.com"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": ["IN", "PK"],
      "addressRegion": "India & Pakistan"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8807557977",
      "contactType": "Customer Service",
      "areaServed": ["IN", "PK"],
      "availableLanguage": ["English", "Hindi", "Urdu"]
    },
    "sameAs": [
      "https://www.instagram.com/muxion",
      "https://www.facebook.com/muxion",
      "https://www.linkedin.com/company/muxion",
      "https://twitter.com/muxion"
    ],
    "areaServed": {
      "@type": "Place",
      "name": ["India", "Pakistan"]
    },
    "knowsAbout": [
      "UI Design",
      "UX Design",
      "Graphic Design",
      "Web Design",
      "Product Design",
      "Figma",
      "Adobe Creative Suite"
    ]
  };
}

// Generate JSON-LD structured data for course
export function generateCourseSchema(course: CourseData) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "MUXION",
      "sameAs": "https://muxion.in"
    },
    "instructor": {
      "@type": "Person",
      "name": course.instructor,
      "jobTitle": "Lead Instructor"
    },
    "offers": {
      "@type": "Offer",
      "category": "Paid",
      "price": course.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `https://muxion.in/course/${course.id}`,
      "validFrom": "2024-01-01"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "courseWorkload": course.duration,
      "instructor": {
        "@type": "Person",
        "name": course.instructor
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": course.rating,
      "bestRating": "5",
      "ratingCount": course.students || 1000
    },
    "educationalLevel": "All Levels",
    "teaches": course.title,
    "inLanguage": "en",
    "coursePrerequisites": "None",
    "numberOfLessons": course.lessons.length,
    "timeRequired": course.duration,
    "isAccessibleForFree": false
  };
}

// Generate JSON-LD for all courses (ItemList)
export function generateCoursesListSchema(courses: CourseData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "MUXION Courses",
    "description": "Complete list of design and academic courses offered by MUXION",
    "numberOfItems": courses.length,
    "itemListElement": courses.map((course, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Course",
        "name": course.title,
        "url": `https://muxion.in/course/${course.id}`,
        "description": course.description,
        "provider": {
          "@type": "Organization",
          "name": "MUXION"
        },
        "offers": {
          "@type": "Offer",
          "price": course.price,
          "priceCurrency": "INR"
        }
      }
    }))
  };
}

// Generate JSON-LD for website
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MUXION",
    "alternateName": "MUX",
    "url": "https://muxion.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://muxion.in/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MUXION",
      "logo": {
        "@type": "ImageObject",
        "url": "https://muxion.in/logo.png"
      }
    }
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// Generate FAQ structured data
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Generate review/rating schema
export function generateReviewSchema(reviews: Array<{
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}>) {
  return reviews.map(review => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating,
      "bestRating": "5"
    },
    "reviewBody": review.reviewBody,
    "datePublished": review.datePublished,
    "publisher": {
      "@type": "Organization",
      "name": "MUXION"
    }
  }));
}

// Insert structured data into page
export function insertStructuredData(data: object | object[]) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(Array.isArray(data) ? data : data);
  document.head.appendChild(script);
  return script;
}
