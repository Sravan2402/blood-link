import { useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastProvider, useToast } from "./contexts/ToastContext";
import { navigate, useRoute } from "./router/useRoute";
import PublicLayout from "./components/PublicLayout";
import PortalLayout from "./components/PortalLayout";
import { Spinner } from "./components/ui";
import MobileApp from "./pages/mobile/MobileApp";

// ---- Auth pages ----
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import OTP from "./pages/auth/OTP";
import EmailVerification from "./pages/auth/EmailVerification";
import Unauthorized from "./pages/auth/Unauthorized";
import VerificationStatus from "./pages/auth/VerificationStatus";

// ---- Public pages ----
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import HowItWorks from "./pages/public/HowItWorks";
import Awareness from "./pages/public/Awareness";
import Stats from "./pages/public/Stats";
import BloodCamps from "./pages/public/BloodCamps";
import Emergency from "./pages/public/Emergency";
import Hospitals from "./pages/public/Hospitals";
import BloodBanks from "./pages/public/BloodBanks";
import Testimonials from "./pages/public/Testimonials";
import FAQ from "./pages/public/FAQ";
import Contact from "./pages/public/Contact";
import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";
import FindBlood from "./pages/public/FindBlood";

// ---- Common ----
import Notifications from "./pages/common/Notifications";
import Profile from "./pages/Profile";
import DonationHistory from "./pages/DonationHistory";
import RequestDetail from "./pages/RequestDetail";

// ---- Donor portal ----
import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorFindBlood from "./pages/donor/FindBlood";
import DonorMyResponses from "./pages/donor/MyResponses";
import DonorBloodCamps from "./pages/donor/BloodCamps";

// ---- Hospital portal ----
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import HospitalMyRequests from "./pages/hospital/MyRequests";
import CreateRequest from "./pages/hospital/CreateRequest";
import HospitalFindDonors from "./pages/hospital/FindDonors";
import DonorResponses from "./pages/hospital/DonorResponses";
import HospitalNetwork from "./pages/hospital/HospitalNetwork";
import BloodTransfers from "./pages/hospital/BloodTransfers";
import HospitalInventory from "./pages/hospital/Inventory";
import HospitalCamps from "./pages/hospital/HospitalCamps";

// ---- Blood Bank portal ----
import BloodBankDashboard from "./pages/bloodbank/BloodBankDashboard";
import BloodBankInventory from "./pages/bloodbank/BloodBankInventory";
import BloodCollection from "./pages/bloodbank/BloodCollection";
import BloodIssues from "./pages/bloodbank/BloodIssues";
import BloodBankReports from "./pages/bloodbank/BloodBankReports";

// ---- Camp Organizer portal ----
import CampDashboard from "./pages/camp/CampDashboard";
import CreateCamp from "./pages/camp/CreateCamp";
import ManageCamps from "./pages/camp/ManageCamps";
import Registrations from "./pages/camp/Registrations";
import Attendance from "./pages/camp/Attendance";
import DonationRecords from "./pages/camp/DonationRecords";
import CampReports from "./pages/camp/CampReports";

// ---- Admin portal ----
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/Users";
import AdminDonors from "./pages/admin/Donors";
import AdminHospitals from "./pages/admin/Hospitals";
import AdminBloodBanks from "./pages/admin/BloodBanks";
import AdminRequests from "./pages/admin/Requests";
import AdminCamps from "./pages/admin/Camps";
import AdminTransfers from "./pages/admin/Transfers";
import AdminVerifications from "./pages/admin/Verifications";
import AdminReports from "./pages/admin/Reports";
import AdminAuditLogs from "./pages/admin/AuditLogs";
import AdminSettings from "./pages/admin/Settings";
import AdminPredictions from "./pages/admin/Predictions";
import AdminAnalytics from "./pages/admin/Analytics";

const PUBLIC_ROUTES = {
  "/": Home,
  "/about": About,
  "/how-it-works": HowItWorks,
  "/awareness": Awareness,
  "/stats": Stats,
  "/blood-camps": BloodCamps,
  "/emergency": Emergency,
  "/hospitals": Hospitals,
  "/blood-banks": BloodBanks,
  "/testimonials": Testimonials,
  "/faq": FAQ,
  "/contact": Contact,
  "/privacy": Privacy,
  "/terms": Terms,
  "/find-blood": FindBlood,
};

function Dashboard({ role }) {
  if (role === "DONOR") return <DonorDashboard />;
  if (role === "HOSPITAL") return <HospitalDashboard />;
  if (role === "BLOOD_BANK") return <BloodBankDashboard />;
  if (role === "CAMP_ORGANIZER") return <CampDashboard />;
  if (role === "ADMIN") return <AdminDashboard />;
  return <Home />;
}

