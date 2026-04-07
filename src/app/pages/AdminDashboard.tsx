import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Edit3,
  Trash2,
  LogOut,
  Video,
  Upload,
  X,
  Save,
  BookOpen,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Clock,
  DollarSign,
  FileText,
  Loader2,
  Users,
  User as UserIcon,
  CheckCircle2,
  Menu,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "../components/ui/button";
import { MuxionLogo } from "../components/MuxionLogo";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { 
  getNavLinks, 
  saveNavLinks, 
  type NavLink, 
  type SubNavLink 
} from "../data/navigationData";

interface Video {
  id: number;
  title: string;
  videoUrl: string;
  duration: string;
  description?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  instructor: string;
  duration: string;
  level: string;
  language: string;
  lessons: Video[];
  revenue: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  
  // Original (saved) data
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [savedUsers, setSavedUsers] = useState<any[]>([]);
  
  // Working (pending) data
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  // Track if there are pending changes
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  
  // Calculate total revenue
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [showEditVideoModal, setShowEditVideoModal] = useState(false);
  const [showEditRevenueModal, setShowEditRevenueModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editingRevenue, setEditingRevenue] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"courses" | "users" | "navigation">("courses");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUserData, setEditedUserData] = useState<any>({});
  const [originalVideo, setOriginalVideo] = useState<Video | null>(null);
  const [hasVideoChanges, setHasVideoChanges] = useState(false);

  // Navigation management
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [showAddNavModal, setShowAddNavModal] = useState(false);
  const [showEditNavModal, setShowEditNavModal] = useState(false);
  const [showAddSubLinkModal, setShowAddSubLinkModal] = useState(false);
  const [editingNavLink, setEditingNavLink] = useState<NavLink | null>(null);
  const [selectedNavForSubLink, setSelectedNavForSubLink] = useState<string | null>(null);
  const [newNavLink, setNewNavLink] = useState({ title: "", url: "" });
  const [newSubLink, setNewSubLink] = useState({ title: "", url: "" });

  // New Course Form
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: 0,
    instructor: "Mariam Parvez",
    level: "All Levels",
    language: "English"
  });

  // New Video Form
  const [newVideo, setNewVideo] = useState({
    title: "",
    videoUrl: "",
    duration: "",
    description: ""
  });

  // Video file upload and duration detection
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [detectingDuration, setDetectingDuration] = useState(false);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  // Check admin authentication
  useEffect(() => {
    const isAdminAuth = localStorage.getItem("muxion_admin_authenticated");
    if (isAdminAuth !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  // Load courses and users from localStorage
  useEffect(() => {
    loadData();
  }, []);

  // Check for pending changes whenever courses or users change
  useEffect(() => {
    const hasChanges = 
      JSON.stringify(courses) !== JSON.stringify(savedCourses) ||
      JSON.stringify(users) !== JSON.stringify(savedUsers);
    setHasPendingChanges(hasChanges);
  }, [courses, users, savedCourses, savedUsers]);

  // Calculate total revenue from localStorage
  useEffect(() => {
    const storedRevenue = localStorage.getItem('muxion_total_revenue');
    if (storedRevenue) {
      setTotalRevenue(parseInt(storedRevenue) || 0);
    }
  }, []);

  const loadData = () => {
    // Load courses
    const storedCourses = localStorage.getItem("muxion_courses");
    if (storedCourses) {
      const parsedCourses = JSON.parse(storedCourses);
      setSavedCourses(parsedCourses);
      setCourses(JSON.parse(JSON.stringify(parsedCourses))); // Deep copy
    } else {
      // Initialize with default courses
      const defaultCourses: Course[] = [
        {
          id: "uiux",
          title: "UI/UX Mastery",
          description: "Master the essentials of UI/UX design and development, from foundational principles to advanced techniques",
          price: 599,
          instructor: "Mariam Parvez",
          duration: "0 mins",
          level: "All Levels",
          language: "English",
          lessons: [],
          revenue: 0
        },
        {
          id: "photoshop",
          title: "Adobe Photoshop",
          description: "Master photo editing and digital art creation",
          price: 299,
          instructor: "Mariam Parvez",
          duration: "0 mins",
          level: "All Levels",
          language: "English",
          lessons: [],
          revenue: 0
        },
        {
          id: "illustrator",
          title: "Adobe Illustrator",
          description: "Create stunning vector graphics and illustrations",
          price: 299,
          instructor: "Mariam Parvez",
          duration: "0 mins",
          level: "All Levels",
          language: "English",
          lessons: [],
          revenue: 0
        },
        {
          id: "figma",
          title: "Figma",
          description: "Design collaborative UI/UX projects",
          price: 349,
          instructor: "Mariam Parvez",
          duration: "0 mins",
          level: "All Levels",
          language: "English",
          lessons: [],
          revenue: 0
        },
        {
          id: "frontend",
          title: "Frontend Development Basics",
          description: "Learn HTML, CSS, and JavaScript fundamentals",
          price: 299,
          instructor: "Mariam Parvez",
          duration: "0 mins",
          level: "Beginner",
          language: "English",
          lessons: [],
          revenue: 0
        }
      ];
      setSavedCourses(defaultCourses);
      setCourses(JSON.parse(JSON.stringify(defaultCourses)));
      localStorage.setItem("muxion_courses", JSON.stringify(defaultCourses));
    }

    // Load users
    const storedUsers = localStorage.getItem("muxion_users");
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      setSavedUsers(parsedUsers);
      setUsers(JSON.parse(JSON.stringify(parsedUsers))); // Deep copy
    }

    // Load navigation links
    const loadedNavLinks = getNavLinks();
    setNavLinks(loadedNavLinks);
  };

  // Global Save - Save all changes to localStorage
  const handleGlobalSave = () => {
    localStorage.setItem("muxion_courses", JSON.stringify(courses));
    localStorage.setItem("muxion_users", JSON.stringify(users));
    
    // Update saved state
    setSavedCourses(JSON.parse(JSON.stringify(courses)));
    setSavedUsers(JSON.parse(JSON.stringify(users)));
    
    setHasPendingChanges(false);
    toast.success("All changes saved successfully!", {
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
    });
  };

  // Global Cancel - Discard all changes
  const handleGlobalCancel = () => {
    if (window.confirm("Are you sure you want to discard all changes?")) {
      // Revert to saved state
      setCourses(JSON.parse(JSON.stringify(savedCourses)));
      setUsers(JSON.parse(JSON.stringify(savedUsers)));
      
      setHasPendingChanges(false);
      toast.info("All changes discarded");
    }
  };

  // Calculate total duration from video durations
  const calculateCourseDuration = (lessons: Video[]) => {
    if (lessons.length === 0) return "0 mins";
    
    let totalMinutes = 0;
    lessons.forEach(video => {
      const parts = video.duration.split(':');
      if (parts.length === 2) {
        const mins = parseInt(parts[0]) || 0;
        const secs = parseInt(parts[1]) || 0;
        totalMinutes += mins + (secs / 60);
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} mins`;
  };

  const handleLogout = () => {
    if (hasPendingChanges) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to logout?")) {
        return;
      }
    }
    localStorage.removeItem("muxion_admin_authenticated");
    localStorage.removeItem("muxion_admin_email");
    toast.success("Logged out successfully");
    navigate("/admin");
  };

  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const courseId = newCourse.title.toLowerCase().replace(/\s+/g, "-");
    const course: Course = {
      id: courseId,
      ...newCourse,
      duration: "0 mins",
      lessons: [],
      revenue: 0
    };

    setCourses([...courses, course]);
    
    setShowAddCourseModal(false);
    setNewCourse({
      title: "",
      description: "",
      price: 0,
      instructor: "Mariam Parvez",
      level: "All Levels",
      language: "English"
    });
    
    toast.success(`Course "${course.title}" added! Click Save to apply changes.`);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter(c => c.id !== courseId));
      toast.success("Course deleted! Click Save to apply changes.");
    }
  };

  // Handle video file upload
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error("Please upload a valid video file");
      return;
    }

    setVideoFile(file);
    setDetectingDuration(true);

    // Create blob URL for the video
    const blobUrl = URL.createObjectURL(file);
    setNewVideo({ ...newVideo, videoUrl: blobUrl });

    // Auto-detect duration
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      const duration = video.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      setNewVideo(prev => ({ ...prev, duration: formattedDuration }));
      setDetectingDuration(false);
      toast.success(`Duration detected: ${formattedDuration}`);
      
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => {
      setDetectingDuration(false);
      toast.error("Could not detect video duration");
      URL.revokeObjectURL(video.src);
    };

    video.src = blobUrl;
  };

  // Handle URL paste and auto-detect duration
  const handleVideoUrlChange = (url: string) => {
    setNewVideo({ ...newVideo, videoUrl: url });

    // Only try to detect duration for direct video URLs
    if (url && (url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg'))) {
      setDetectingDuration(true);

      const video = document.createElement('video');
      video.preload = 'metadata';
      video.crossOrigin = 'anonymous';
      
      video.onloadedmetadata = () => {
        const duration = video.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        setNewVideo(prev => ({ ...prev, duration: formattedDuration }));
        setDetectingDuration(false);
        toast.success(`Duration detected: ${formattedDuration}`);
      };

      video.onerror = () => {
        setDetectingDuration(false);
      };

      video.src = url;
    }
  };

  const handleAddVideo = () => {
    console.log("=== Upload Video Debug ===");
    console.log("selectedCourseId:", selectedCourseId);
    console.log("newVideo.title:", newVideo.title);
    console.log("newVideo.videoUrl:", newVideo.videoUrl);
    console.log("newVideo.duration:", newVideo.duration);
    
    if (!selectedCourseId || !newVideo.title || !newVideo.videoUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    // If no duration provided, use a default
    const videoData = {
      ...newVideo,
      duration: newVideo.duration || "0:00"
    };

    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        const courseIndex = courses.findIndex(c => c.id === selectedCourseId);
        if (courseIndex === -1) return;

        const newVideoId = Date.now();
        const video: Video = {
          id: newVideoId,
          ...videoData
        };

        const updatedCourses = [...courses];
        updatedCourses[courseIndex].lessons.push(video);
        setCourses(updatedCourses);

        // Reset everything to completely fresh state
        setShowAddVideoModal(false);
        setNewVideo({ title: "", videoUrl: "", duration: "", description: "" });
        setVideoFile(null);
        setUploadProgress(0);
        setIsUploading(false);
        setDetectingDuration(false);
        setSelectedCourseId("");
        
        toast.success("Video added! Click Save to apply changes.");
      }
    }, 200);
  };

  const handleEditVideo = () => {
    if (!editingVideo || !selectedCourseId) return;

    const courseIndex = courses.findIndex(c => c.id === selectedCourseId);
    if (courseIndex === -1) return;

    const updatedCourses = [...courses];
    const videoIndex = updatedCourses[courseIndex].lessons.findIndex(v => v.id === editingVideo.id);
    
    if (videoIndex !== -1) {
      updatedCourses[courseIndex].lessons[videoIndex] = editingVideo;
      setCourses(updatedCourses);
      
      setShowEditVideoModal(false);
      setEditingVideo(null);
      toast.success("Video updated! Click Save to apply changes.");
    }
  };

  const handleDeleteVideo = (courseId: string, videoId: number) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      const courseIndex = courses.findIndex(c => c.id === courseId);
      if (courseIndex === -1) return;

      const updatedCourses = [...courses];
      updatedCourses[courseIndex].lessons = updatedCourses[courseIndex].lessons.filter(v => v.id !== videoId);
      setCourses(updatedCourses);
      
      toast.success("Video deleted! Click Save to apply changes.");
    }
  };

  const openEditVideoModal = (courseId: string, video: Video) => {
    setSelectedCourseId(courseId);
    setEditingVideo({ ...video });
    setOriginalVideo({ ...video });
    setHasVideoChanges(false);
    setShowEditVideoModal(true);
  };

  // Detect changes in editing video
  useEffect(() => {
    if (editingVideo && originalVideo) {
      const hasChanges = 
        editingVideo.title !== originalVideo.title ||
        editingVideo.duration !== originalVideo.duration ||
        editingVideo.description !== originalVideo.description;
      setHasVideoChanges(hasChanges);
    }
  }, [editingVideo, originalVideo]);

  const openEditRevenueModal = (courseId: string, currentRevenue: number) => {
    setSelectedCourseId(courseId);
    setEditingRevenue(currentRevenue);
    setShowEditRevenueModal(true);
  };

  const handleUpdateRevenue = () => {
    const courseIndex = courses.findIndex(c => c.id === selectedCourseId);
    if (courseIndex === -1) return;

    const updatedCourses = [...courses];
    updatedCourses[courseIndex].revenue = editingRevenue;
    setCourses(updatedCourses);

    setShowEditRevenueModal(false);
    setEditingRevenue(0);
    toast.success("Revenue updated! Click Save to apply changes.");
  };

  // Helper function to close video modal and reset form
  const closeVideoModal = () => {
    if (!isUploading) {
      setShowAddVideoModal(false);
      setNewVideo({ title: "", videoUrl: "", duration: "", description: "" });
      setVideoFile(null);
      setDetectingDuration(false);
      setUploadProgress(0);
      setSelectedCourseId("");
    }
  };

  const handleEditUser = (userEmail: string) => {
    const user = users.find(u => u.email === userEmail);
    if (user) {
      setEditingUserId(userEmail);
      setEditedUserData({ ...user });
    }
  };

  const handleSaveUserChanges = () => {
    if (!editingUserId) return;

    const updatedUsers = users.map(u => 
      u.email === editingUserId ? { ...u, ...editedUserData } : u
    );

    setUsers(updatedUsers);
    setEditingUserId(null);
    setEditedUserData({});
    toast.success("User data updated! Click Save to apply changes.");
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditedUserData({});
  };

  const handleDeleteUser = (userEmail: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.email !== userEmail));
      toast.success("User deleted! Click Save to apply changes.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1623] to-[#0a0f1e]">
      <Toaster position="top-center" />

      {/* Global Save/Cancel Bar */}
      <AnimatePresence>
        {hasPendingChanges && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 backdrop-blur-xl border-b border-amber-500/30 shadow-2xl"
          >
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <p className="text-slate-100 font-semibold">
                  You have unsaved changes
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleGlobalCancel}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleGlobalSave}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save All Changes
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`bg-slate-900/90 backdrop-blur-xl border-b border-blue-500/20 sticky z-40 transition-all duration-300 ${hasPendingChanges ? 'top-[72px]' : 'top-0'}`}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MuxionLogo size={120} className="text-blue-400" />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-slate-100">Admin Dashboard</h1>
              <p className="text-sm text-slate-400">Manage courses and videos</p>
            </div>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === "courses"
                ? "bg-blue-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Courses Management
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === "users"
                ? "bg-blue-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Users Management
          </button>
          <button
            onClick={() => setActiveTab("navigation")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === "navigation"
                ? "bg-blue-500 text-white"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Menu className="w-4 h-4 inline mr-2" />
            Navigation Links
          </button>
        </div>

        {activeTab === "courses" ? (
          <>
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 backdrop-blur-xl rounded-xl p-6 border border-blue-500/20"
          >
            <BookOpen className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-3xl font-bold text-slate-100 mb-1">{courses.length}</h3>
            <p className="text-slate-400">Total Courses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-600/20 to-purple-500/10 backdrop-blur-xl rounded-xl p-6 border border-purple-500/20"
          >
            <Video className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-3xl font-bold text-slate-100 mb-1">
              {courses.reduce((acc, course) => acc + course.lessons.length, 0)}
            </h3>
            <p className="text-slate-400">Total Videos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-600/20 to-green-500/10 backdrop-blur-xl rounded-xl p-6 border border-green-500/20"
          >
            <DollarSign className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-3xl font-bold text-slate-100 mb-1">
              ₹{totalRevenue.toLocaleString()}
            </h3>
            <p className="text-slate-400">Total Revenue</p>
          </motion.div>
        </div>

        {/* Add Course Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddCourseModal(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-xl border border-blue-500/20 overflow-hidden"
            >
              {/* Course Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">{course.title}</h3>
                    <p className="text-slate-400 mb-3">{course.description}</p>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        ₹{course.price}
                      </span>
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                        {course.lessons.length} videos
                      </span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                        {calculateCourseDuration(course.lessons)}
                      </span>
                      <button
                        onClick={() => openEditRevenueModal(course.id, course.revenue)}
                        className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm hover:bg-yellow-500/30 transition-colors flex items-center gap-1"
                      >
                        <DollarSign className="w-3 h-3" />
                        Revenue: ₹{course.revenue}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        // Reset form to fresh state before opening
                        setNewVideo({ title: "", videoUrl: "", duration: "", description: "" });
                        setVideoFile(null);
                        setDetectingDuration(false);
                        setUploadProgress(0);
                        setIsUploading(false);
                        setSelectedCourseId(course.id);
                        setShowAddVideoModal(true);
                      }}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Add Video
                    </Button>
                    <Button
                      onClick={() => handleDeleteCourse(course.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Toggle Videos */}
                <button
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {expandedCourse === course.id ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Hide Videos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show Videos ({course.lessons.length})
                    </>
                  )}
                </button>
              </div>

              {/* Videos List */}
              <AnimatePresence>
                {expandedCourse === course.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-blue-500/20"
                  >
                    <div className="p-6 space-y-3">
                      {course.lessons.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">
                          No videos yet. Click "Add Video" to upload your first video.
                        </p>
                      ) : (
                        course.lessons.map((video, index) => (
                          <div
                            key={video.id}
                            className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-800/70 transition-all"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <PlayCircle className="w-5 h-5 text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-slate-100">
                                  {index + 1}. {video.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-sm text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {video.duration}
                                  </span>
                                  {video.description && (
                                    <span className="text-sm text-slate-500">
                                      {video.description.substring(0, 50)}...
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => openEditVideoModal(course.id, video)}
                                size="sm"
                                variant="outline"
                                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteVideo(course.id, video.id)}
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        </>
        ) : activeTab === "users" ? (
          <>
            {/* Users Management Tab */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-xl border border-blue-500/20 overflow-hidden"
            >
              <div className="p-6 border-b border-blue-500/20">
                <h2 className="text-2xl font-bold text-slate-100">Registered Users</h2>
                <p className="text-slate-400 mt-1">Total Users: {users.length}</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Profile</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Login Timestamp</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                          No users registered yet
                        </td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                        <motion.tr
                          key={user.email}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-t border-slate-700/50 hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            {user.profilePicture ? (
                              <img
                                src={user.profilePicture}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-blue-500/30">
                                <UserIcon className="w-5 h-5 text-blue-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingUserId === user.email ? (
                              <input
                                type="text"
                                value={editedUserData.name}
                                onChange={(e) => setEditedUserData({ ...editedUserData, name: e.target.value })}
                                className="w-full px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded text-slate-200 font-medium focus:outline-none focus:border-blue-500"
                              />
                            ) : (
                              <span className="text-slate-200 font-medium">{user.name}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-300">{user.email}</td>
                          <td className="px-6 py-4">
                            {editingUserId === user.email ? (
                              <input
                                type="text"
                                value={editedUserData.phone}
                                onChange={(e) => setEditedUserData({ ...editedUserData, phone: e.target.value })}
                                placeholder="Add phone number"
                                className="w-full px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded text-slate-300 focus:outline-none focus:border-blue-500"
                              />
                            ) : (
                              <span className="text-slate-300">
                                {user.phone || <span className="text-slate-500 italic">Not provided</span>}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-sm">
                            {user.loginTimestamp ? new Date(user.loginTimestamp).toLocaleString() : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {editingUserId === user.email ? (
                                <>
                                  <Button
                                    onClick={handleSaveUserChanges}
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600"
                                  >
                                    <Save className="w-4 h-4 mr-1" />
                                    Save
                                  </Button>
                                  <Button
                                    onClick={handleCancelEdit}
                                    size="sm"
                                    variant="outline"
                                    className="border-slate-600 text-slate-400 hover:bg-slate-800"
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    onClick={() => handleEditUser(user.email)}
                                    size="sm"
                                    variant="outline"
                                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteUser(user.email)}
                                    size="sm"
                                    variant="outline"
                                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        ) : activeTab === "navigation" ? (
          <>
            {/* Navigation Links Management */}
            <div className="mb-6">
              <Button
                onClick={() => setShowAddNavModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Navigation Link
              </Button>
            </div>

            {/* Navigation Links List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/90 backdrop-blur-xl rounded-xl border border-blue-500/20 overflow-hidden"
            >
              <div className="p-6 border-b border-blue-500/20">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                  <LinkIcon className="w-6 h-6" />
                  Navigation Links
                </h2>
                <p className="text-slate-400 mt-1">Manage your website navigation menu</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Sub Links
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {navLinks.map((link) => (
                      <tr key={link.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-slate-100 font-medium">{link.title}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-400 text-sm font-mono">{link.url}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {link.subLinks && link.subLinks.length > 0 ? (
                              <>
                                {link.subLinks.map((subLink) => (
                                  <div key={subLink.id} className="flex items-center gap-2 text-xs">
                                    <span className="text-slate-300">{subLink.title}</span>
                                    <button
                                      onClick={() => {
                                        const updatedLinks = navLinks.map((l) => {
                                          if (l.id === link.id && l.subLinks) {
                                            return {
                                              ...l,
                                              subLinks: l.subLinks.filter((s) => s.id !== subLink.id),
                                            };
                                          }
                                          return l;
                                        });
                                        setNavLinks(updatedLinks);
                                        saveNavLinks(updatedLinks);
                                        toast.success("Sub-link deleted");
                                      }}
                                      className="text-red-400 hover:text-red-300"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => {
                                    setSelectedNavForSubLink(link.id);
                                    setShowAddSubLinkModal(true);
                                  }}
                                  className="text-blue-400 hover:text-blue-300 text-xs mt-1 text-left"
                                >
                                  + Add Sub-Link
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedNavForSubLink(link.id);
                                  setShowAddSubLinkModal(true);
                                }}
                                className="text-blue-400 hover:text-blue-300 text-xs text-left"
                              >
                                + Add Sub-Link
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingNavLink(link);
                                setNewNavLink({ title: link.title, url: link.url });
                                setShowEditNavModal(true);
                              }}
                              className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const updatedLinks = navLinks.filter((l) => l.id !== link.id);
                                setNavLinks(updatedLinks);
                                saveNavLinks(updatedLinks);
                                toast.success("Navigation link deleted");
                              }}
                              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        ) : null}
      </main>

      {/* Add Course Modal */}
      <AnimatePresence>
        {showAddCourseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddCourseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-blue-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-blue-500/20 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-100">Create New Course</h2>
                <button
                  onClick={() => setShowAddCourseModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    placeholder="e.g., Advanced Figma Techniques"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    placeholder="Brief description of the course"
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: parseInt(e.target.value) || 0 })}
                    placeholder="299"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    💡 Course duration will be automatically calculated from uploaded videos
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Level
                    </label>
                    <select
                      value={newCourse.level}
                      onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>All Levels</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Language
                    </label>
                    <input
                      type="text"
                      value={newCourse.language}
                      onChange={(e) => setNewCourse({ ...newCourse, language: e.target.value })}
                      placeholder="English"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Instructor
                  </label>
                  <input
                    type="text"
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                    placeholder="Mariam Parvez"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAddCourse}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Course
                  </Button>
                  <Button
                    onClick={() => setShowAddCourseModal(false)}
                    variant="outline"
                    className="border-slate-600 text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Video Modal */}
      <AnimatePresence>
        {showAddVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-blue-500/30 max-w-2xl w-full max-h-[400px] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-blue-500/20 flex items-center justify-between flex-shrink-0">
                <h2 className="text-2xl font-bold text-slate-100">Upload Video</h2>
                <button
                  onClick={closeVideoModal}
                  disabled={isUploading}
                  className="w-8 h-8 rounded-full bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    placeholder="e.g., Introduction to Design Principles"
                    disabled={isUploading}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                {/* File Upload Option */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Upload Video File *
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      id="video-file-upload"
                      accept="video/*"
                      onChange={handleVideoFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <label
                      htmlFor="video-file-upload"
                      className={`flex items-center justify-center gap-2 w-full px-4 py-4 bg-blue-500/20 border-2 border-dashed border-blue-500/50 rounded-lg text-blue-400 hover:bg-blue-500/30 hover:border-blue-400 cursor-pointer transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Upload className="w-5 h-5" />
                      <span className="font-medium">
                        {videoFile ? videoFile.name : 'Click to upload video file (.mp4, .webm, .mov)'}
                      </span>
                    </label>
                    {videoFile && (
                      <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 px-3 py-2 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>File selected: {videoFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-slate-900 px-4 text-slate-500 text-sm font-medium">OR</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Video URL (YouTube, Vimeo, or direct link)
                  </label>
                  <input
                    type="text"
                    value={newVideo.videoUrl}
                    onChange={(e) => handleVideoUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    disabled={isUploading || !!videoFile}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  />
                  {detectingDuration && (
                    <p className="text-xs text-blue-400 mt-2 flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Detecting video duration...
                    </p>
                  )}
                  {videoFile && (
                    <p className="text-xs text-slate-500 mt-2">
                      URL input is disabled when a file is selected
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Duration (Optional - auto-detected for direct video files)
                  </label>
                  <input
                    type="text"
                    value={newVideo.duration}
                    onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                    placeholder="e.g., 15:30 (optional - defaults to 0:00)"
                    disabled={isUploading || detectingDuration}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    For YouTube/Vimeo, you can leave this empty or enter manually. Direct video files (.mp4, .webm) will auto-detect.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    placeholder="Brief description of the video"
                    rows={3}
                    disabled={isUploading}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                {isUploading && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Uploading...</span>
                      <span className="text-sm text-blue-400">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAddVideo}
                    disabled={isUploading || !newVideo.title || !newVideo.videoUrl}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Video
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={closeVideoModal}
                    disabled={isUploading}
                    variant="outline"
                    className="border-slate-600 text-slate-400 hover:bg-slate-800 disabled:opacity-50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Video Modal */}
      <AnimatePresence>
        {showEditVideoModal && editingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowEditVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-blue-500/30 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-blue-500/20 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-100">Edit Video</h2>
                <button
                  onClick={() => setShowEditVideoModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                    placeholder="e.g., Introduction to Design Principles"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    value={editingVideo.duration}
                    onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                    placeholder="e.g., 15:30"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={editingVideo.description || ""}
                    onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                    placeholder="Brief description of the video"
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleEditVideo}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setShowEditVideoModal(false)}
                    variant="outline"
                    className="border-slate-600 text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Revenue Modal */}
      <AnimatePresence>
        {showEditRevenueModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowEditRevenueModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-blue-500/30 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-blue-500/20 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-100">Update Revenue</h2>
                <button
                  onClick={() => setShowEditRevenueModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-700/50 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Revenue Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={editingRevenue}
                    onChange={(e) => setEditingRevenue(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleUpdateRevenue}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Revenue
                  </Button>
                  <Button
                    onClick={() => setShowEditRevenueModal(false)}
                    variant="outline"
                    className="border-slate-600 text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Navigation Link Modal */}
      <AnimatePresence>
        {showAddNavModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddNavModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-xl border border-blue-500/30 p-6 w-full max-w-md"
            >
              <h3 className="text-2xl font-bold text-slate-100 mb-6">Add Navigation Link</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Link Title *
                  </label>
                  <input
                    type="text"
                    value={newNavLink.title}
                    onChange={(e) => setNewNavLink({ ...newNavLink, title: e.target.value })}
                    placeholder="e.g., About Us"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    URL *
                  </label>
                  <input
                    type="text"
                    value={newNavLink.url}
                    onChange={(e) => setNewNavLink({ ...newNavLink, url: e.target.value })}
                    placeholder="e.g., https://example.com or #section"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      if (!newNavLink.title || !newNavLink.url) {
                        toast.error("Please fill all fields");
                        return;
                      }
                      const updatedLinks = [
                        ...navLinks,
                        {
                          id: `nav-${Date.now()}`,
                          title: newNavLink.title,
                          url: newNavLink.url,
                          subLinks: [],
                        },
                      ];
                      setNavLinks(updatedLinks);
                      saveNavLinks(updatedLinks);
                      setNewNavLink({ title: "", url: "" });
                      setShowAddNavModal(false);
                      toast.success("Navigation link added!");
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Add Link
                  </Button>
                  <Button
                    onClick={() => {
                      setNewNavLink({ title: "", url: "" });
                      setShowAddNavModal(false);
                    }}
                    variant="outline"
                    className="border-slate-600 text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Navigation Link Modal */}
      <AnimatePresence>
        {showEditNavModal && editingNavLink && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowEditNavModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-xl border border-blue-500/30 p-6 w-full max-w-md"
            >
              <h3 className="text-2xl font-bold text-slate-100 mb-6">Edit Navigation Link</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Link Title *
                  </label>
                  <input
                    type="text"
                    value={newNavLink.title}
                    onChange={(e) => setNewNavLink({ ...newNavLink, title: e.target.value })}
                    placeholder="e.g., About Us"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    URL *
                  </label>
                  <input
                    type="text"
                    value={newNavLink.url}
                    onChange={(e) => setNewNavLink({ ...newNavLink, url: e.target.value })}
                    placeholder="e.g., https://example.com or #section"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      if (!newNavLink.title || !newNavLink.url) {
                        toast.error("Please fill all fields");
                        return;
                      }
                      const updatedLinks = navLinks.map((link) =>
                        link.id === editingNavLink.id
                          ? { ...link, title: newNavLink.title, url: newNavLink.url }
                          : link
                      );
                      setNavLinks(updatedLinks);
                      saveNavLinks(updatedLinks);
                      setNewNavLink({ title: "", url: "" });
                      setEditingNavLink(null);
                      setShowEditNavModal(false);
                      toast.success("Navigation link updated!");
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setNewNavLink({ title: "", url: "" });
                      setEditingNavLink(null);
                      setShowEditNavModal(false);
                    }}
                    variant="outline"
                    className="border-slate-600 text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Sub-Link Modal */}
      <AnimatePresence>
        {showAddSubLinkModal && selectedNavForSubLink && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddSubLinkModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-xl border border-blue-500/30 p-6 w-full max-w-md"
            >
              <h3 className="text-2xl font-bold text-slate-100 mb-6">Add Sub-Link</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Sub-Link Title *
                  </label>
                  <input
                    type="text"
                    value={newSubLink.title}
                    onChange={(e) => setNewSubLink({ ...newSubLink, title: e.target.value })}
                    placeholder="e.g., Our Team"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    URL *
                  </label>
                  <input
                    type="text"
                    value={newSubLink.url}
                    onChange={(e) => setNewSubLink({ ...newSubLink, url: e.target.value })}
                    placeholder="e.g., https://example.com/team"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => {
                      if (!newSubLink.title || !newSubLink.url) {
                        toast.error("Please fill all fields");
                        return;
                      }
                      const updatedLinks = navLinks.map((link) => {
                        if (link.id === selectedNavForSubLink) {
                          const subLinks = link.subLinks || [];
                          return {
                            ...link,
                            subLinks: [
                              ...subLinks,
                              {
                                id: `sub-${Date.now()}`,
                                title: newSubLink.title,
                                url: newSubLink.url,
                              },
                            ],
                          };
                        }
                        return link;
                      });
                      setNavLinks(updatedLinks);
                      saveNavLinks(updatedLinks);
                      setNewSubLink({ title: "", url: "" });
                      setSelectedNavForSubLink(null);
                      setShowAddSubLinkModal(false);
                      toast.success("Sub-link added!");
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Add Sub-Link
                  </Button>
                  <Button
                    onClick={() => {
                      setNewSubLink({ title: "", url: "" });
                      setSelectedNavForSubLink(null);
                      setShowAddSubLinkModal(false);
                    }}
                    variant="outline"
                    className="border-slate-600 text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
