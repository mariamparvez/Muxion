// Import videos
import introVideo from "../../imports/intro.mp4";
import video1 from "../../imports/1.mp4";
import video2 from "../../imports/2.mp4";
import video3 from "../../imports/3.mp4";
import video4 from "../../imports/4.mp4";
import upcomingVideo from "../../imports/upcoming-video.mp4";

export interface Lesson {
  id: number;
  title: string;
  videoUrl: string;
  duration: string;
  description?: string;
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  price: number;
  paymentLink?: string; // Razorpay payment link
  lessons: Lesson[];
}

// UI/UX Design Course
export const uiuxCourse: CourseData = {
  id: "uiux",
  title: "UI/UX Mastery",
  description: "Master the essentials of UI/UX design and development, from foundational principles to advanced techniques, with Mariam Parvez guiding you every step of the way.",
  instructor: "Mariam Parvez",
  rating: 5.0,
  students: 0,
  duration: "30 mins",
  price: 599,
  paymentLink: "https://rzp.io/rzp/uiuxmuxion",
  lessons: [
    {
      id: 1,
      title: "Course Intro",
      videoUrl: introVideo,
      duration: "2:30",
      description: "Welcome to the UI/UX Design course! Get an overview of what you'll learn.",
    },
    {
      id: 2,
      title: "What is UX Design?",
      videoUrl: video1,
      duration: "5:45",
      description: "Understand the fundamentals of User Experience Design.",
    },
    {
      id: 3,
      title: "Stages of UX Design",
      videoUrl: video2,
      duration: "7:20",
      description: "Learn the complete UX design process from research to delivery.",
    },
    {
      id: 4,
      title: "Graphic Design Fundamentals",
      videoUrl: video3,
      duration: "6:15",
      description: "Master the core principles of visual design.",
    },
    {
      id: 5,
      title: "Layout & Composition",
      videoUrl: video4,
      duration: "8:30",
      description: "Create balanced and effective layouts.",
    },
    {
      id: 6,
      title: "Next Video is out on Next Wednesday!",
      videoUrl: upcomingVideo,
      duration: "1:00",
      description: "Stay tuned for new content every Wednesday!",
    },
  ],
};

// Adobe Photoshop Course
export const photoshopCourse: CourseData = {
  id: "photoshop",
  title: "Adobe Photoshop",
  description: "Learn professional photo editing, digital art creation, and advanced image manipulation techniques with Adobe Photoshop.",
  instructor: "Mariam Parvez",
  rating: 5.0,
  students: 0,
  duration: "30 mins",
  price: 299,
  paymentLink: "https://rzp.io/rzp/photoshopmuxion",
  lessons: [
    {
      id: 1,
      title: "Introduction to Photoshop",
      videoUrl: introVideo,
      duration: "2:30",
      description: "Get started with Adobe Photoshop interface and tools.",
    },
    {
      id: 2,
      title: "Layers and Masking",
      videoUrl: video1,
      duration: "5:45",
      description: "Master the power of layers and masks for non-destructive editing.",
    },
    {
      id: 3,
      title: "Photo Retouching Basics",
      videoUrl: video2,
      duration: "7:20",
      description: "Learn essential photo retouching and enhancement techniques.",
    },
    {
      id: 4,
      title: "Working with Colors",
      videoUrl: video3,
      duration: "6:15",
      description: "Understand color theory and color correction in Photoshop.",
    },
    {
      id: 5,
      title: "Advanced Selections",
      videoUrl: video4,
      duration: "8:30",
      description: "Create precise selections for complex photo editing.",
    },
    {
      id: 6,
      title: "Next Video is out on Next Wednesday!",
      videoUrl: upcomingVideo,
      duration: "1:00",
      description: "New content added every Wednesday!",
    },
  ],
};

// Adobe Illustrator Course
export const illustratorCourse: CourseData = {
  id: "illustrator",
  title: "Adobe Illustrator",
  description: "Master vector graphics, logo design, and illustration with Adobe Illustrator - the industry-standard tool for graphic design.",
  instructor: "Mariam Parvez",
  rating: 5.0,
  students: 0,
  duration: "30 mins",
  price: 299,
  paymentLink: "https://rzp.io/rzp/illustratormuxion",
  lessons: [
    {
      id: 1,
      title: "Getting Started with Illustrator",
      videoUrl: introVideo,
      duration: "2:30",
      description: "Navigate the Illustrator workspace and essential tools.",
    },
    {
      id: 2,
      title: "Vector Shapes and Paths",
      videoUrl: video1,
      duration: "5:45",
      description: "Create and manipulate vector shapes and paths.",
    },
    {
      id: 3,
      title: "Working with the Pen Tool",
      videoUrl: video2,
      duration: "7:20",
      description: "Master the pen tool for precise vector drawing.",
    },
    {
      id: 4,
      title: "Typography in Illustrator",
      videoUrl: video3,
      duration: "6:15",
      description: "Create stunning text designs and effects.",
    },
    {
      id: 5,
      title: "Logo Design Fundamentals",
      videoUrl: video4,
      duration: "8:30",
      description: "Design professional logos from concept to completion.",
    },
    {
      id: 6,
      title: "Next Video is out on Next Wednesday!",
      videoUrl: upcomingVideo,
      duration: "1:00",
      description: "Fresh content every Wednesday!",
    },
  ],
};

