import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Get course ID from URL params or session storage
    let courseId = searchParams.get("course");
    const amount = searchParams.get("amount");
    
    // If no course in URL params, check session storage for pending course
    if (!courseId) {
      courseId = sessionStorage.getItem("muxion_pending_course");
      sessionStorage.removeItem("muxion_pending_course"); // Clear it
    }
    
    if (!courseId) {
      toast.error("Invalid payment information");
      navigate("/");
      return;
    }

    // Mark course as paid
    localStorage.setItem(`muxion_paid_${courseId}`, "true");
    
    // Update total revenue if amount is provided
    if (amount) {
      const currentRevenue = parseInt(localStorage.getItem("muxion_total_revenue") || "0");
      const newRevenue = currentRevenue + parseInt(amount);
      localStorage.setItem("muxion_total_revenue", newRevenue.toString());
    }
    
    toast.success(`Payment successful! Course unlocked.`);
    
    // Redirect to course after 3 seconds
    setTimeout(() => {
      navigate(`/course/${courseId}`);
    }, 3000);
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1623] to-[#0a0f1e] flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-green-500/30 p-8 max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Payment Successful!</h1>
        <p className="text-slate-400 mb-6">
          Your course has been unlocked. Redirecting you now...
        </p>
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </motion.div>
    </div>
  );
}
