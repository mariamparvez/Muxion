import { Lock, Play, CheckCircle } from "lucide-react";
import { courseData } from "../data/courseData";
import { useNavigate } from "react-router";
import { useCourseProgress } from "../hooks/useCourseProgress";
import { motion } from "motion/react";
import { ProgressBar } from "./ProgressBar";

interface CurriculumListProps {
  onPaymentClick: () => void;
  unlockedLessons: number[];
}

export function CurriculumList({ onPaymentClick, unlockedLessons }: CurriculumListProps) {
  const navigate = useNavigate();
  const { completedLessons, hasPaid, progressPercentage, completedCount, totalLessons } = useCourseProgress();

  const handleLessonClick = (lessonId: number, isLocked: boolean) => {
    if (isLocked && !unlockedLessons.includes(lessonId)) {
      onPaymentClick();
    } else {
      navigate(`/lesson/${lessonId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12" id="curriculum-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-8"
      >
        <h2 className="text-3xl">Course Curriculum</h2>
        {hasPaid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg"
          >
            <CheckCircle className="w-5 h-5" />
            <span>All lessons unlocked</span>
          </motion.div>
        )}
      </motion.div>
      
      {hasPaid && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <ProgressBar
            percentage={progressPercentage}
            completedCount={completedCount}
            totalCount={totalLessons}
          />
        </motion.div>
      )}
      
      <div className="space-y-6">
        {courseData.modules.map((module, moduleIndex) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: moduleIndex * 0.1 }}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl">
                Module {module.id}: {module.title}
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {module.lessons.map((lesson, lessonIndex) => {
                const isUnlocked = !lesson.isLocked || unlockedLessons.includes(lesson.id);
                const isWatched = completedLessons.includes(lesson.id);
                
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (moduleIndex * 0.1) + (lessonIndex * 0.05) }}
                    whileHover={{ 
                      backgroundColor: "rgba(249, 250, 251, 1)",
                      x: 4,
                      transition: { duration: 0.2 }
                    }}
                    onClick={() => handleLessonClick(lesson.id, lesson.isLocked)}
                    className={`px-6 py-4 cursor-pointer transition-colors flex items-center justify-between group ${
                      !isUnlocked ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <motion.div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors ${
                          isUnlocked ? "bg-gray-100" : "bg-gray-200"
                        }`}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isUnlocked ? (
                          isWatched ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </motion.div>
                          ) : (
                            <Play className="w-5 h-5 text-blue-600" />
                          )
                        ) : (
                          <Lock className="w-5 h-5 text-gray-400" />
                        )}
                      </motion.div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className={`group-hover:text-blue-600 transition-colors ${
                            !isUnlocked ? "text-gray-500" : ""
                          }`}>
                            {lesson.title}
                          </h4>
                          {!isUnlocked && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded"
                            >
                              Locked
                            </motion.span>
                          )}
                          {isUnlocked && lesson.id === 1 && !hasPaid && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                            >
                              Free Preview
                            </motion.span>
                          )}
                          {isUnlocked && isWatched && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                            >
                              Completed
                            </motion.span>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${
                          !isUnlocked ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {lesson.description}
                        </p>
                      </div>
                    </div>
                    
                    <motion.div
                      className="text-sm text-gray-600 ml-4"
                      whileHover={{ scale: 1.1 }}
                    >
                      {lesson.duration}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}