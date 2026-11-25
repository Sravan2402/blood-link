// Realistic sample data for BloodLink portals whose backend endpoints are not
// yet implemented (blood banks, camps, transfers, coordination, analytics).
// Core features (auth, blood requests, notifications, dashboards) use the live
// API; these mock datasets fill the remaining UI so every portal is explorable.

export const stats = {
  totalDonors: 12480,
  totalHospitals: 642,
  totalBloodBanks: 218,
  totalCamps: 386,
  totalRequests: 9134,
  completedRequests: 6721,
  openRequests: 412,
  totalDonations: 8940,
  totalUnits: 26820,
};

export const donationStats = {
  byBloodGroup: [
    { group: "O+", units: 9820 },
    { group: "A+", units: 6240 },
    { group: "B+", units: 4380 },
    { group: "AB+", units: 2890 },
    { group: "O-", units: 1960 },
    { group: "A-", units: 1120 },
    { group: "B-", units: 720 },
    { group: "AB-", units: 310 },
  ],
  monthly: [
    { month: "Jan", donations: 620, units: 1860 },
    { month: "Feb", donations: 580, units: 1740 },
    { month: "Mar", donations: 740, units: 2220 },
    { month: "Apr", donations: 700, units: 2100 },
    { month: "May", donations: 810, units: 2430 },
    { month: "Jun", donations: 780, units: 2340 },
    { month: "Jul", donations: 920, units: 2760 },
    { month: "Aug", donations: 880, units: 2640 },
    { month: "Sep", donations: 860, units: 2580 },
    { month: "Oct", donations: 940, units: 2820 },
    { month: "Nov", donations: 990, units: 2970 },
    { month: "Dec", donations: 1080, units: 3240 },
  ],
};

export const bloodBanks = [
  {
    id: "bb-001",
    name: "Red Life Blood Bank",
    city: "Hyderabad",
    address: "Road No. 2, Banjara Hills, Hyderabad",
    phone: "+91 98480 12345",
    rating: 4.7,
    unitsAvailable: 1840,
    groups: { "O+": 620, "A+": 380, "B+": 260, "AB+": 140, "O-": 220, "A-": 130, "B-": 70, "AB-": 20 },
    open: true,
  },
  {
    id: "bb-002",
    name: "Sakhi Blood Bank",
    city: "Hyderabad",
    address: "Kondapur, Gachibowli, Hyderabad",
    phone: "+91 90000 23456",
    rating: 4.5,
    unitsAvailable: 1210,
    groups: { "O+": 410, "A+": 300, "B+": 190, "AB+": 110, "O-": 140, "A-": 40, "B-": 20, "AB-": 10 },
    open: true,
  },
  {
    id: "bb-003",
    name: "Jeevadatha Blood Bank",
    city: "Secunderabad",
    address: "MG Road, Secunderabad",
    phone: "+91 97000 34567",
    rating: 4.6,
    unitsAvailable: 980,
    groups: { "O+": 320, "A+": 240, "B+": 150, "AB+": 90, "O-": 110, "A-": 50, "B-": 15, "AB-": 5 },
    open: true,
  },
  {
    id: "bb-004",
    name: "Nivaarana Blood Bank",
    city: "Warangal",
    address: "Park Road, Warangal",
    phone: "+91 96660 45678",
    rating: 4.3,
    unitsAvailable: 640,
    groups: { "O+": 220, "A+": 160, "B+": 110, "AB+": 60, "O-": 70, "A-": 20, "B-": 0, "AB-": 0 },
    open: false,
  },
];

export const hospitals = [
  {
    id: "h-001",
    name: "City Care Hospital",
    city: "Hyderabad",
    address: "Road No. 10, Banjara Hills",
    phone: "+91 98480 11111",
    rating: 4.6,
    registration: "REG-2021-0452",
    unitsAvailable: 240,
    open: true,
  },
  {
    id: "h-002",
    name: "Apollo Heart Institute",
    city: "Hyderabad",
    address: "Jubilee Hills, Gachibowli",
    phone: "+91 90000 22222",
    rating: 4.8,
    registration: "REG-2019-0118",
    unitsAvailable: 180,
    open: true,
  },
  {
    id: "h-003",
    name: "Sunshine Multispeciality",
    city: "Secunderabad",
    address: "MG Road, Secunderabad",
    phone: "+91 97000 33333",
    rating: 4.4,
    registration: "REG-2022-0770",
    unitsAvailable: 130,
    open: true,
  },
  {
    id: "h-004",
    name: "Regional Trauma Centre",
    city: "Warangal",
    address: "Park Road, Warangal",
    phone: "+91 96660 44444",
    rating: 4.2,
    registration: "REG-2020-0331",
    unitsAvailable: 90,
    open: true,
  },
];

