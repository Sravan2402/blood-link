/* =========================================================
   BloodLink — Mobile Mock Data
   Sample data from the prototype spec. Swap for real API calls in production.
   ========================================================= */

// Donor dashboard
export const donorDashboard = {
  greeting: "Hi, Arjun",
  location: "Hyderabad",
  bloodGroup: "O+",
  availability: "Available",
  lastDonation: "12 Jun 2026",
  stats: [
    { value: "6", label: "Donations" },
    { value: "18", label: "Lives helped" },
    { value: "2", label: "Open for you" },
  ],
  openRequests: [
    {
      id: "r1",
      hospital: "Care Hospital",
      bloodGroup: "O+",
      units: 2,
      urgency: "Urgent",
      distance: "3.2 km",
    },
    {
      id: "r2",
      hospital: "Yashoda Medical",
      bloodGroup: "O−",
      units: 1,
      urgency: "Normal",
      distance: "7.8 km",
    },
  ],
};

// Login role chips
export const loginRoles = [
  { value: "DONOR", label: "Donor" },
  { value: "HOSPITAL", label: "Hospital" },
  { value: "BLOOD_BANK", label: "Blood Bank" },
];

// Create request
export const createRequestData = {
  hospitalName: "Care Hospital",
};

// Request tracking
export const requestTracking = {
  id: "1042",
  bloodGroup: "A+",
  units: 2,
  status: "ACCEPTED",
  step: 1, // 0=OPEN, 1=ACCEPTED, 2=COMPLETED
  requiredBy: "Today, 6:00 PM",
  responses: 3,
  donorResponses: [
    {
      id: "dr1",
      name: "Sandeep",
      bloodGroup: "A+",
      status: "Accepted",
      distance: "1.4 km",
      avatar: "primary",
    },
    {
      id: "dr2",
      name: "Meera",
      bloodGroup: "A+",
      status: "Pending",
      distance: "2.1 km",
      avatar: "green",
    },
  ],
};

// Nearby donors
export const nearbyDonors = {
  requestId: "1042",
  bloodGroup: "A+",
  radius: "5 km",
  pins: [
    { x: "30%", y: "40%", color: "ink" },
    { x: "55%", y: "35%", color: "red" },
    { x: "65%", y: "60%", color: "red" },
    { x: "40%", y: "70%", color: "red" },
  ],
  donors: [
    { id: "d1", name: "Sandeep", bloodGroup: "A+", distance: "1.4 km", score: 92 },
    { id: "d2", name: "Ramesh", bloodGroup: "A+", distance: "2.8 km", score: 85 },
    { id: "d3", name: "Kavya", bloodGroup: "A+", distance: "3.6 km", score: 78 },
  ],
};

// Donor open requests
export const donorRequests = {
  bloodGroup: "O+",
  requests: [
    {
      id: "r1",
      hospital: "Care Hospital",
      bloodGroup: "O+",
      urgency: "Urgent",
      units: 2,
      distance: "3.2 km",
      requiredBy: "Today, 6:00 PM",
    },
    {
      id: "r2",
      hospital: "Yashoda Medical",
      bloodGroup: "O−",
      urgency: "Normal",
      units: 1,
      distance: "7.8 km",
      requiredBy: "Tomorrow",
    },
  ],
};

// Donation camps
export const donationCamps = {
  location: "Near Hyderabad",
  pins: [
    { x: "25%", y: "35%", color: "green" },
    { x: "50%", y: "55%", color: "green" },
    { x: "75%", y: "40%", color: "green" },
  ],
  camps: [
    { id: "c1", name: "Red Cross Camp", status: "Open", date: "Sat, 28 Jun", time: "9:00 AM", place: "Mahatma Gandhi Hall" },
    { id: "c2", name: "City Care Drive", status: "Open", date: "Sun, 29 Jun", time: "10:00 AM", place: "Nagole Community Center" },
    { id: "c3", name: "Apollo Blood Drive", status: "Full", date: "Mon, 30 Jun", time: "8:30 AM", place: "Apollo Hospital" },
  ],
};

// Camp registration
export const campRegistration = {
  name: "Red Cross Camp",
  address: "Mahatma Gandhi Hall, Hyderabad",
  pins: [{ x: "50%", y: "50%", color: "red" }],
  details: [
    { label: "Date", value: "Sat, 28 Jun 2026" },
    { label: "Time", value: "9:00 AM – 4:00 PM" },
    { label: "Organizer", value: "Red Cross Society" },
    { label: "Seats left", value: "24" },
    { label: "Needs", value: "O+, A+, B+" },
  ],
  note: "A reminder is sent before the event. Medical staff decide your donation eligibility.",
};

// Notifications
export const notifications = {
  unread: 2,
  items: [
    { id: "n1", title: "New blood request", text: "Care Hospital needs 2 units of O+ blood near you.", time: "10 min ago", unread: true },
    { id: "n2", title: "Donor selected", text: "Your response to request #1042 was accepted.", time: "2 hours ago", unread: true },
    { id: "n3", title: "Camp reminder", text: "Red Cross Camp starts tomorrow at 9:00 AM.", time: "1 day ago", unread: false },
  ],
};

