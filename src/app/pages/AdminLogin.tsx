import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { MuxionLogo } from "../components/MuxionLogo";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check admin credentials
    if (email === "designwithmariam@gmail.com" && password === "Mfmk.2112") {
      // Set admin session
      localStorage.setItem("muxion_admin_authenticated", "true");
      localStorage.setItem("muxion_admin_email", email);
      
      toast.success("Welcome back, Admin!", {
        duration: 3000,
      });
      
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 500);
    } else {
      toast.error("Invalid credentials. Access denied.", {
        duration: 3000,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1623] to-[#0a0f1e] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <MuxionLogo size={150} className="text-blue-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Admin Portal</h1>
          <p className="text-slate-400">Manage courses and content</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@muxion.in"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 transition-all duration-300"
            >
              {isLoading ? "Authenticating..." : "Login to Admin Panel"}
            </Button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
            >
              ← Back to Homepage
            </button>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-xs text-slate-500 mt-6"
        >
          🔒 Secure admin access only. Unauthorized access is prohibited.
        </motion.p>
      </motion.div>
    </div>
  );
}