export const donors = [
  { id: "d-001", name: "Ravi Kumar", bloodGroup: "O+", city: "Hyderabad", distanceKm: 1.2, eligibility: true, available: true, lastDonation: "2026-09-14", alcohol: false, phone: "+91 99991 00001", email: "ravi@example.com", priorityScore: 114 },
  { id: "d-002", name: "Priya Sharma", bloodGroup: "A+", city: "Hyderabad", distanceKm: 2.8, eligibility: true, available: true, lastDonation: "2026-08-02", alcohol: false, phone: "+91 99991 00002", email: "priya@example.com", priorityScore: 106 },
  { id: "d-003", name: "Mohammed Ali", bloodGroup: "B+", city: "Hyderabad", distanceKm: 4.5, eligibility: true, available: false, lastDonation: "2026-10-20", alcohol: true, phone: "+91 99991 00003", email: "ali@example.com", priorityScore: 67 },
  { id: "d-004", name: "Sneha Reddy", bloodGroup: "O+", city: "Hyderabad", distanceKm: 6.1, eligibility: true, available: true, lastDonation: "2026-06-11", alcohol: false, phone: "+91 99991 00004", email: "sneha@example.com", priorityScore: 95 },
  { id: "d-005", name: "David George", bloodGroup: "AB+", city: "Hyderabad", distanceKm: 8.9, eligibility: false, available: true, lastDonation: "2026-11-01", alcohol: false, phone: "+91 99991 00005", email: "david@example.com", priorityScore: 55 },
  { id: "d-006", name: "Anjali Verma", bloodGroup: "A+", city: "Hyderabad", distanceKm: 12.4, eligibility: true, available: true, lastDonation: "2026-05-30", alcohol: false, phone: "+91 99991 00006", email: "anjali@example.com", priorityScore: 90 },
];

export const bloodCamps = [
  { id: "c-001", title: "Community Blood Donation Camp", organizer: "Red Life Blood Bank", city: "Hyderabad", location: "KBR Park, Banjara Hills", date: "2026-12-05", time: "09:00 - 17:00", capacity: 200, registered: 142, status: "upcoming", poster: "🩸" },
  { id: "c-002", title: "Corporate Donation Drive", organizer: "Sakhi Blood Bank", city: "Hyderabad", location: "HITEC City, Gachibowli", date: "2026-12-12", time: "10:00 - 16:00", capacity: 150, registered: 88, status: "upcoming", poster: "💼" },
  { id: "c-003", title: "College Blood Camp", organizer: "Jeevadatha Blood Bank", city: "Secunderabad", location: "Osmania University Campus", date: "2026-11-30", time: "09:00 - 15:00", capacity: 180, registered: 180, status: "ongoing", poster: "🎓" },
  { id: "c-004", title: "Winter Blood Donation Camp", organizer: "Nivaarana Blood Bank", city: "Warangal", location: "Park Road, Warangal", date: "2026-10-18", time: "09:00 - 16:00", capacity: 120, registered: 120, status: "completed", poster: "❄️" },
  { id: "c-005", title: "Rural Blood Awareness Camp", organizer: "Red Life Blood Bank", city: "Warangal", location: "Village Conference Hall", date: "2026-12-20", time: "09:00 - 14:00", capacity: 100, registered: 34, status: "upcoming", poster: "🌾" },
];