// Map & location
export const mapLocation = {
  radius: "10 km",
  pins: [
    { x: "50%", y: "50%", color: "ink" },
    { x: "30%", y: "35%", color: "red" },
    { x: "65%", y: "40%", color: "red" },
    { x: "70%", y: "65%", color: "green" },
    { x: "35%", y: "70%", color: "purple" },
  ],
  counts: { donors: 2, camps: 1, hospitals: 1 },
};

// Blood bank inventory
export const bloodBankInventory = {
  bankName: "Red Life Blood Bank",
  lowStock: "O− (4 units)",
  inventory: [
    { group: "A+", units: 24 },
    { group: "A−", units: 12 },
    { group: "B+", units: 18 },
    { group: "B−", units: 8 },
    { group: "AB+", units: 6 },
    { group: "AB−", units: 4 },
    { group: "O+", units: 30 },
    { group: "O−", units: 4 },
  ],
  expiring: [
    "B+ · 6 units · expires in 5 days",
    "A− · 3 units · expires in 8 days",
  ],
};

// Hospital coordination
export const hospitalCoordination = {
  bloodGroup: "O+",
  hospitals: [
    { id: "h1", name: "Yashoda Medical", units: 8, distance: "5.4 km", verified: true },
    { id: "h2", name: "Apollo Heart Institute", units: 12, distance: "8.1 km", verified: true },
  ],
  transfer: { id: "208", bloodGroup: "O+", units: 2, status: "In transit" },
};

// AI insights
export const aiInsights = {
  demand: [
    { label: "Mon", value: 8 },
    { label: "Tue", value: 12 },
    { label: "Wed", value: 6 },
    { label: "Thu", value: 14 },
    { label: "Fri", value: 18 },
    { label: "Sat", value: 22 },
    { label: "Sun", value: 10 },
  ],
  shortage: "Possible shortage of O− in Hyderabad within 7 days.",
  suggestion: "Consider expanding the search radius to 15 km for O− requests.",
  assistantQuestion: "Which blood group will face shortage next week?",
};

// Admin verification
export const adminVerification = {
  stats: [
    { value: "240", label: "Donors" },
    { value: "18", label: "Hospitals" },
    { value: "6", label: "Banks" },
  ],
  facilities: [
    { id: "f1", name: "Apollo Heart Institute", status: "Pending", info: "Reg. #H-2024-118" },
    { id: "f2", name: "City Care Hospital", status: "Pending", info: "Reg. #H-2024-203" },
  ],
  reported: { description: "Request #1048 reported for duplicate posting.", count: 1 },
};

// Analytics
export const analytics = {
  stats: [
    { value: "56", label: "Requests" },
    { value: "42", label: "Completed" },
    { value: "75%", label: "Response" },
  ],
  byStatus: [
    { label: "Open", value: 12, color: "var(--green)" },
    { label: "Done", value: 42, color: "var(--primary)" },
    { label: "Cancel", value: 8, color: "var(--purple)" },
    { label: "Expired", value: 6, color: "var(--grey-bar)" },
  ],
  demandByGroup: [
    { label: "O+", value: 9820 },
    { label: "A+", value: 6240 },
    { label: "B+", value: 4380 },
    { label: "O−", value: 1960 },
  ],
  extra: [
    { label: "Avg completion", value: "4.2 hours" },
    { label: "Camps held", value: "12" },
  ],
};

// Settings
export const settings = {
  toggles: [
    { key: "availability", label: "Show me as available", on: true },
    { key: "location", label: "Share location only when needed", on: true },
    { key: "sms", label: "SMS alerts", on: false },
    { key: "push", label: "Push notifications", on: true },
  ],
  links: [
    { key: "password", label: "Change password" },
    { key: "email", label: "Verify email" },
    { key: "data", label: "Download my data" },
    { key: "delete", label: "Delete account" },
  ],
};

// Donation history
export const donationHistory = {
  count: "6 completed",
  donations: [
    { id: "dh1", place: "Care Hospital", status: "Done", date: "12 Jun 2026", units: 1, group: "O+" },
    { id: "dh2", place: "Red Cross Camp", status: "Done", date: "02 May 2026", units: 1, group: "O+" },
    { id: "dh3", place: "Yashoda Medical", status: "Done", date: "10 Apr 2026", units: 1, group: "O+" },
  ],
  note: "Next eligible date is confirmed by medical staff.",
};

// Organizer attendance
export const organizerAttendance = {
  campName: "Red Cross Camp",
  stats: [
    { value: "30", label: "Registered" },
    { value: "6", label: "Seats left" },
    { value: "24", label: "Donated" },
  ],
  attendees: [
    { id: "a1", name: "Sandeep", bloodGroup: "O+", status: "Attended", avatar: "primary" },
    { id: "a2", name: "Meera", bloodGroup: "A+", status: "Registered", avatar: "green" },
    { id: "a3", name: "Ramesh", bloodGroup: "B+", status: "Attended", avatar: "purple" },
  ],
};
