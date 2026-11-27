import { useAuth } from "../../contexts/AuthContext";
import { useRoute, navigate } from "../../router/useRoute";

// Screen registry: maps a mobile route to its screen component.
import Screen1DonorDashboard from "./Screen1DonorDashboard";
import Screen2Login from "./Screen2Login";
import Screen3CreateRequest from "./Screen3CreateRequest";
import Screen4RequestTracking from "./Screen4RequestTracking";
import Screen5NearbyDonors from "./Screen5NearbyDonors";
import Screen6DonorRequests from "./Screen6DonorRequests";
import Screen7DonationCamps from "./Screen7DonationCamps";
import Screen8CampRegistration from "./Screen8CampRegistration";
import Screen9Notifications from "./Screen9Notifications";
import Screen10MapLocation from "./Screen10MapLocation";
import Screen11BloodBankInventory from "./Screen11BloodBankInventory";
import Screen12HospitalCoordination from "./Screen12HospitalCoordination";
import Screen13AIInsights from "./Screen13AIInsights";
import Screen14AdminVerification from "./Screen14AdminVerification";
import Screen15Analytics from "./Screen15Analytics";
import Screen16Settings from "./Screen16Settings";
import Screen17DonationHistory from "./Screen17DonationHistory";
import Screen18OrganizerAttendance from "./Screen18OrganizerAttendance";

const SCREENS = {
  "/m/login": Screen2Login,
  "/m/donor/home": Screen1DonorDashboard,
  "/m/donor/settings": Screen16Settings,
  "/m/donor/history": Screen17DonationHistory,
  "/m/donor/requests": Screen6DonorRequests,
  "/m/donor/camps": Screen7DonationCamps,
  "/m/donor/camp-detail": Screen8CampRegistration,
  "/m/donor/alerts": Screen9Notifications,
  "/m/donor/map": Screen10MapLocation,
  "/m/donor/profile": Screen17DonationHistory,
  "/m/donor/forgot": Screen2Login,
  "/m/register": Screen2Login,
  "/m/hospital/home": Screen4RequestTracking,
  "/m/hospital/new": Screen3CreateRequest,
  "/m/hospital/requests": Screen4RequestTracking,
  "/m/hospital/donors": Screen5NearbyDonors,
  "/m/hospital/profile": Screen4RequestTracking,
  "/m/hospital/coordination": Screen12HospitalCoordination,
  "/m/bloodbank/stock": Screen11BloodBankInventory,
  "/m/bloodbank/inquiries": Screen11BloodBankInventory,
  "/m/bloodbank/profile": Screen11BloodBankInventory,
  "/m/ai/insights": Screen13AIInsights,
  "/m/ai/profile": Screen13AIInsights,
  "/m/admin/home": Screen14AdminVerification,
  "/m/admin/verify": Screen14AdminVerification,
  "/m/admin/reports": Screen15Analytics,
  "/m/admin/logs": Screen15Analytics,
  "/m/organizer/camps": Screen18OrganizerAttendance,
  "/m/organizer/attendance": Screen18OrganizerAttendance,
  "/m/organizer/reports": Screen18OrganizerAttendance,
  "/m/organizer/profile": Screen18OrganizerAttendance,
};

// Default route per role after login.
const ROLE_HOME = {
  DONOR: "/m/donor/home",
  HOSPITAL: "/m/hospital/home",
  BLOOD_BANK: "/m/bloodbank/stock",
  CAMP_ORGANIZER: "/m/organizer/camps",
  ADMIN: "/m/admin/home",
};

export default function MobileApp() {
  const { user, isAuthenticated, login } = useAuth();
  const route = useRoute();

  const handleLogin = (role) => {
    // Use the demo fallback so navigation works without credentials/server.
    login("", "", role).then(() => {
      navigate(ROLE_HOME[role] || "/m/donor/home");
    });
  };

  // Not authenticated → always the login screen.
  if (!isAuthenticated) {
    const Login = SCREENS["/m/login"];
    return <Login navigate={navigate} onLogin={handleLogin} />;
  }

  // Authenticated: pick the screen for the current path, or role home.
  const path = SCREENS[route.path] ? route.path : ROLE_HOME[user?.role] || "/m/donor/home";
  const Screen = SCREENS[path];

  return <Screen navigate={navigate} />;
}
