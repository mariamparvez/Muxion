import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router";
import { MuxionLogo } from "../components/MuxionLogo";
import { Button } from "../components/ui/button";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { SEO } from "../components/SEO";

// Import background images
import bg1 from "figma:asset/c440b7e247ad82d0cbc396c0e60bc92b3681cc42.png";
import bg2 from "figma:asset/bd81e541f6ad4759c2fff9ca270653a8495e35d3.png";
import bg3 from "figma:asset/8a126b35274440cbb3b2841655e734e2129943f1.png";
import bg4 from "figma:asset/ad829988eb357807114ba2c5388f742265b3c4ca.png";
import { useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  password: string;
  phone: string;
  profilePicture: string;
  loginTimestamp: string;
}

export function Login() {
  const navigate = useNavigate();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const backgrounds = [bg1, bg2, bg3, bg4];

  // Background rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error on input change
  };

  // Get all registered users from localStorage
  const getUsers = (): User[] => {
    const users = localStorage.getItem("muxion_users");
    return users ? JSON.parse(users) : [];
  };

  // Save user to localStorage
  const saveUser = (user: User) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem("muxion_users", JSON.stringify(users));
  };

  // Check if user exists
  const userExists = (email: string): User | null => {
    const users = getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Admin bypass
    if (formData.email === "designwithmariam@gmail.com" && formData.password === "Mfmk.2112") {
      localStorage.setItem("muxion_user_email", formData.email);
      localStorage.setItem("muxion_user_name", "Mariam Parvez");
      localStorage.setItem("muxion_is_admin", "true");
      toast.success("Welcome back, Admin!");
      navigate("/course/uiux");
      return;
    }

    if (isSignUp) {
      // Sign Up validation
      if (!formData.name.trim()) {
        toast.error("Please enter your name");
        return;
      }

      if (!formData.email.trim() || !formData.password.trim()) {
        toast.error("Please fill in all fields");
        return;
      }

      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      // Check if user already exists
      const users = getUsers();
      if (users.find((u) => u.email === formData.email)) {
        toast.error("An account with this email already exists");
        return;
      }

      // Create new user
      const newUser: User = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: "",
        profilePicture: "",
        loginTimestamp: new Date().toISOString(),
      };

      saveUser(newUser);

      // Set session
      localStorage.setItem("muxion_user_email", formData.email);
      localStorage.setItem("muxion_user_name", formData.name);

      toast.success("Account created successfully!");

      // Redirect to profile to complete profile
      navigate("/profile");
    } else {
      // Sign In validation
      if (!formData.email.trim() || !formData.password.trim()) {
        toast.error("Please fill in all fields");
        return;
      }

      // Check credentials
      const user = userExists(formData.email);
      
      if (!user || user.password !== formData.password) {
        toast.error("Invalid email or password");
        return;
      }

      // Set session
      localStorage.setItem("muxion_user_email", formData.email);
      localStorage.setItem("muxion_user_name", user.name);

      // Update login timestamp
      const users = getUsers();
      const userIndex = users.findIndex((u) => u.email === formData.email);
      if (userIndex !== -1) {
        users[userIndex].loginTimestamp = new Date().toISOString();
        localStorage.setItem("muxion_users", JSON.stringify(users));
      }

      toast.success("Welcome back!");

      // Redirect to course page
      navigate("/course/uiux");
    }
  };

  // Handle forgot password
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      setError("Please enter your email address");
      return;
    }

    const user = userExists(resetEmail);
    
    if (!user) {
      setError("No account found with this email address");
      return;
    }

    // Generate reset token (in production, this would be done server-side)
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetData = {
      email: resetEmail,
      token: resetToken,
      expires: Date.now() + 3600000, // 1 hour
    };
    
    localStorage.setItem("muxion_reset_token", JSON.stringify(resetData));

    // Simulate email sending
    console.log(`Password reset email sent to: ${resetEmail}`);
    console.log(`Reset token: ${resetToken}`);
    console.log(`Reset link: ${window.location.origin}/reset-password?token=${resetToken}`);

    setShowForgotPassword(false);
    setShowResetSuccess(true);
    setResetEmail("");
    setError("");
  };

  // OAuth handlers - Only Google OAuth
  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";
    const currentOrigin = window.location.origin;
    const redirectUri = currentOrigin.includes('localhost') 
      ? `${currentOrigin}/course/uiux`
      : 'https://muxion.in/course/uiux';
    
    const scope = "email profile openid";
    const responseType = "token id_token";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    
    console.log("Google OAuth Redirect URI:", redirectUri); // Debug log
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Layer */}
      <div className="fixed inset-0 z-0">
        <motion.div
          key={currentBgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgrounds[currentBgIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-slate-900/95 backdrop-blur-sm" />
      </div>

      {/* Back to Home Button */}
      <Link to="/" className="absolute top-6 left-6 z-50">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </Link>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-8 pb-8 border-b border-white/20"
          >
            <MuxionLogo size={180} className="text-white drop-shadow-lg" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-black text-white mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-white/70">
              {isSignUp ? "Sign up to get started" : "Sign in to access your course"}
            </p>
          </motion.div>

          {/* Email Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="p-3 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl flex items-center gap-2 text-red-300 text-sm"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {isSignUp && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative"
              >
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required={isSignUp}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                />
              </motion.div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                required
                className="w-full pl-10 pr-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="w-full pl-10 pr-12 py-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot Password Link - Only show on Sign In */}
            {!isSignUp && (
              <div className="flex justify-end -mt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {isSignUp && (
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg transition-all"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </motion.button>
          </motion.form>

          {/* Toggle Sign Up/Sign In */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-white/60 mt-4"
          >
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </motion.p>

          {/* OR Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative my-8"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-transparent px-4 text-white/50 text-sm font-semibold uppercase tracking-wider">
                OR
              </span>
            </div>
          </motion.div>

          {/* Social Login Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center gap-4"
          >
            {/* Google Icon - Only Option */}
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoogleLogin}
              className="w-14 h-14 flex items-center justify-center bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all"
              title="Continue with Google"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </motion.button>
          </motion.div>

          {/* Footer Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs text-white/50 mt-6"
          >
            By continuing, you agree to MUXION's<br />
            Terms of Service and Privacy Policy
          </motion.p>
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl -z-10"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -z-10"
        />
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setShowForgotPassword(false);
              setError("");
              setResetEmail("");
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-blue-500/30 max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-6 border-b border-blue-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-6 h-6 text-blue-400" />
                  <h3 className="text-2xl font-bold text-white">Reset Password</h3>
                </div>
                <p className="text-slate-300 text-sm">
                  Enter your email address and we'll send you a reset link
                </p>
              </div>

              {/* Content */}
              <form onSubmit={handleForgotPassword} className="p-6 space-y-6">
                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="p-3 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl flex items-center gap-2 text-red-300 text-sm"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-xl shadow-lg shadow-blue-500/30"
                  >
                    Send Reset Link
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setError("");
                      setResetEmail("");
                    }}
                    variant="outline"
                    className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 py-3 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Success Modal */}
      <AnimatePresence>
        {showResetSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowResetSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-green-500/30 max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-6 border-b border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <h3 className="text-2xl font-bold text-white">Check Your Email</h3>
                </div>
                <p className="text-slate-300 text-sm">
                  Password reset link has been sent
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="space-y-4 text-slate-300">
                  <p>
                    We've sent a password reset link to your email address.
                  </p>
                  <p className="text-sm">
                    <strong className="text-white">Note:</strong> This is a demo environment. Check the browser console for the reset link.
                  </p>
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-xs text-slate-400">
                      💡 <strong>Development Mode:</strong> In production, you would receive an email with a reset link.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setShowResetSuccess(false)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl shadow-lg shadow-green-500/30"
                >
                  Got It
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}