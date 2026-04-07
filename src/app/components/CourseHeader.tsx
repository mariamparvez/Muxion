import { Star, Users, Clock } from "lucide-react";
import { courseData } from "../data/courseData";
import { useRazorpay } from "../hooks/useRazorpay";
import { MuxionLogo } from "./MuxionLogo";
import { motion } from "motion/react";
import { Link } from "react-router";

interface CourseHeaderProps {
  onUnlockClick: () => void;
  hasPaid: boolean;
}

export function CourseHeader({ onUnlockClick, hasPaid }: CourseHeaderProps) {
  const { isLoaded } = useRazorpay();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center justify-between"
        >
          <Link to="/">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <MuxionLogo size={160} />
            </motion.div>
          </Link>
        </motion.div>
        
        <div className="flex items-start justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1"
          >
            <motion.h1
              className="text-4xl mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {courseData.title}
            </motion.h1>
            <motion.p
              className="text-xl text-blue-50 mb-6 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {courseData.description}
            </motion.p>
            
            <motion.div
              className="flex items-center gap-6 text-blue-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span>{courseData.rating}</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Users className="w-5 h-5" />
                <span>{courseData.studentsEnrolled.toLocaleString()} students</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Clock className="w-5 h-5" />
                <span>{courseData.totalDuration}</span>
              </motion.div>
            </motion.div>
            
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-blue-50">Instructor: {courseData.instructor}</p>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white text-gray-900 rounded-lg p-6 shadow-xl min-w-[280px]"
          >
            {hasPaid ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <motion.svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </motion.svg>
                </motion.div>
                <h3 className="text-xl mb-2">Course Unlocked!</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You have full access to all lessons
                </p>
                <Link to="/learning">
                  <motion.button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Enter Course →
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-1">Full Course Access</p>
                  <motion.p
                    className="text-4xl"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    ₹{courseData.price.toLocaleString('en-IN')}
                  </motion.p>
                </div>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Unlock all lessons and lifetime access
                </p>
                <motion.button
                  onClick={onUnlockClick}
                  disabled={!isLoaded}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoaded ? "Unlock Full Course" : "Loading..."}
                </motion.button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}