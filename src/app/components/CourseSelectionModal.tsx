import { motion, AnimatePresence } from "motion/react";
import { X, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { getAllCourses, type CourseData } from "../data/coursesData";

interface CourseSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CourseSelectionModal({ isOpen, onClose }: CourseSelectionModalProps) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseData[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Load courses when modal opens
      const allCourses = getAllCourses();
      setCourses(allCourses);
    }
  }, [isOpen]);

  const getCourseColor = (index: number) => {
    const colors = [
      {
        color: "from-pink-600/20 to-pink-500/10",
        borderColor: "border-pink-500/30",
        hoverBorder: "hover:border-pink-400/50",
        textColor: "text-pink-400"
      },
      {
        color: "from-orange-600/20 to-orange-500/10",
        borderColor: "border-orange-500/30",
        hoverBorder: "hover:border-orange-400/50",
        textColor: "text-orange-400"
      },
      {
        color: "from-purple-600/20 to-purple-500/10",
        borderColor: "border-purple-500/30",
        hoverBorder: "hover:border-purple-400/50",
        textColor: "text-purple-400"
      },
      {
        color: "from-blue-600/20 to-blue-500/10",
        borderColor: "border-blue-500/30",
        hoverBorder: "hover:border-blue-400/50",
        textColor: "text-blue-400"
      },
      {
        color: "from-green-600/20 to-green-500/10",
        borderColor: "border-green-500/30",
        hoverBorder: "hover:border-green-400/50",
        textColor: "text-green-400"
      }
    ];
    return colors[index % colors.length];
  };

  const handleCourseSelect = (courseId: string) => {
    // Get the course and navigate to first lesson
    const course = courses.find(c => c.id === courseId);
    if (course && course.lessons && course.lessons.length > 0) {
      const firstLessonId = `${courseId}-${course.lessons[0].id}`;
      onClose();
      navigate(`/lesson/${firstLessonId}`);
    } else {
      onClose();
      // If no lessons, show a message
      alert("This course has no lessons yet. Please check back later!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-blue-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-6 border-b border-blue-500/20 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">Choose Your Course</h2>
                  <p className="text-sm text-slate-400">Select a course to get started</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Course Grid */}
            <div className="p-8 grid md:grid-cols-2 gap-4">
              {courses.map((course, index) => {
                const color = getCourseColor(index);
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`bg-gradient-to-br ${color.color} backdrop-blur-xl rounded-xl p-6 border ${color.borderColor} ${color.hoverBorder} transition-all duration-300 cursor-pointer`}
                    onClick={() => handleCourseSelect(course.id)}
                  >
                    <h3 className="font-bold text-lg text-slate-100 mb-2">{course.title}</h3>
                    <p className="text-sm text-slate-400 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-bold ${color.textColor}`}>{course.price}</span>
                      <Button
                        size="sm"
                        className={`bg-gradient-to-r ${color.color} border ${color.borderColor} hover:${color.borderColor} text-slate-100`}
                      >
                        Select
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}