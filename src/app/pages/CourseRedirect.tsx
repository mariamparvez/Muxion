import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getAllCourses } from "../data/coursesData";
import { motion } from "motion/react";
import { toast } from "sonner";

export function CourseRedirect() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) {
      navigate("/");
      return;
    }

    // Check if user is logged in
    const userEmail = localStorage.getItem("muxion_user_email");
    const isAdmin = userEmail === "designwithmariam@gmail.com";

    if (!userEmail && !isAdmin) {
      toast.error("Please login to access courses");
      navigate("/login");
      return;
    }

    // Load courses from localStorage
    const courses = getAllCourses();
    const course = courses.find(c => c.id === courseId);

    if (!course) {
      // Course not found
      toast.error("Course not available yet. Please check back later or contact admin.");
      navigate("/");
      return;
    }

    if (course.lessons.length === 0) {
      // No videos available
      toast.error(`The ${course.title} course has no videos yet. Please check back later!`);
      navigate("/");
      return;
    }

    // Check if user has purchased the course or is admin
    const hasPaid = isAdmin || localStorage.getItem(`muxion_paid_${courseId}`) === "true";
    
    if (!hasPaid) {
      // Not purchased - redirect back to home with a message
      toast.error("Please unlock this course first to access all content");
      navigate("/", { state: { openCourseModal: courseId } });
      return;
    }

    // Redirect to first lesson
    const firstLessonId = `${courseId}-${course.lessons[0].id}`;
    navigate(`/lesson/${firstLessonId}`, { replace: true });
  }, [courseId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1623] to-[#0a0f1e] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-300 text-lg">Loading course...</p>
      </motion.div>
    </div>
  );
}