import { Link } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { MuxionLogo } from "../components/MuxionLogo";
import { ArrowRight, BookOpen, Clock, Users, Star, ChevronLeft, ChevronRight, ChevronDown, Phone, MessageCircle, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { CourseSelectionModal } from "../components/CourseSelectionModal";
import { CourseUnlockModal } from "../components/CourseUnlockModal";
import { SEO } from "../components/SEO";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { getAllCourses } from "../data/coursesData";
import { getNavLinks, type NavLink } from "../data/navigationData";
import type { CourseData } from "../data/coursesData";
import { 
  generateOrganizationSchema, 
  generateWebsiteSchema, 
  generateCoursesListSchema,
  generateFAQSchema,
  insertStructuredData 
} from "../utils/structuredData";

// Image URLs
import mariamImg from "figma:asset/b24ff9e4b7551f05e787bd06aa29bbbf89d44e92.png";
import ctaBackgroundImg from "figma:asset/0617dec9ba8a134c7f69dae9fb5259f95929d255.png";

// Testimonial Images
import testimonial1Img from "figma:asset/c36a1a4faf91b7365b04df6f3a9bed203a782d09.png";
import testimonial2Img from "figma:asset/3e0732befcb3a9a58cfb483d474aac3938c36983.png";
import testimonial3Img from "figma:asset/1015908ea8bd5c3f8e0662f071bc71125795d7a4.png";
import testimonial4Img from "figma:asset/115a7e33811821aa62a30e42f6a5ce88a981dcc7.png";
import testimonial5Img from "figma:asset/39ddbabb326872f9801f978e2f526b5f19bb07c4.png";

export function Homepage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string>("");
  const [userProfilePicture, setUserProfilePicture] = useState<string>("");
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const ctaRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const email = localStorage.getItem("muxion_user_email");
    const name = localStorage.getItem("muxion_user_name");
    setUserEmail(email);
    setUserName(name);

    // Get full user data from muxion_users
    if (email) {
      const users = JSON.parse(localStorage.getItem("muxion_users") || "[]");
      const currentUser = users.find((u: any) => u.email === email);
      if (currentUser) {
        setUserPhone(currentUser.phone || "");
        setUserProfilePicture(currentUser.profilePicture || "");
      }
    }

    // Load navigation links
    const loadedNavLinks = getNavLinks();
    setNavLinks(loadedNavLinks);

    // Check if we should open a course modal from navigation state
    const state = location.state as { openCourseModal?: string } | null;
    if (state?.openCourseModal) {
      const allCourses = getAllCourses();
      const courseToOpen = allCourses.find(c => c.id === state.openCourseModal);
      if (courseToOpen) {
        setSelectedCourse(courseToOpen);
        setShowUnlockModal(true);
      }
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Add structured data for SEO
  useEffect(() => {
    const courses = getAllCourses();
    
    // Add Organization Schema
    const orgScript = insertStructuredData(generateOrganizationSchema());
    
    // Add Website Schema
    const websiteScript = insertStructuredData(generateWebsiteSchema());
    
    // Add Courses List Schema
    const coursesScript = insertStructuredData(generateCoursesListSchema(courses));
    
    // Add FAQ Schema
    const faqScript = insertStructuredData(generateFAQSchema([
      {
        question: "What is MUXION?",
        answer: "MUXION (MUX) is India and Pakistan's premier online learning platform for UI/UX Design, Graphic Design, and Academic courses. We offer affordable, high-quality courses with lifetime access taught by industry expert Mariam Parvez."
      },
      {
        question: "How much do MUXION courses cost?",
        answer: "Our design courses are extremely affordable: UI/UX Mastery at ₹599, Figma at ₹349, and Adobe courses (Photoshop & Illustrator) at ₹299 each. School courses (Maths, Physics) are ₹4,999/month and Chemistry is ₹9,999/month."
      },
      {
        question: "Do I get lifetime access to courses?",
        answer: "Yes! Once you purchase any MUXION course, you get lifetime access to all video lessons, progress tracking, and updates when new content is added."
      },
      {
        question: "Is the first lesson free?",
        answer: "Absolutely! The first lesson of every MUXION course is completely free so you can preview the teaching style and content quality before purchasing."
      },
      {
        question: "Who teaches at MUXION?",
        answer: "Design courses are taught by Mariam Parvez, an experienced UI/UX designer and educator. School courses (Maths, Physics, Chemistry) are led by Farzana Shaheen and Syed Yaseen."
      },
      {
        question: "Can I learn UI/UX design from scratch at MUXION?",
        answer: "Yes! Our courses are designed for all levels, from complete beginners to advanced learners. No prior experience is needed."
      }
    ]));
    
    // Cleanup function to remove scripts
    return () => {
      document.head.removeChild(orgScript);
      document.head.removeChild(websiteScript);
      document.head.removeChild(coursesScript);
      document.head.removeChild(faqScript);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("muxion_user_email");
    localStorage.removeItem("muxion_user_name");
    localStorage.removeItem("muxion_is_admin");
    setUserEmail(null);
    setUserName(null);
    setUserPhone("");
    setUserProfilePicture("");
    navigate("/");
  };

  // Parallax effect for CTA background
  const { scrollYProgress } = useScroll({
    target: ctaRef,
    offset: ["start end", "end start"]
  });
  
  const parallaxY = useTransform(scrollYProgress, [0, 1], [150, -150]);

  // Calculate items per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) { // 2xl screens
        setItemsPerView(5);
      } else if (width >= 1024) { // lg screens (desktop)
        setItemsPerView(3);
      } else if (width >= 768) { // md screens (iPad)
        setItemsPerView(2);
      } else { // mobile
        setItemsPerView(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = [
    { title: "8 Lectures", value: "8", icon: BookOpen },
    { title: "22 Minutes", value: "22 mins", icon: Clock },
    { title: "All Levels", value: "All", icon: Users },
    { title: "4.9 Rating", value: "4.9", icon: Star },
  ];

  const testimonials = [
    {
      name: "Shyam Sundar",
      role: "Student @ ACTE",
      text: "Dear Mrs. Mariam Parvez, I would like to extend a warm thank you for organizing an amazing training session. Not only the session was very informative but the training material that was provided was also very interesting.",
      image: testimonial2Img
    },
    {
      name: "Manoj Kumar",
      role: "Student @ ACTE",
      text: "I highly recommend Mariam as a UI & UX tutor. Her teaching style is clear and structured, making complex concepts easy to understand for beginners and advanced learners alike. With a focus on hands-on learning, Mariam empowers students to design intuitively and think critically about user experience.",
      image: testimonial3Img
    },
    {
      name: "Hamilton - Judy's Father",
      role: "Student's Father from ACTE",
      text: "Mariam teaches drawing and photoshop for my 11 year old daughter. Her classes are very lively and engaging. She has an excellent grasp on the topics she teaches and her techniques are sound and precise. I strongly recommend to learn arts, photoshop and animation courses from her and she will help you take a leap very quickly.",
      image: testimonial2Img
    },
    {
      name: "Vinodhini",
      role: "Student @ ACTE",
      text: "Mariam's teaching in UI/UX courses is excellent; she has a great way of breaking down complex ideas so that everyone can understand them. Her practical approach and real-life examples help students gain the skills they need to succeed in the field.",
      image: testimonial5Img
    },
    {
      name: "Disha Kapur",
      role: "Student @ ACTE",
      text: "Mariyam ma'am teaches me every single detail required to learn in UXUI design.. I have hardly seen a teacher putting so much effort on her student. I'm glad that I got a chance to learn from her..",
      image: testimonial1Img
    },
  ];

  const nextTestimonial = () => {
    if (currentTestimonial < testimonials.length - itemsPerView) {
      setCurrentTestimonial((prev) => prev + 1);
    }
  };

  const prevTestimonial = () => {
    if (currentTestimonial > 0) {
      setCurrentTestimonial((prev) => prev - 1);
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      if (offset > 0 || velocity > 0) {
        prevTestimonial();
      } else {
        nextTestimonial();
      }
    }
  };

  const packages = [
    {
      title: "Personalized 1:1 Coaching",
      description: "Get hands-on guidance, personalized feedback, and a tailored curriculum. Perfect if you want direct interaction.",
      price: null,
      link: "https://wa.me/917358400469"
    },
    {
      title: "Online Course",
      description: "Learn at your own pace with a structured curriculum. Access modules anytime, anywhere. Ideal for independent learners.",
      price: null,
      link: "/course"
    }
  ];

  const courses = getAllCourses();

  // Handle course click - show unlock modal
  const handleCourseClick = (course: CourseData) => {
    if (!userEmail) {
      // Not logged in, redirect to login
      navigate("/login");
      return;
    }
    
    // Show unlock modal
    setSelectedCourse(course);
    setShowUnlockModal(true);
  };

  return (
    <>
      {/* SEO Component */}
      <SEO 
        title="MUXION - Master UI/UX Design Course | Best Design Training in India & Pakistan"
        description="Learn UI/UX Design, Figma, Adobe Photoshop & Illustrator with MUXION. India & Pakistan's top-rated design courses by Mariam Parvez. Affordable pricing starting ₹299. Plus Maths, Physics, Chemistry for Classes 9-12. Enroll now for lifetime access!"
        keywords={[
          "MUXION",
          "MUX",
          "UI UX design course",
          "UI UX course India",
          "UI UX course Pakistan",
          "design course online",
          "Figma course",
          "Adobe Photoshop course",
          "best UI UX course",
          "affordable design course",
          "Mariam Parvez",
          "maths course",
          "physics course",
          "chemistry course",
          "CBSE course online"
        ]}
        url="https://muxion.in"
        image="https://muxion.in/og-image.jpg"
        type="website"
      />

      <div className="min-h-screen bg-gradient-to-b from-[#0a0f1e] via-[#0f1623] to-[#0a0f1e] relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0f1623]/90 backdrop-blur-xl border-b border-blue-500/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MuxionLogo size={120} className="text-blue-400" />
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => {
              // Check if this is the courses link
              const isCoursesLink = link.title.toLowerCase() === "courses" || link.id === "courses";
              
              // If it has sub-links or it's the courses link, render as dropdown
              if ((link.subLinks && link.subLinks.length > 0) || isCoursesLink) {
                return (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group"
                    onMouseEnter={() => isCoursesLink && setIsCoursesOpen(true)}
                    onMouseLeave={() => isCoursesLink && setIsCoursesOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-slate-300 hover:text-blue-400 font-medium transition-colors duration-300">
                      {link.title}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCoursesLink && isCoursesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div
                      className={`absolute top-full left-0 mt-2 w-64 bg-[#1e293b] rounded-xl shadow-2xl border border-blue-500/20 py-2 overflow-y-auto max-h-[40vh] transition-all duration-300 ${isCoursesLink && isCoursesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'}`}
                      style={{ 
                        scrollbarWidth: 'thin', 
                        scrollbarColor: '#3b82f6 #1e293b'
                      }}
                    >
                      {isCoursesLink ? (
                        // Dynamic courses from courses data
                        courses.map(course => (
                          <button 
                            key={course.id} 
                            onClick={() => handleCourseClick(course)}
                            className="block w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-200"
                          >
                            {course.title}
                          </button>
                        ))
                      ) : (
                        // Custom sub-links
                        link.subLinks?.map(subLink => (
                          <a 
                            key={subLink.id} 
                            href={subLink.url}
                            target={subLink.url.startsWith('http') ? '_blank' : undefined}
                            rel={subLink.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="block px-4 py-2.5 text-sm text-slate-300 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-200"
                          >
                            {subLink.title}
                          </a>
                        ))
                      )}
                    </div>
                  </motion.div>
                );
              }
              
              // Regular link
              return (
                <motion.a
                  key={link.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  href={link.url}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-slate-300 hover:text-blue-400 font-medium transition-colors duration-300"
                >
                  {link.title}
                </motion.a>
              );
            })}
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-3"
            >
              {userEmail ? (
                <div className="relative">
                  <button
                    className="flex items-center gap-2 bg-blue-500/20 px-3 py-1.5 rounded-full border border-blue-500/20 text-blue-400 font-semibold hover:bg-blue-500/30 transition-all duration-300"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  >
                    {userProfilePicture ? (
                      <img 
                        src={userProfilePicture} 
                        alt={userName || "User"} 
                        className="w-6 h-6 rounded-full object-cover border-2 border-blue-400/50"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4" />
                    )}
                    {userName}
                  </button>
                  {isProfileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-[#1e293b] rounded-xl shadow-2xl border border-blue-500/20 py-2 overflow-y-auto max-h-[40vh] transition-all duration-300"
                      style={{ 
                        scrollbarWidth: 'thin', 
                        scrollbarColor: '#3b82f6 #1e293b'
                      }}
                    >
                      <Link to="/profile" className="block px-4 py-2.5 text-sm text-slate-300 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-200">
                        Profile
                      </Link>
                      <button
                        className="block px-4 py-2.5 text-sm text-slate-300 hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-200"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button 
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 transition-all duration-300"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 font-semibold px-6 transition-all duration-300"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 bg-gradient-to-b from-[#0a0f1e] via-[#0f1623] to-[#0a0f1e]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="font-bold mb-6 text-4xl text-slate-100">
              Master UI/UX Design and Development with MUXION <br />
              <span className="text-blue-400">Best Online Design Course in India</span>
            </h1>
            
            <p className="text-base text-slate-400 leading-relaxed">
              Learn UI/UX Design, Figma, Adobe Photoshop & Illustrator from expert instructor Mariam Parvez. MUXION offers affordable, lifetime access design courses starting at just ₹299. Join thousands of students mastering design skills online.
            </p>
          </motion.div>

          {/* Course Features Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-blue-700/20 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20 shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4">Course Features</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/20">
                <span className="text-xs opacity-90">Instructor</span>
                <span className="text-sm font-semibold">Mariam Parvez</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/20">
                <span className="text-xs opacity-90">Lectures</span>
                <span className="text-sm font-semibold">8</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/20">
                <span className="text-xs opacity-90">Duration</span>
                <span className="text-sm font-semibold">22 mins</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/20">
                <span className="text-xs opacity-90">Skill Level</span>
                <span className="text-sm font-semibold">All Levels</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/20">
                <span className="text-xs opacity-90">Language</span>
                <span className="text-sm font-semibold">English</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4 text-xl font-bold">
              <span>Course Pricing:</span>
              <span>₹599</span>
            </div>

            <Button 
              size="default" 
              variant="secondary" 
              className="w-full text-base bg-blue-700 hover:bg-blue-800 text-white"
              onClick={() => {
                const uiuxCourse = courses.find(c => c.id === "uiux");
                if (uiuxCourse) {
                  handleCourseClick(uiuxCourse);
                }
              }}
            >
              {userEmail ? "Go to Course" : "Enroll Now"}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gradient-to-br from-[#1a1f35] via-[#141829] to-[#0f1420] py-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-600/10 to-blue-500/5 backdrop-blur-xl rounded-xl p-6 border border-blue-500/20"
                >
                  <Icon className="h-8 w-8 text-blue-400 mb-3" />
                  <h3 className="font-bold text-2xl mb-1 text-slate-100">{feature.value}</h3>
                  <p className="text-slate-400 text-sm">{feature.title}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* About the Coach */}
      <section id="about-coach" className="bg-gradient-to-br from-[#151a2e] via-[#0f1420] to-[#1a1f35] py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-[35%_65%] gap-12 items-center max-w-7xl mx-auto">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative max-w-sm mx-auto lg:mx-0"
            >
              <div className="relative">
                {/* Decorative gradient blob behind image */}
                <div className="absolute -inset-6 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl opacity-50" />
                
                <img 
                  src={mariamImg} 
                  alt="MUXION Founder - Mariam Parvez" 
                  className="relative rounded-3xl shadow-2xl w-full h-auto object-cover border-2 border-blue-500/30"
                />
                
                {/* Stats Badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="absolute -bottom-4 -right-4 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl p-4 shadow-2xl border border-blue-400/30"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-0.5">7.6+</div>
                    <div className="text-xs text-blue-100">Years Experience</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 text-blue-400 font-semibold mb-5 rounded-full text-sm backdrop-blur-xl"
              >
                <Star className="w-4 h-4 fill-blue-400" />
                About MUXION
              </motion.div>
              
              <h2 className="font-bold mb-5 text-3xl lg:text-3xl text-slate-100 leading-snug">
                Why choose{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  MUXION
                </span>
                {" "}for UI/UX Design Course in India
              </h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed text-base">
                <p className="text-base">
                  Welcome to <span className="font-semibold text-blue-400">MUXION</span>, India's premier online learning platform for UI/UX design, Figma, Adobe Creative Suite, and academic courses. Founded by expert instructor <span className="font-semibold text-white">Mariam Parvez</span>, MUXION offers affordable design courses with lifetime access, 1:1 mentorship, and fresh content added every Wednesday!
                </p>
                
                <p>
                  With <span className="font-semibold text-white">7.6 years of industry experience</span> from top companies like Deloitte, Insoft and Prodapt, Mariam delivers real-world skills through hands-on projects making her the best coach to get you fully equipped as a quintessential designer. Our curriculum covers everything from fundamentals to advanced techniques – practical, straightforward, and results-driven.
                </p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="pt-2"
                >
                  <p className="text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Ready for a truly comprehensive, no-nonsense education in design? Join MUXION today! 🚀
                  </p>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex flex-wrap gap-3 pt-3"
                >
                  <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">10+ Students</span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
                    <Star className="w-4 h-4 text-purple-400 fill-purple-400" />
                    <span className="text-sm font-medium">4.9 Rating</span>
                  </div>
                  <div className="flex items-center gap-2 bg-pink-500/10 px-3 py-1.5 rounded-full border border-pink-500/20">
                    <BookOpen className="w-4 h-4 text-pink-400" />
                    <span className="text-sm font-medium">5 Courses</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learn on Your Terms - Pricing Section */}
      <section className="bg-gradient-to-br from-[#0f1420] via-[#1a1f35] to-[#0f1420] py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-bold text-3xl text-slate-100 max-w-3xl mx-auto">
              Go all-in with the complete{" "}
              <Link to="/course/uiux" className="text-blue-400 underline hover:text-blue-300 transition-colors">
                UI UX Design Program
              </Link>
              {" "}or{" "}
              <span className="text-blue-400">pick your courses</span>
            </h2>
          </motion.div>

          {/* Pre-Recorded Courses Grid */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8 justify-center"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-bold text-2xl text-slate-100">Pre Recorded Courses</h3>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {/* UI/UX Design Mastery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-blue-500/40 hover:border-blue-400/60 transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                <h4 className="font-bold text-lg text-slate-100 mb-3">UI/UX Design Mastery</h4>
                <div className="text-3xl font-bold text-blue-400 mb-4">₹599</div>
                {userEmail ? (
                  <Link to="/course/uiux">
                    <Button size="lg" className="w-full text-base bg-blue-500 hover:bg-blue-600 transition-all duration-300">
                      View Course
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button size="lg" className="w-full text-base bg-blue-500 hover:bg-blue-600 transition-all duration-300">
                      Enroll Now
                    </Button>
                  </Link>
                )}
              </motion.div>

              {/* Adobe Photoshop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-blue-600/10 to-blue-500/5 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
              >
                <h4 className="font-bold text-lg text-slate-100 mb-3">Adobe Photoshop</h4>
                <div className="text-3xl font-bold text-blue-400 mb-4">₹299</div>
                {userEmail ? (
                  <Link to="/course/photoshop">
                    <Button size="lg" className="w-full text-base bg-blue-500 hover:bg-blue-600 transition-all duration-300">
                      View Course
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button size="lg" className="w-full text-base bg-blue-500 hover:bg-blue-600 transition-all duration-300">
                      Enroll Now
                    </Button>
                  </Link>
                )}
              </motion.div>

              {/* Adobe Illustrator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-blue-600/10 to-blue-500/5 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
              >
                <h4 className="font-bold text-lg text-slate-100 mb-3">Adobe Illustrator</h4>
                <div className="text-3xl font-bold text-blue-400 mb-4">₹299</div>
                {userEmail ? (
                  <Link to="/course/illustrator">
                    <Button size="lg" className="w-full text-base bg-blue-500 hover:bg-blue-600 transition-all duration-300">
                      View Course
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button size="lg" className="w-full text-base bg-blue-500 hover:bg-blue-600 transition-all duration-300">
                      Enroll Now
                    </Button>
                  </Link>
                )}
              </motion.div>

              {/* Figma */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-blue-600/10 to-blue-500/5 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
              >
                <h4 className="font-bold text-lg text-slate-100 mb-3">Figma</h4>
                <div className="text-3xl font-bold text-blue-400 mb-4">₹349</div>
                {userEmail ? (
                  <Link to="/course/figma">
                    <Button size="lg" className="w-full text-base bg-blue-500 hover:bg-blue-600 transition-all duration-300">
                      View Course
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button size="lg" className="w-full text-base bg-blue-500 hover:bg-blue-600 transition-all duration-300">
                      Enroll Now
                    </Button>
                  </Link>
                )}
              </motion.div>

              {/* Frontend Development Fundamentals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-blue-600/10 to-blue-500/5 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
              >
                <h4 className="font-bold text-lg text-slate-100 mb-3">Front end Dev Basics</h4>
                <div className="text-3xl font-bold text-blue-400 mb-4">₹299</div>
                {userEmail ? (
                  <Link to="/course/frontend">
                    <Button size="lg" className="w-full text-base bg-blue-500 hover:bg-blue-600 transition-all duration-300">
                      View Course
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button size="lg" className="w-full text-base bg-blue-500 hover:bg-blue-600 transition-all duration-300">
                      Enroll Now
                    </Button>
                  </Link>
                )}
              </motion.div>
            </div>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent my-16"
          />

          {/* 1:1 Sessions Grid */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-8 justify-center"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-bold text-2xl text-slate-100">1:1 Sessions</h3>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {/* UI/UX Design Mastery 1:1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-purple-600/20 to-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-purple-500/40 hover:border-purple-400/60 transition-all duration-300 shadow-lg shadow-purple-500/20"
              >
                <h4 className="font-bold text-lg text-slate-100 mb-3">UI/UX Design Mastery</h4>
                <div className="text-3xl font-bold text-purple-400 mb-4">₹8,999</div>
                <div className="flex flex-col gap-3">
                  <a href="https://wa.me/917358400469" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full text-base bg-purple-500 hover:bg-purple-600 transition-all duration-300">
                      Book Session
                    </Button>
                  </a>
                  <a href="tel:+917358400469">
                    <Button size="lg" variant="outline" className="w-full text-base border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-all duration-300">
                      Call Now
                    </Button>
                  </a>
                </div>
              </motion.div>

              {/* Adobe Photoshop 1:1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-purple-600/10 to-purple-500/5 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
              >
                <h4 className="font-bold text-lg text-slate-100 mb-3">Adobe Photoshop</h4>
                <div className="text-3xl font-bold text-purple-400 mb-4">₹4,999</div>
                <div className="flex flex-col gap-3">
                  <a href="https://wa.me/917358400469" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full text-base bg-purple-500 hover:bg-purple-600 transition-all duration-300">
                      Book Session
                    </Button>
                  </a>
                  <a href="tel:+917358400469">
                    <Button size="lg" variant="outline" className="w-full text-base border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-all duration-300">
                      Call Now
                    </Button>
                  </a>
                </div>
              </motion.div>

              {/* Adobe Illustrator 1:1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-purple-600/10 to-purple-500/5 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
              >
                <h4 className="font-bold text-lg text-slate-100 mb-3">Adobe Illustrator</h4>
                <div className="text-3xl font-bold text-purple-400 mb-4">₹4,999</div>
                <div className="flex flex-col gap-3">
                  <a href="https://wa.me/917358400469" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full text-base bg-purple-500 hover:bg-purple-600 transition-all duration-300">
                      Book Session
                    </Button>
                  </a>
                  <a href="tel:+917358400469">
                    <Button size="lg" variant="outline" className="w-full text-base border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-all duration-300">
                      Call Now
                    </Button>
                  </a>
                </div>
              </motion.div>

              {/* Figma 1:1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-purple-600/10 to-purple-500/5 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
              >
                <h4 className="font-bold text-lg text-slate-100 mb-3">Figma</h4>
                <div className="text-3xl font-bold text-purple-400 mb-4">₹6,455</div>
                <div className="flex flex-col gap-3">
                  <a href="https://wa.me/917358400469" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full text-base bg-purple-500 hover:bg-purple-600 transition-all duration-300">
                      Book Session
                    </Button>
                  </a>
                  <a href="tel:+917358400469">
                    <Button size="lg" variant="outline" className="w-full text-base border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-all duration-300">
                      Call Now
                    </Button>
                  </a>
                </div>
              </motion.div>

              {/* Frontend Development Fundamentals 1:1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-purple-600/10 to-purple-500/5 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
              >
                <h4 className="font-bold text-lg text-slate-100 mb-3">Front end Dev Basics</h4>
                <div className="text-3xl font-bold text-purple-400 mb-4">₹3,599</div>
                <div className="flex flex-col gap-3">
                  <a href="https://wa.me/917358400469" target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full text-base bg-purple-500 hover:bg-purple-600 transition-all duration-300">
                      Book Session
                    </Button>
                  </a>
                  <a href="tel:+917358400469">
                    <Button size="lg" variant="outline" className="w-full text-base border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-all duration-300">
                      Call Now
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-gradient-to-br from-[#0d1420] to-[#0a0f1e] py-20 relative overflow-hidden">
        <div className="container mx-auto px-[16px] py-[0px] relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-bold mb-3 text-3xl text-slate-100">
              What students say about MUXION
            </h2>
            <p className="text-base text-slate-400">
              In their own words: Insights from our students
            </p>
          </motion.div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-7xl mx-auto">
            <div className="overflow-hidden py-2 px-1">
              <motion.div
                className="flex gap-4"
                animate={!isDragging ? {
                  x: `-${(currentTestimonial * 100) / itemsPerView}%`,
                } : undefined}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut"
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
              >
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`flex-shrink-0 ${
                      itemsPerView === 5 ? 'w-[calc(20%-12.8px)]' :
                      itemsPerView === 3 ? 'w-[calc(33.333%-10.67px)]' :
                      itemsPerView === 2 ? 'w-[calc(50%-8px)]' :
                      'w-full'
                    }`}
                  >
                    <div className="bg-gradient-to-br from-blue-600/10 to-blue-500/5 backdrop-blur-xl rounded-xl p-6 border border-blue-500/20 h-full flex flex-col gap-4 items-start hover:border-blue-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
                      <div className="flex flex-col flex-1 w-full">
                        <div className="mb-3 flex items-center gap-3">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-12 h-12 flex-shrink-0 rounded-full object-cover shadow-lg border-2 border-blue-500/20"
                          />
                          <div>
                            <h4 className="font-bold text-base mb-0.5 text-slate-100">{testimonial.name}</h4>
                            <p className="text-slate-400 text-xs">{testimonial.role}</p>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed italic text-left">
                          "{testimonial.text}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Left Arrow Navigation */}
            {currentTestimonial > 0 && itemsPerView < testimonials.length && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-500/20 backdrop-blur-xl shadow-xl flex items-center justify-center text-blue-400 hover:bg-blue-500/30 border border-blue-500/20 transition-all z-10"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            )}

            {/* Right Arrow Navigation */}
            {currentTestimonial < testimonials.length - itemsPerView && itemsPerView < testimonials.length && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-500/20 backdrop-blur-xl shadow-xl flex items-center justify-center text-blue-400 hover:bg-blue-500/30 border border-blue-500/20 transition-all z-10"
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="bg-gradient-to-br from-[#1a1f35] via-[#14182a] to-[#0f1420] py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-bold mb-4 text-3xl text-slate-100">Mentorship that actually helps!</h2>
            <p className="text-xl text-slate-400">
              Get personalized guidance through 1:1 sessions, group mentoring, or online flexible tutoring.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-gradient-to-br from-blue-600/10 to-blue-500/5 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
              >
                <h3 className="font-bold text-2xl mb-4 text-slate-100">{pkg.title}</h3>
                <p className="text-slate-300 mb-6 leading-relaxed min-h-[80px]">
                  {pkg.description}
                </p>
                {pkg.price && (
                  <div className="text-3xl font-bold text-blue-400 mb-6">
                    {pkg.price}
                  </div>
                )}
                {pkg.title === "Online Course" ? (
                  <Button 
                    size="lg" 
                    className="w-full text-lg bg-blue-500 hover:bg-blue-600 transition-all duration-300"
                    onClick={() => setShowCourseModal(true)}
                  >
                    Choose Package
                  </Button>
                ) : pkg.link.startsWith("http") ? (
                  <a href={pkg.link} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full text-lg bg-blue-500 hover:bg-blue-600 transition-all duration-300">
                      Choose Package
                    </Button>
                  </a>
                ) : (
                  <Link to={pkg.link}>
                    <Button size="lg" className="w-full text-lg bg-blue-500 hover:bg-blue-600 transition-all duration-300">
                      Choose Package
                    </Button>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative py-12 overflow-hidden"
        ref={ctaRef}
      >
        {/* Parallax Background Image - Crystal Clear Full Coverage */}
        <motion.div 
          className="absolute inset-0 w-full h-full will-change-transform"
          style={{ y: parallaxY }}
        >
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat scale-[2.2]"
            style={{ 
              backgroundImage: `url(${ctaBackgroundImg})`,
              imageRendering: '-webkit-optimize-contrast'
            }}
          />
        </motion.div>
        
        {/* Dark blue overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1929]/90 via-[#0d1b2a]/85 to-[#0a1929]/90" />
        
        <div className="container mx-auto px-6 text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-bold mb-6 text-4xl text-white drop-shadow-2xl">
              Ready to Start Your Design Journey?
            </h2>
            <p className="text-xl mb-8 text-slate-200 max-w-2xl mx-auto drop-shadow-lg">
              Join hundreds of students who have transformed their careers with expert UI/UX training
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <a href="https://wa.me/917358400469" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="text-lg px-12 bg-blue-500 hover:bg-blue-600 transition-all duration-300 shadow-2xl">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* School Students Section */}
      <section className="bg-gradient-to-br from-[#0f1420] via-[#1a1f35] to-[#0f1420] py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-bold mb-4 text-3xl text-slate-100">
              For School Students (Classes 9–12)
            </h2>
            <p className="text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Master Maths, Physics, and Chemistry with structured guidance for{" "}
              <span className="font-bold text-blue-400">CBSE and State Board students</span>.
            </p>
            <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mt-5">
              Led by Farzana Shaheen & Syed Yaseen
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
            {/* Maths Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-green-600/10 to-green-500/5 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 hover:border-green-400/40 transition-all duration-300"
            >
              <h3 className="font-bold text-xl text-slate-100 mb-3">Maths</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-green-400">₹4,999</span>
                <span className="text-slate-400 text-sm">(Per Month)</span>
              </div>
            </motion.div>

            {/* Physics Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-orange-600/10 to-orange-500/5 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300"
            >
              <h3 className="font-bold text-xl text-slate-100 mb-3">Physics</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-orange-400">₹4,999</span>
                <span className="text-slate-400 text-sm">(Per Month)</span>
              </div>
            </motion.div>

            {/* Chemistry Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-cyan-600/10 to-cyan-500/5 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300"
            >
              <h3 className="font-bold text-xl text-slate-100 mb-3">Chemistry</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-cyan-400">₹9,999</span>
                <span className="text-slate-400 text-sm">(Per Month)</span>
              </div>
            </motion.div>
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <a href="tel:+918807557977">
                <Button size="lg" className="text-lg px-10 bg-blue-500 hover:bg-blue-600 transition-all duration-300 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Know More
                </Button>
              </a>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <a href="https://chat.whatsapp.com/FI3G8RJ5UbYKygWNmLv0mC" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="secondary" className="text-lg px-10 bg-green-500 hover:bg-green-600 text-white transition-all duration-300 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Join WhatsApp Group
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0f1e] border-t border-blue-500/10 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <MuxionLogo size={100} className="text-blue-400 mb-4" />
              <p className="text-slate-400 text-sm mb-3">
                MUXION (MUX) - India's premier online learning platform for UI/UX Design, Figma, Adobe Photoshop, Illustrator, and academic courses.
              </p>
              <p className="text-xs text-slate-500">
                Learn from expert instructor Mariam Parvez with affordable courses starting at ₹299
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="font-bold text-lg mb-4 text-blue-400">Popular Courses</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/course/uiux" className="text-slate-400 hover:text-blue-400 transition">UI/UX Mastery - ₹599</a></li>
                <li><a href="/course/figma" className="text-slate-400 hover:text-blue-400 transition">Figma Complete - ₹349</a></li>
                <li><a href="/course/photoshop" className="text-slate-400 hover:text-blue-400 transition">Adobe Photoshop - ₹299</a></li>
                <li><a href="/course/illustrator" className="text-slate-400 hover:text-blue-400 transition">Adobe Illustrator - ₹299</a></li>
                <li><a href="/course/maths" className="text-slate-400 hover:text-blue-400 transition">Maths (9-12) - ₹4,999/mo</a></li>
              </ul>
            </motion.div>

            {/* Contact & Keywords */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-bold text-lg mb-4 text-blue-400">Contact Us</h3>
              <ul className="space-y-2 text-sm text-slate-400 mb-4">
                <li>📧 designwithmariam@gmail.com</li>
                <li>📞 +91 8807557977</li>
                <li>🌐 muxion.in</li>
                <li>📍 Serving India</li>
              </ul>
              <p className="text-xs text-slate-500 leading-relaxed">
                <strong>Keywords:</strong> UI UX design course, design training India, Figma course online, best UI UX course, affordable design courses, online learning platform, Mariam Parvez design courses
              </p>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-500/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © 2026 MUXION. All rights reserved. | Made with passion by Mariam Parvez
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500">
              <Link to="/privacy" className="hover:text-blue-400 transition">Privacy Policy</Link>
              <span>|</span>
              <Link to="/terms" className="hover:text-blue-400 transition">Terms & Conditions</Link>
              <span>|</span>
              <Link to="/disclaimer" className="hover:text-blue-400 transition">Disclaimer</Link>
              <span>|</span>
              <Link to="/csr-policy" className="hover:text-blue-400 transition">CSR Policy</Link>
              <span>|</span>
              <a href="/sitemap.xml" className="hover:text-blue-400 transition">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Course Selection Modal */}
      <CourseSelectionModal isOpen={showCourseModal} onClose={() => setShowCourseModal(false)} />

      {/* Course Unlock Modal */}
      {selectedCourse && (
        <CourseUnlockModal 
          isOpen={showUnlockModal} 
          onClose={() => setShowUnlockModal(false)}
          course={selectedCourse}
        />
      )}
    </div>
    </>
  );
}