// Figma Course
export const figmaCourse: CourseData = {
  id: "figma",
  title: "Figma",
  description: "Master Figma, the collaborative interface design tool used by top design teams worldwide.",
  instructor: "Mariam Parvez",
  rating: 5.0,
  students: 0,
  duration: "30 mins",
  price: 349,
  paymentLink: "https://rzp.io/rzp/figmamuxion",
  lessons: [
    {
      id: 1,
      title: "Introduction to Figma",
      videoUrl: introVideo,
      duration: "2:30",
      description: "Explore the Figma interface and collaboration features.",
    },
    {
      id: 2,
      title: "Frames and Auto Layout",
      videoUrl: video1,
      duration: "5:45",
      description: "Create responsive designs with frames and auto layout.",
    },
    {
      id: 3,
      title: "Components and Variants",
      videoUrl: video2,
      duration: "7:20",
      description: "Build reusable design systems with components.",
    },
    {
      id: 4,
      title: "Prototyping Interactions",
      videoUrl: video3,
      duration: "6:15",
      description: "Create interactive prototypes and animations.",
    },
    {
      id: 5,
      title: "Design Handoff",
      videoUrl: video4,
      duration: "8:30",
      description: "Prepare designs for development and export assets.",
    },
    {
      id: 6,
      title: "Next Video is out on Next Wednesday!",
      videoUrl: upcomingVideo,
      duration: "1:00",
      description: "New lessons every Wednesday!",
    },
  ],
};

// Frontend Development Course
export const frontendCourse: CourseData = {
  id: "frontend",
  title: "Frontend Development Basics",
  description: "Learn HTML, CSS, and JavaScript fundamentals to start building modern, responsive websites.",
  instructor: "Mariam Parvez",
  rating: 5.0,
  students: 0,
  duration: "30 mins",
  price: 299,
  paymentLink: "https://rzp.io/rzp/frontendmuxion",
  lessons: [
    {
      id: 1,
      title: "HTML Fundamentals",
      videoUrl: introVideo,
      duration: "2:30",
      description: "Learn the structure and semantics of HTML.",
    },
    {
      id: 2,
      title: "CSS Styling Basics",
      videoUrl: video1,
      duration: "5:45",
      description: "Style your web pages with CSS.",
    },
    {
      id: 3,
      title: "Responsive Design",
      videoUrl: video2,
      duration: "7:20",
      description: "Create layouts that work on all devices.",
    },
    {
      id: 4,
      title: "JavaScript Essentials",
      videoUrl: video3,
      duration: "6:15",
      description: "Add interactivity with JavaScript basics.",
    },
    {
      id: 5,
      title: "Modern CSS Techniques",
      videoUrl: video4,
      duration: "8:30",
      description: "Master Flexbox, Grid, and modern CSS features.",
    },
    {
      id: 6,
      title: "Next Video is out on Next Wednesday!",
      videoUrl: upcomingVideo,
      duration: "1:00",
      description: "Weekly updates with new content!",
    },
  ],
};

// Course registry
export const allCourses: { [key: string]: CourseData } = {
  "uiux": uiuxCourse,
  photoshop: photoshopCourse,
  illustrator: illustratorCourse,
  figma: figmaCourse,
  "frontend": frontendCourse,
};

// Helper function to get course by ID
export function getCourseById(courseId: string): CourseData | undefined {
  // First check localStorage for admin-uploaded courses
  const storedCourses = localStorage.getItem("muxion_courses");
  
  if (storedCourses) {
    try {
      const courses = JSON.parse(storedCourses);
      const storedCourse = courses.find((c: CourseData) => c.id === courseId);
      
      // If found in localStorage, return it (admin may have updated it)
      if (storedCourse) {
        return storedCourse;
      }
    } catch (error) {
      console.error("Error parsing stored courses:", error);
    }
  }
  
  // Fall back to default courses if not in localStorage
  return allCourses[courseId];
}

// Helper function to get all courses (including admin-created ones)
export function getAllCourses(): CourseData[] {
  const storedCourses = localStorage.getItem("muxion_courses");
  
  // Start with default courses
  const defaultCourses = Object.values(allCourses);
  
  if (storedCourses) {
    try {
      const adminCourses = JSON.parse(storedCourses);
      
      // Merge: admin courses override default courses with same ID
      const courseMap = new Map<string, CourseData>();
      
      // Add all default courses first
      defaultCourses.forEach(course => {
        courseMap.set(course.id, course);
      });
      
      // Override/add with admin courses
      adminCourses.forEach((course: CourseData) => {
        courseMap.set(course.id, course);
      });
      
      return Array.from(courseMap.values());
    } catch (error) {
      console.error("Error parsing stored courses:", error);
    }
  }
  
  // Return default courses if nothing in localStorage
  return defaultCourses;
}