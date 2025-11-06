import { useContext, Suspense, lazy, memo } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AppContext } from "./context/AppContext";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";

import usePreloadRoutes from "./hooks/usePreloadRoutes";
import usePerformanceMonitor from "./hooks/usePerformanceMonitor";
import RouteBasedSkeleton from "./components/RouteSkeletons";
import ChatBot from "./components/ChatBot";

// Instant loaded components with aggressive caching
import { createInstantLoader } from "./utils/instantLoader";

const HomePage = lazy(createInstantLoader(() => import("./pages/HomePage")));
const StudentSignup = lazy(createInstantLoader(() => import("./components/Student/StudentSignup")));
const StudentLogin = lazy(createInstantLoader(() => import("./components/Student/StudentLogin")));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const InstitutesOnLocation = lazy(() => import("./pages/InstitutesOnLocation"));
const InstituteLogin = lazy(() => import("./components/Institute/InstituteLogin"));
const InstituteSignup = lazy(() => import("./components/Institute/InstituteSignup"));
const InstituteDashboard = lazy(() => import("./pages/InstituteDashBoard"));
const LoginPopup = lazy(() => import("./pages/LoginPopup"));
const SignupPopup = lazy(() => import("./pages/SignupPopup"));
const EmailVerificationPage = lazy(() => import("./pages/EmailVerificationPage"));
const BasicInfoPage = lazy(() => import("./pages/InstituteRegistration/BasicInfoPage"));
const ContactPage = lazy(() => import("./pages/InstituteRegistration/ContactPage"));
const CoursesPage = lazy(() => import("./pages/InstituteRegistration/CoursesPage"));
const FacilitiesPage = lazy(() => import("./pages/InstituteRegistration/FacilitiesPage"));
const FacultiesPage = lazy(() => import("./pages/InstituteRegistration/FacultiesPage"));
const StudentAchievementsPage = lazy(() => import("./pages/InstituteRegistration/StudentAchievementsPage"));
const InstituteAchievementsPage = lazy(() => import("./pages/InstituteRegistration/InstituteAchievementsPage"));
const MediaGalleryPage = lazy(() => import("./pages/InstituteRegistration/MediaGalleryPage"));
const SocialMediaPage = lazy(() => import("./pages/InstituteRegistration/SocialMediaPage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const ReviewPage = lazy(() => import("./pages/ReviewPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const InstituteOverviewPage = lazy(() => import("./pages/InstituteOverviewPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const InstitutesList = lazy(() => import("./components/InstitutesList "));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const InstituteComparePage = lazy(() => import("./pages/InstituteComparePage"));
const CompareResultPage = lazy(() => import("./pages/CompareResultPage"));
const InstituteTeacher = lazy(() => import("./components/Institute/Dashboard/InstituteTeacher"));
const EditTeacher = lazy(() => import("./components/Institute/Dashboard/EditTeacher"));
const AddTeacher = lazy(() => import("./components/Institute/Dashboard/AddTeacher"));
const InstituteBatch = lazy(() => import("./components/Institute/Dashboard/InstituteBatch"));
const AddBatch = lazy(() => import("./components/Institute/Dashboard/AddBatch"));
const EditBatch = lazy(() => import("./components/Institute/Dashboard/EditBatch"));
const AddMedia = lazy(() => import("./components/Institute/Dashboard/AddMedia"));
const EditMedia = lazy(() => import("./components/Institute/Dashboard/EditMedia"));
const InstituteMedia = lazy(() => import("./components/Institute/Dashboard/InstituteMedia"));
const EditFacilities = lazy(() => import("./components/Institute/Dashboard/EditFacilities"));
const EditAchievements = lazy(() => import("./components/Institute/Dashboard/EditAchievements"));
const StudentFeedbackDashboard = lazy(() => import("./pages/StudentFeedbackDashboard"));
const SupportPage = lazy(() => import("./pages/SupportPage"));
const ViewTeacher = lazy(() => import("./components/Institute/Dashboard/ViewTeacher"));
const ViewBatch = lazy(() => import("./components/Institute/Dashboard/ViewBatch"));
const ForgotPasswordPopup = lazy(() => import("./pages/ForgotPasswordPopup"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const SocialMedia = lazy(() => import("./components/Institute/Dashboard/SocialMedia"));
const EditSocialMedia = lazy(() => import("./components/Institute/Dashboard/EditSocialMedia"));
const OurTeam = lazy(() => import("./pages/OurTeam"));
const MemberDetails = lazy(() => import("./pages/MemberDetails"));
const QRScanner = lazy(() => import("./pages/QRScanner"));
const CoursesComingSoon = lazy(() => import("./pages/CoursesComingSoon"));
const MentorshipComingSoon = lazy(() => import("./pages/MentorshipComingSoon"));
const MentorDetailPage = lazy(() => import("./pages/MentorDetailPage"));

const App = memo(() => {
  const { showSignup, showLogin } = useContext(AppContext);
  usePreloadRoutes();
  usePerformanceMonitor();

  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<RouteBasedSkeleton />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPasswordPopup />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/signup" element={<StudentSignup />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/edit-profile" element={<StudentDashboard />} />
            <Route
              path="/student/recommendations"
              element={<StudentDashboard />}
            />
            <Route
              path="/student/saved-institutes"
              element={<StudentDashboard />}
            />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/institutes-data" element={<InstitutesList />} />
            <Route path="/institute-compare" element={<InstituteComparePage />} />
            <Route path="/compare-result" element={<CompareResultPage />} />
            <Route
              path="/student-feedback-dashboard"
              element={<StudentFeedbackDashboard />}
            />
            <Route path="/support" element={<SupportPage />} />
            <Route
              path="/institutes-on-location"
              element={<InstitutesOnLocation />}
            />
            <Route path="/institute/login" element={<InstituteLogin />} />
            <Route path="/institute/signup" element={<InstituteSignup />} />
            <Route path="/institute/dashboard" element={<InstituteDashboard />} />
            
            <Route path="/institute/basic-info" element={<BasicInfoPage />} />
            <Route path="/institute/contact" element={<ContactPage />} />
            <Route path="/institute/courses" element={<CoursesPage />} />
            <Route path="/institute/faculties" element={<FacultiesPage />} />
            <Route
              path="/institute/student-achievements"
              element={<StudentAchievementsPage />}
            />
            <Route
              path="/institute/institute-achievements"
              element={<InstituteAchievementsPage />}
            />
            <Route path="/institute/facilities" element={<FacilitiesPage />} />
            <Route path="/institute/media" element={<MediaGalleryPage />} />
            <Route path="/institute/social" element={<SocialMediaPage />} />
            <Route
              path="/institute/overview/:id"
              element={<InstituteOverviewPage />}
            />
            <Route
              path="/institute/overview"
              element={<InstituteOverviewPage />}
            />
            <Route path="/verify" element={<EmailVerificationPage />} />
            
            <Route path="/institute/teachers" element={<InstituteTeacher />} />
            <Route path="/institute/edit-teacher/:id" element={<EditTeacher />} />
            <Route path="/institute/view-teacher/:id" element={<ViewTeacher />} />
            <Route path="/institute/facultiesdetails" element={<AddTeacher />} />
            <Route path="/institute/batches" element={<InstituteBatch />} />
            <Route path="/institute/add-batch" element={<AddBatch />} />
            <Route path="/institute/edit-batch/:id" element={<EditBatch />} />
            <Route path="/institute/view-batch/:id" element={<ViewBatch />} />
            <Route
              path="/institute/photos-and-videos"
              element={<InstituteMedia />}
            />
            <Route path="/institute/add-media" element={<AddMedia />} />
            <Route
              path="/institute/edit-media/:type/:id"
              element={<EditMedia />}
            />
            <Route
              path="/institute/edit-facilities"
              element={<EditFacilities />}
            />
            <Route
              path="/institute/edit-achievements/:type"
              element={<EditAchievements />}
            />
            <Route path="/institute/social-media" element={<SocialMedia />} />
            <Route path="/institute/edit-social-media" element={<EditSocialMedia />} />

            <Route path="/team" element={<OurTeam />} />
            <Route path="/team/:certificateNo" element={<MemberDetails />} />
            <Route path="/scanner" element={<QRScanner />} />
            <Route path="/services/courses" element={<CoursesComingSoon />} />
            <Route path="/services/mentorship" element={<MentorshipComingSoon />} />
            <Route path="/mentor/:id" element={<MentorDetailPage />} />
          </Routes>
        </Suspense>
        {showLogin && <LoginPopup />}
        {showSignup && <SignupPopup />}
        <ChatBot />
        <Toaster />
      </ErrorBoundary>
    </div>
  );
});

App.displayName = 'App';

export default App;
