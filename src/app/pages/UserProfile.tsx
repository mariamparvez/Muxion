import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Upload, User, Phone, Mail, Camera, Save } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

interface UserData {
  email: string;
  name: string;
  phone: string;
  profilePicture: string;
  loginTimestamp: string;
}

export function UserProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [userData, setUserData] = useState<UserData>({
    email: "",
    name: "",
    phone: "",
    profilePicture: "",
    loginTimestamp: ""
  });

  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    // Check if user is logged in
    const userEmail = localStorage.getItem("muxion_user_email");
    if (!userEmail) {
      navigate("/login");
      return;
    }

    // Load user data
    const usersData = JSON.parse(localStorage.getItem("muxion_users") || "[]");
    const existingUser = usersData.find((u: UserData) => u.email === userEmail);

    if (existingUser) {
      setUserData(existingUser);
      setPreviewImage(existingUser.profilePicture);
    } else {
      // New user - initialize with email
      setUserData({
        email: userEmail,
        name: localStorage.getItem("muxion_user_name") || "",
        phone: "",
        profilePicture: "",
        loginTimestamp: new Date().toISOString()
      });
    }
  }, [navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload a valid image file");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreviewImage(base64String);
      setUserData({ ...userData, profilePicture: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    if (!userData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (userData.phone && !/^\+?[\d\s\-()]+$/.test(userData.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Save to localStorage
    const usersData = JSON.parse(localStorage.getItem("muxion_users") || "[]");
    const userIndex = usersData.findIndex((u: UserData) => u.email === userData.email);

    if (userIndex !== -1) {
      // Update existing user
      usersData[userIndex] = {
        ...userData,
        loginTimestamp: usersData[userIndex].loginTimestamp // Keep original login time
      };
    } else {
      // Add new user
      usersData.push({
        ...userData,
        loginTimestamp: new Date().toISOString()
      });
    }

    localStorage.setItem("muxion_users", JSON.stringify(usersData));
    localStorage.setItem("muxion_user_name", userData.name);
    
    toast.success("Profile updated successfully!");
    
    // Navigate back
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1623] to-[#0a0f1e]">
      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900/90 backdrop-blur-xl border-b border-blue-500/20"
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-100 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </motion.button>
          <h1 className="text-slate-100 text-xl font-bold">My Profile</h1>
        </div>
      </motion.div>

      {/* Profile Form */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-8"
        >
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-blue-500/30">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </motion.div>
            <p className="text-slate-400 text-sm mt-4">Click the camera icon to upload a photo</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={userData.email}
                disabled
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Save Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8"
          >
            <Button
              onClick={handleSaveProfile}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Profile
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
