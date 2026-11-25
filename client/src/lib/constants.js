export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const GENDERS = ["Male", "Female", "Other"];

export const URGENCIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

export const REQUEST_STATUSES = ["OPEN", "ACCEPTED", "MATCHED", "COMPLETED", "CANCELLED"];

// Roles supported across the BloodLink frontend.
// DONOR / HOSPITAL / ADMIN are implemented by the backend.
// BLOOD_BANK and CAMP_ORGANIZER are frontend portals (demo sessions) that
// will connect to future backend endpoints.
export const ROLES = [
  { value: "DONOR", label: "Donor", icon: "🧑" },
  { value: "HOSPITAL", label: "Hospital", icon: "🏥" },
  { value: "BLOOD_BANK", label: "Blood Bank", icon: "🏬" },
  { value: "CAMP_ORGANIZER", label: "Camp Organizer", icon: "🎪" },
  { value: "ADMIN", label: "Admin", icon: "🛡️" },
];

export const ROLE_LABEL = {
  DONOR: "Donor",
  HOSPITAL: "Hospital",
  BLOOD_BANK: "Blood Bank",
  CAMP_ORGANIZER: "Camp Organizer",
  ADMIN: "Admin",
};

// Roles that have a working backend registration endpoint.
export const BACKEND_ROLES = ["DONOR", "HOSPITAL", "ADMIN"];

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(value);
}

export function bloodGroupColor(group) {
  if (!group) return "var(--primary)";
  const map = {
    A: "#e23744",
    B: "#2f7de0",
    AB: "#8e44ad",
    O: "#2e9e6b",
  };
  const base = group.replace(/[+-]/g, "");
  return map[base] || "var(--primary)";
}

export function toISODatetime(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function toDateInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}

export function formatDistance(km) {
  if (km === null || km === undefined) return "—";
  return `${Number(km).toFixed(1)} km`;
}
