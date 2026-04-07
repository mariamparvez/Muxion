import { createBrowserRouter } from "react-router";
import { VideoPlayer } from "./pages/VideoPlayer";
import { Homepage } from "./pages/Homepage";
import { Login } from "./pages/Login";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { CourseRedirect } from "./pages/CourseRedirect";
import { UserProfile } from "./pages/UserProfile";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { Disclaimer } from "./pages/Disclaimer";
import { CSRPolicy } from "./pages/CSRPolicy";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Homepage,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/profile",
    Component: UserProfile,
  },
  {
    path: "/course/:courseId",
    Component: CourseRedirect,
  },
  {
    path: "/lesson/:lessonId",
    Component: VideoPlayer,
  },
  {
    path: "/payment/success",
    Component: PaymentSuccess,
  },
  {
    path: "/admin",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
  {
    path: "/privacy",
    Component: PrivacyPolicy,
  },
  {
    path: "/terms",
    Component: TermsAndConditions,
  },
  {
    path: "/disclaimer",
    Component: Disclaimer,
  },
  {
    path: "/csr-policy",
    Component: CSRPolicy,
  },
]);