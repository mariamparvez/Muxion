import { motion, AnimatePresence } from "motion/react";
import { X, Lock, CheckCircle, Clock, BookOpen, Star, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { CourseData } from "../data/coursesData";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

interface CourseUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseData;
}

export function CourseUnlockModal({ isOpen, onClose, course }: CourseUnlockModalProps) {
  const navigate = useNavigate();
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  // Reset payment state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPaymentInitiated(false);
    }
  }, [isOpen]);

  // Check if user is logged in
  const userEmail = localStorage.getItem("muxion_user_email");
  const isAdmin = userEmail === "designwithmariam@gmail.com";

  // Check if course is already purchased
  const hasPaid = isAdmin || localStorage.getItem(`muxion_paid_${course.id}`) === "true";

  const handleUnlockCourse = () => {
    if (!userEmail) {
      toast.error("Please login to unlock courses");
      navigate("/login");
      return;
    }

    if (hasPaid) {
      // Already purchased, go directly to course
      onClose();
      navigate(`/course/${course.id}`);
      return;
    }

    // Open Razorpay payment link
    if (course.paymentLink) {
      // Store course ID in session storage to redirect after payment
      sessionStorage.setItem("muxion_pending_course", course.id);
      window.open(course.paymentLink, "_blank");
      
      setPaymentInitiated(true);
      toast.success("Complete the payment in the new tab");
    } else {
      toast.error("Payment link not available for this course");
    }
  };

  const handlePaymentComplete = () => {
    // Mark course as paid
    localStorage.setItem(`muxion_paid_${course.id}`, "true");
    
    // Update revenue
    const currentRevenue = parseInt(localStorage.getItem("muxion_total_revenue") || "0");
    const newRevenue = currentRevenue + course.price;
    localStorage.setItem("muxion_total_revenue", newRevenue.toString());
    
    toast.success("Course unlocked! Redirecting...");
    
    // Clear session storage
    sessionStorage.removeItem("muxion_pending_course");
    
    // Close modal and redirect
    onClose();
    setTimeout(() => {
      navigate(`/course/${course.id}`);
    }, 500);
  };

  const handleAccessCourse = () => {
    onClose();
    navigate(`/course/${course.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-[#1a1f35] via-[#141829] to-[#1a1f35] rounded-2xl border border-blue-500/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="relative p-6 border-b border-blue-500/20">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    {hasPaid ? (
                      <CheckCircle className="w-7 h-7 text-green-400" />
                    ) : (
                      <Lock className="w-7 h-7 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {hasPaid ? "Course Unlocked" : "Unlock Course"}
                    </h2>
                    <p className="text-slate-400 text-sm">
                      {hasPaid 
                        ? "You have full access to this course" 
                        : "Get lifetime access to all course content"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="p-6 space-y-6">
                {/* Course Title */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-slate-400 text-sm">{course.description}</p>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                    <BookOpen className="w-5 h-5 text-blue-400 mb-2" />
                    <p className="text-xs text-slate-400">Lessons</p>
                    <p className="text-lg font-bold text-white">{course.lessons.length}</p>
                  </div>
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                    <Clock className="w-5 h-5 text-blue-400 mb-2" />
                    <p className="text-xs text-slate-400">Duration</p>
                    <p className="text-lg font-bold text-white">{course.duration}</p>
                  </div>
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                    <Star className="w-5 h-5 text-blue-400 mb-2" />
                    <p className="text-xs text-slate-400">Rating</p>
                    <p className="text-lg font-bold text-white">{course.rating}/5</p>
                  </div>
                  <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                    <p className="text-xs text-slate-400 mb-2">Price</p>
                    <p className="text-lg font-bold text-green-400">₹{course.price}</p>
                  </div>
                </div>

                {/* Instructor */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
                  <p className="text-xs text-slate-400 mb-1">Instructor</p>
                  <p className="text-base font-semibold text-white">{course.instructor}</p>
                </div>

                {/* What's Included */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Lifetime access to all {course.lessons.length} video lessons</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Track your progress as you learn</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Watch on any device, anytime</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>Get updates when new content is added</span>
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {hasPaid ? (
                    <Button
                      onClick={handleAccessCourse}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-6 text-base"
                    >
                      Access Course
                    </Button>
                  ) : paymentInitiated ? (
                    <>
                      <Button
                        onClick={() => setPaymentInitiated(false)}
                        variant="outline"
                        className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 py-6"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePaymentComplete}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-6 text-base flex items-center gap-2 justify-center"
                      >
                        <CheckCircle className="w-5 h-5" />
                        I've Completed Payment
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/10 py-6"
                      >
                        Maybe Later
                      </Button>
                      <Button
                        onClick={handleUnlockCourse}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-6 text-base flex items-center gap-2 justify-center"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Unlock for ₹{course.price}
                      </Button>
                    </>
                  )}
                </div>

                {/* Payment instruction */}
                {paymentInitiated && !hasPaid && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-sm text-slate-300 text-center">
                      Complete the payment in the new tab, then click "I've Completed Payment" to access your course
                    </p>
                  </div>
                )}

                {!hasPaid && !paymentInitiated && (
                  <p className="text-xs text-center text-slate-500">
                    First lesson is always free to preview
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}