export const campDonations = [
  { id: "cd-001", campId: "c-004", donorName: "Ramesh", bloodGroup: "O+", units: 1, donatedAt: "2026-10-18T10:15:00Z" },
  { id: "cd-002", campId: "c-004", donorName: "Sita", bloodGroup: "A+", units: 1, donatedAt: "2026-10-18T11:02:00Z" },
  { id: "cd-003", campId: "c-004", donorName: "Gopal", bloodGroup: "B+", units: 1, donatedAt: "2026-10-18T12:40:00Z" },
  { id: "cd-004", campId: "c-004", donorName: "Meena", bloodGroup: "O+", units: 1, donatedAt: "2026-10-18T13:25:00Z" },
];

export const transfers = [
  { id: "t-001", from: "Red Life Blood Bank", to: "City Care Hospital", group: "O+", component: "Whole Blood", units: 3, status: "DISPATCHED", createdAt: "2026-11-20T08:30:00Z", priority: "HIGH" },
  { id: "t-002", from: "Sakhi Blood Bank", to: "Apollo Heart Institute", group: "A+", component: "Packed Cells", units: 2, status: "APPROVED", createdAt: "2026-11-22T09:15:00Z", priority: "MEDIUM" },
  { id: "t-003", from: "Jeevadatha Blood Bank", to: "Sunshine Multispeciality", group: "B+", component: "Platelets", units: 1, status: "RECEIVED", createdAt: "2026-11-18T14:00:00Z", priority: "CRITICAL" },
  { id: "t-004", from: "Nivaarana Blood Bank", to: "Regional Trauma Centre", group: "AB+", component: "Whole Blood", units: 2, status: "PENDING", createdAt: "2026-11-24T07:45:00Z", priority: "HIGH" },
];

export const coordinationMessages = [
  { id: "m-001", from: "City Care Hospital", to: "Apollo Heart Institute", text: "We have 2 units of O+ available, can you cover a CRITICAL request?", at: "2026-11-24T06:10:00Z", unread: true },
  { id: "m-002", from: "Apollo Heart Institute", to: "City Care Hospital", text: "Yes, we can send 1 unit immediately.", at: "2026-11-24T06:25:00Z", unread: false },
  { id: "m-003", from: "Sunshine Multispeciality", to: "City Care Hospital", text: "Requesting 1 unit of A+ for an emergency surgery.", at: "2026-11-23T15:40:00Z", unread: true },
];

export const inventoryMovements = [
  { id: "inv-001", type: "collected", group: "O+", units: 5, at: "2026-11-20T09:00:00Z", note: "Camp collection" },
  { id: "inv-002", type: "issued", group: "A+", units: 2, at: "2026-11-21T11:30:00Z", note: "Issued to City Care Hospital" },
  { id: "inv-003", type: "collected", group: "B+", units: 3, at: "2026-11-22T10:15:00Z", note: "Walk-in donor" },
  { id: "inv-004", type: "expired", group: "AB-", units: 1, at: "2026-11-23T08:00:00Z", note: "Expired stock discarded" },
];

export const aiPredictions = [
  { city: "Hyderabad", group: "O+", predictedDemand: 1420, confidence: 92, shortage: true },
  { city: "Hyderabad", group: "A+", predictedDemand: 880, confidence: 88, shortage: false },
  { city: "Secunderabad", group: "O+", predictedDemand: 640, confidence: 85, shortage: false },
  { city: "Warangal", group: "B+", predictedDemand: 410, confidence: 79, shortage: true },
  { city: "Warangal", group: "O-", predictedDemand: 180, confidence: 81, shortage: true },
];

export const donorRanking = [
  { name: "Ravi Kumar", donations: 14, units: 14, score: 98 },
  { name: "Sneha Reddy", donations: 12, units: 13, score: 92 },
  { name: "Anjali Verma", donations: 11, units: 11, score: 88 },
  { name: "Priya Sharma", donations: 9, units: 10, score: 81 },
  { name: "David George", donations: 8, units: 8, score: 74 },
];

export const testimonials = [
  { name: "Dr. Anita Rao", role: "Chief Transfusion Officer", text: "BloodLink cut our donor search time dramatically during an emergency. The matching and notification flow is exactly what hospitals need.", avatar: "👩‍⚕️" },
  { name: "Kiran Reddy", role: "Repeat Donor", text: "I get notified about requests near me and can respond in seconds. It feels rewarding to know my donations actually reach someone in need.", avatar: "🧑" },
  { name: "Shankar, Camp Organizer", role: "Volunteer Coordinator", text: "Managing camp registrations and recording donations on BloodLink is effortless. Our last camp collected 200 units with zero paperwork hassle.", avatar: "🧔" },
];

