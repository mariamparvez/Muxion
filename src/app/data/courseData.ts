export interface Lesson {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
  isLocked: boolean;
  description: string;
}

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export const courseData = {
  title: "Master UI/UX Design and Development",
  description: "Master the essentials of UI/UX design and development, from foundational principles to advanced techniques, with Mariam Parvez guiding you every step of the way.",
  instructor: "Mariam Parvez",
  totalDuration: "22 mins",
  studentsEnrolled: 487,
  rating: 4.9,
  price: 18700,
  modules: [
    {
      id: 1,
      title: "Getting Started with Figma",
      lessons: [
        {
          id: 1,
          title: "Introduction to Figma",
          duration: "15:30",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          isLocked: false,
          description: "Welcome to the course! Learn what Figma is and why it's the industry standard for digital design."
        },
        {
          id: 2,
          title: "Setting Up Your Workspace",
          duration: "18:45",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          isLocked: true,
          description: "Learn how to customize your Figma workspace for maximum productivity."
        },
        {
          id: 3,
          title: "Understanding Frames and Layers",
          duration: "22:15",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          isLocked: true,
          description: "Master the fundamental building blocks of Figma design."
        }
      ]
    },
    {
      id: 2,
      title: "Design Fundamentals",
      lessons: [
        {
          id: 4,
          title: "Working with Shapes and Tools",
          duration: "25:00",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          isLocked: true,
          description: "Explore all the essential design tools in Figma."
        },
        {
          id: 5,
          title: "Typography in Figma",
          duration: "20:30",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          isLocked: true,
          description: "Learn professional typography techniques and best practices."
        },
        {
          id: 6,
          title: "Color and Styles",
          duration: "19:45",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          isLocked: true,
          description: "Create and manage color systems and reusable styles."
        }
      ]
    },
    {
      id: 3,
      title: "Advanced Features",
      lessons: [
        {
          id: 7,
          title: "Components and Variants",
          duration: "28:20",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
          isLocked: true,
          description: "Build scalable design systems with components and variants."
        },
        {
          id: 8,
          title: "Auto Layout Mastery",
          duration: "32:10",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          isLocked: true,
          description: "Create responsive designs that adapt automatically."
        },
        {
          id: 9,
          title: "Prototyping and Interactions",
          duration: "26:35",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
          isLocked: true,
          description: "Bring your designs to life with interactive prototypes."
        }
      ]
    },
    {
      id: 4,
      title: "Professional Workflow",
      lessons: [
        {
          id: 10,
          title: "Collaboration and Sharing",
          duration: "21:50",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          isLocked: true,
          description: "Work effectively with teams and stakeholders."
        },
        {
          id: 11,
          title: "Developer Handoff",
          duration: "24:15",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
          isLocked: true,
          description: "Prepare designs for development and export assets."
        },
        {
          id: 12,
          title: "Plugins and Advanced Techniques",
          duration: "29:40",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
          isLocked: true,
          description: "Supercharge your workflow with plugins and pro tips."
        }
      ]
    }
  ] as Module[]
};