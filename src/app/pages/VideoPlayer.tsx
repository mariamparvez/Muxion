import { useParams, useNavigate } from "react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Lock, CheckCircle2 } from "lucide-react";
import { getAllCourses, CourseData, Lesson } from "../data/coursesData";
import { useCourseProgress } from "../hooks/useCourseProgress";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SEO } from "../components/SEO";
import { generateCourseSchema, insertStructuredData } from "../utils/structuredData";

export function VideoPlayer() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentCourse, setCurrentCourse] = useState<CourseData | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null);
  const [hasWatchedMost, setHasWatchedMost] = useState(false);
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  
  const { completedLessons, markAsComplete, unlockedLessons } = useCourseProgress();

  useEffect(() => {
    if (!lessonId) return;

    // Parse lessonId as "courseId-videoId"
    const [courseId, videoIdStr] = lessonId.split("-");
    const videoId = parseInt(videoIdStr);

    // Load all courses from localStorage
    const allCourses = getAllCourses();
    
    // Find the course
    const course = allCourses.find(c => c.id === courseId);
    if (!course) {
      console.error("Course not found:", courseId);
      return;
    }

    setCurrentCourse(course);

    // Find the lesson/video
    const lesson = course.lessons.find(l => l.id === videoId);
    if (!lesson) {
      console.error("Lesson not found:", videoId);
      return;
    }

    setCurrentLesson(lesson);

    // Find previous and next lessons
    const currentIndex = course.lessons.findIndex(l => l.id === videoId);
    
    if (currentIndex > 0) {
      setPrevLesson(course.lessons[currentIndex - 1]);
    } else {
      setPrevLesson(null);
    }
    
    if (currentIndex < course.lessons.length - 1) {
      setNextLesson(course.lessons[currentIndex + 1]);
    } else {
      setNextLesson(null);
    }
  }, [lessonId]);

  // Track video progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentLesson) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      
      // Mark as complete when 80% watched
      if (progress >= 80 && !hasWatchedMost) {
        setHasWatchedMost(true);
        markAsComplete(currentLesson.id);
        setShowCompletionEffect(true);
        setTimeout(() => setShowCompletionEffect(false), 3000);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [currentLesson, hasWatchedMost, markAsComplete]);

  // Check if lesson is accessible (first lesson is always free)
  const isAccessible = currentLesson && (currentLesson.id === 1 || unlockedLessons.includes(currentLesson.id));
  const isCompleted = currentLesson && completedLessons.includes(currentLesson.id);

  // Check if user has paid for this course
  const userEmail = localStorage.getItem("muxion_user_email");
  const isAdmin = userEmail === "designwithmariam@gmail.com";
  const hasPaid = isAdmin || localStorage.getItem(`muxion_paid_${currentCourse?.id}`) === "true";

  if (!currentLesson || !currentCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1623] to-[#0a0f1e] flex items-center justify-center">
        <p className="text-slate-400">Lesson not found</p>
      </div>
    );
  }

  // Only first video is free for non-paying users
  if (!hasPaid && currentLesson.id !== 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1623] to-[#0a0f1e] flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-8 max-w-md text-center"
        >
          <Lock className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Content Locked</h2>
          <p className="text-slate-400 mb-4">
            This lesson is only available to paying users. Purchase the course to unlock all content.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <p className="text-3xl font-bold text-blue-400 mb-1">₹{currentCourse.price}</p>
            <p className="text-slate-400 text-sm">One-time payment • Lifetime access</p>
          </div>
          {currentCourse.paymentLink ? (
            <a
              href={currentCourse.paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold mb-3"
            >
              Unlock Full Course
            </a>
          ) : (
            <button
              disabled
              className="w-full px-6 py-3 bg-slate-700 text-slate-400 rounded-lg cursor-not-allowed mb-3"
            >
              Payment Link Not Available
            </button>
          )}
          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            Go to Homepage
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1623] to-[#0a0f1e]">
      {/* Completion Effect Overlay */}
      <AnimatePresence>
        {showCompletionEffect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-green-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3"
            >
              <CheckCircle2 className="w-8 h-8" />
              <span className="text-xl font-bold">Lesson Completed! 🎉</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900/90 backdrop-blur-xl border-b border-blue-500/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-100 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </motion.button>
          <h1 className="text-slate-100 text-lg font-semibold">{currentCourse.title}</h1>
        </div>
      </motion.div>

      {/* Video Player Section */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Video Player - Takes 2/3 width */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-black rounded-lg overflow-hidden aspect-video shadow-2xl"
            >
              <video
                ref={videoRef}
                controls
                className="w-full h-full"
                src={currentLesson.videoUrl}
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
            </motion.div>

            {/* Lesson Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 bg-slate-900/90 backdrop-blur-xl rounded-lg border border-blue-500/20 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-slate-100 text-2xl font-bold">{currentLesson.title}</h2>
                    <AnimatePresence>
                      {isCompleted && (
                        <motion.span
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  {currentLesson.description && (
                    <p className="text-slate-400">{currentLesson.description}</p>
                  )}
                </div>
                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded text-sm">
                  {currentLesson.duration}
                </span>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-blue-500/20">
                <motion.button
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => prevLesson && navigate(`/lesson/${currentCourse.id}-${prevLesson.id}`)}
                  disabled={!prevLesson}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-100 rounded hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => nextLesson && navigate(`/lesson/${currentCourse.id}-${nextLesson.id}`)}
                  disabled={!nextLesson}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar - Course Curriculum */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-lg border border-blue-500/20 p-4 max-h-[calc(100vh-150px)] overflow-y-auto">
              <h3 className="text-slate-100 text-lg font-semibold mb-4">Course Content</h3>
              
              {currentCourse.lessons.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No videos available yet</p>
              ) : (
                <div className="space-y-2">
                  {currentCourse.lessons.map((lesson, index) => {
                    const isLessonUnlocked = hasPaid || lesson.id === 1; // First video is free
                    const isLessonCompleted = completedLessons.includes(lesson.id);
                    const isCurrentLesson = lesson.id === currentLesson.id;
                    
                    return (
                      <motion.button
                        key={lesson.id}
                        whileHover={isLessonUnlocked ? { x: 4, scale: 1.02 } : {}}
                        whileTap={isLessonUnlocked ? { scale: 0.98 } : {}}
                        onClick={() => isLessonUnlocked && navigate(`/lesson/${currentCourse.id}-${lesson.id}`)}
                        disabled={!isLessonUnlocked}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          isCurrentLesson
                            ? "bg-blue-500 text-white"
                            : !isLessonUnlocked
                            ? "text-slate-500 cursor-not-allowed"
                            : "text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            {!isLessonUnlocked && <Lock className="w-3 h-3" />}
                            {isLessonCompleted && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                              </motion.div>
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </span>
                          <span className="text-xs ml-2">{lesson.duration}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}