export const faqs = [
  { q: "How does BloodLink find donors near a hospital?", a: "When a hospital creates a request, BloodLink matches eligible, available donors with a compatible blood group in the hospital's city using stored coordinates and the Haversine distance formula, expanding the search radius progressively if needed." },
  { q: "Do I need to share my live location?", a: "No. BloodLink uses the location you stored in your donor profile. It does not track you continuously in the background." },
  { q: "How is a donor's priority decided?", a: "Donors are ranked by a priority score that considers distance to the hospital, recent donation history, recent alcohol consumption, eligibility, and availability." },
  { q: "Who can use BloodLink?", a: "Donors, hospitals, blood banks, camp organizers, and administrators each get a role-based portal tailored to their responsibilities." },
  { q: "Is my data secure?", a: "Authentication uses JWT with a four-hour expiry and passwords are hashed with bcrypt. Access to features is controlled through role-based authorization." },
  { q: "Can I cancel a blood request?", a: "Yes. A hospital can cancel an open request, and matching donors are notified automatically." },
];

export const testimonialsPage = testimonials;

// Notification preferences categories.
export const notificationTypes = [
  { key: "blood_requests", label: "New blood requests", enabled: true },
  { key: "donor_responses", label: "Donor responses", enabled: true },
  { key: "camp_reminders", label: "Camp reminders", enabled: true },
  { key: "transfers", label: "Blood transfers", enabled: false },
  { key: "coordination", label: "Hospital coordination", enabled: true },
  { key: "system", label: "System updates", enabled: false },
];

export const auditLogs = [
  { id: "a-001", actor: "admin@bloodlink", action: "Verified hospital", target: "Apollo Heart Institute", at: "2026-11-24T08:00:00Z", ip: "10.0.0.12" },
  { id: "a-002", actor: "system", action: "Matched donors", target: "Request #5012", at: "2026-11-24T07:55:00Z", ip: "internal" },
  { id: "a-003", actor: "hospital@citycare", action: "Created blood request", target: "Request #5012", at: "2026-11-24T07:40:00Z", ip: "10.0.0.45" },
  { id: "a-004", actor: "donor@ravi", action: "Responded to request", target: "Request #5012", at: "2026-11-24T07:50:00Z", ip: "10.0.0.88" },
  { id: "a-005", actor: "admin@bloodlink", action: "Suspended user", target: "spam@account", at: "2026-11-23T18:20:00Z", ip: "10.0.0.12" },
];

export const fraudReports = [
  { id: "f-001", reportedBy: "City Care Hospital", reason: "Duplicate donor account", status: "REVIEWING", at: "2026-11-23T10:00:00Z" },
  { id: "f-002", reportedBy: "System", reason: "Suspicious rapid requests", status: "RESOLVED", at: "2026-11-22T09:30:00Z" },
];

export const notifications = [
  { notification_id: "n-1", title: "New Blood Request", message: "An O+ request has been created at City Care Hospital.", is_read: false, created_at: new Date(Date.now() - 10 * 60000).toISOString(), type: "BLOOD_REQUEST" },
  { notification_id: "n-2", title: "Donor Response", message: "A donor responded to your A+ blood request.", is_read: false, created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), type: "DONOR_RESPONSE" },
  { notification_id: "n-3", title: "Donor Selected", message: "You selected a donor for the B+ request.", is_read: true, created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), type: "DONOR_SELECTED" },
  { notification_id: "n-4", title: "Blood Donation Completed", message: "The O+ blood request has been completed.", is_read: true, created_at: new Date(Date.now() - 2 * 86400000).toISOString(), type: "DONATION_COMPLETED" },
  { notification_id: "n-5", title: "Camp Reminder", message: "Community Blood Donation Camp is on Dec 5.", is_read: true, created_at: new Date(Date.now() - 3 * 86400000).toISOString(), type: "CAMP" },
];