// Maps portal routes to components per role.
function PortalPage({ role, segments }) {
  const [first, second] = segments;

  // Common routes available to all roles.
  if (first === "notifications") return <Notifications />;
  if (first === "profile") return <Profile />;

  if (role === "DONOR") {
    if (!first || first === "dashboard") return <DonorDashboard />;
    if (first === "find-blood") return <DonorFindBlood />;
    if (first === "my-responses") return <DonorMyResponses />;
    if (first === "my-donations" || first === "donation-history") return <DonationHistory />;
    if (first === "blood-camps") return <DonorBloodCamps />;
    if (first === "requests" && second) return <RequestDetail requestId={second} />;
    return <DonorDashboard />;
  }

  if (role === "HOSPITAL") {
    if (!first || first === "dashboard") return <HospitalDashboard />;
    if (first === "create-request") return <CreateRequest />;
    if (first === "my-requests") return <HospitalMyRequests />;
    if (first === "find-donors") return <HospitalFindDonors />;
    if (first === "donor-responses") return <DonorResponses />;
    if (first === "hospital-network") return <HospitalNetwork />;
    if (first === "blood-transfers") return <BloodTransfers />;
    if (first === "inventory") return <HospitalInventory />;
    if (first === "blood-camps") return <HospitalCamps />;
    if (first === "donation-history") return <DonationHistory />;
    if (first === "requests" && second) return <RequestDetail requestId={second} />;
    return <HospitalDashboard />;
  }

  if (role === "BLOOD_BANK") {
    if (!first || first === "dashboard") return <BloodBankDashboard />;
    if (first === "inventory") return <BloodBankInventory />;
    if (first === "blood-collection") return <BloodCollection />;
    if (first === "blood-issues") return <BloodIssues />;
    if (first === "blood-transfers") return <BloodTransfers />;
    if (first === "reports") return <BloodBankReports />;
    return <BloodBankDashboard />;
  }

  if (role === "CAMP_ORGANIZER") {
    if (!first || first === "dashboard") return <CampDashboard />;
    if (first === "create-camp") return <CreateCamp />;
    if (first === "manage-camps") return <ManageCamps />;
    if (first === "registrations") return <Registrations />;
    if (first === "attendance") return <Attendance />;
    if (first === "donation-records") return <DonationRecords />;
    if (first === "reports") return <CampReports />;
    return <CampDashboard />;
  }

  if (role === "ADMIN") {
    if (!first || first === "dashboard") return <AdminDashboard />;
    if (first === "users") return <AdminUsers />;
    if (first === "donors") return <AdminDonors />;
    if (first === "hospitals") return <AdminHospitals />;
    if (first === "blood-banks") return <AdminBloodBanks />;
    if (first === "requests") return <AdminRequests />;
    if (first === "camps") return <AdminCamps />;
    if (first === "transfers") return <AdminTransfers />;
    if (first === "verifications") return <AdminVerifications />;
    if (first === "reports") return <AdminReports />;
    if (first === "audit-logs") return <AdminAuditLogs />;
    if (first === "settings") return <AdminSettings />;
    if (first === "predictions") return <AdminPredictions />;
    if (first === "analytics") return <AdminAnalytics />;
    return <AdminDashboard />;
  }

  return <Dashboard role={role} />;
}

function Router() {
  const { isAuthenticated, loading, logout, role } = useAuth();
  const { notify } = useToast();
  const route = useRoute();
  const [first] = route.segments;

  // React to globally expired tokens.
  useEffect(() => {
    const onUnauthorized = () => {
      logout();
      notify("Your session has expired. Please sign in again.", "error");
      navigate("/login");
    };
    window.addEventListener("bloodlink:unauthorized", onUnauthorized);
    return () => window.removeEventListener("bloodlink:unauthorized", onUnauthorized);
  }, [logout, notify]);

  const isAuthRoute = ["login", "register", "forgot-password", "reset-password", "otp", "verify-email", "unauthorized", "verification-status"].includes(first);
  const isPortalRoute = first === "app";

  const isMobileRoute = first === "m";

  // Redirect effects — must run unconditionally before any early return.
  useEffect(() => {
    if (isAuthenticated && !isPortalRoute && !isMobileRoute) {
      navigate("/app/dashboard");
    }
  }, [isAuthenticated, isPortalRoute, isMobileRoute, first]);

  // The app starts at the login page: unauthenticated visitors on the root
  // path are sent to /login instead of the public home page.
  useEffect(() => {
    if (!isAuthenticated && route.path === "/") {
      navigate("/login");
    }
  }, [isAuthenticated, route.path]);

  // Wait for the initial profile fetch before deciding where to send the user.
  if (loading) {
    return (
      <div className="app-loading">
        <Spinner label="Loading BloodLink…" />
      </div>
    );
  }

  // Mobile prototype screens (/m/* routes) — rendered full-screen, no shell.
  if (first === "m") {
    return <MobileApp />;
  }

  // Auth pages (no layout shell).
  if (!isAuthenticated && isAuthRoute) {
    if (first === "login") return <Login />;
    if (first === "register") return <Register />;
    if (first === "forgot-password") return <ForgotPassword />;
    if (first === "reset-password") return <ResetPassword />;
    if (first === "otp") return <OTP />;
    if (first === "verify-email") return <EmailVerification />;
    if (first === "unauthorized") return <Unauthorized />;
    if (first === "verification-status") return <VerificationStatus />;
  }

  // Authenticated user hitting login/register → redirect effect handles it.
  if (isAuthenticated && (first === "login" || first === "register")) {
    return (
      <div className="app-loading">
        <Spinner label="Redirecting…" />
      </div>
    );
  }

  // Public website.
  if (!isAuthenticated) {
    const Page = PUBLIC_ROUTES[route.path] || Home;
    return <PublicLayout>{<Page />}</PublicLayout>;
  }

  // Portal (authenticated).
  if (isPortalRoute) {
    return (
      <PortalLayout>
        <PortalPage role={role} segments={route.segments.slice(1)} />
      </PortalLayout>
    );
  }

  // Authenticated user hitting a bare public path → redirect effect is handling it.
  return (
    <div className="app-loading">
      <Spinner label="Redirecting to your portal…" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </AuthProvider>
  );
}
