import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import {
  Alert,
  Button,
  Card,
  Field,
  SectionHeader,
  Spinner,
  StatusBadge,
} from "../components/ui";
import { Avatar, ImagePreview, UploadField } from "../components/kit";
import {
  BLOOD_GROUPS,
  GENDERS,
  formatDate,
} from "../lib/constants";

function emptyForm(user, role) {
  const base = {
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    profile_image: user?.profile_image || "",
  };
  if (role === "DONOR") {
    return {
      ...base,
      blood_group: "",
      gender: "",
      dob: "",
      weight: "",
      city: "",
      state: "",
      last_donation_date: "",
      alcohol_consumed_recently: false,
      latitude: "",
      longitude: "",
    };
  }
  if (role === "HOSPITAL") {
    return {
      ...base,
      hospital_name: user?.hospital_name || "",
      registration_number: user?.registration_number || "",
      contact_person: "",
      email: user?.email || "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      latitude: "",
      longitude: "",
    };
  }
  if (role === "BLOOD_BANK") {
    return {
      ...base,
      blood_bank_name: user?.blood_bank_name || "",
      registration_number: user?.registration_number || "",
      contact_person: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    };
  }
  if (role === "CAMP_ORGANIZER") {
    return {
      ...base,
      organization: user?.organization || "",
      contact_person: "",
      city: "",
      state: "",
    };
  }
  return base;
}

export default function Profile() {
  const { user, role, isDemo, refreshProfile, setUser } = useAuth();
  const { notify } = useToast();
  const [form, setForm] = useState(() => emptyForm(user, role));
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.profile_image || null);

  useEffect(() => {
    let active = true;
    if (!user) {
      refreshProfile()
        .then((fresh) => {
          if (active) setForm(emptyForm(fresh, role));
        })
        .catch(() => {})
        .finally(() => {
          if (active) setLoading(false);
        });
    }
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setForm((prev) => ({ ...prev, profile_image: reader.result }));
      notify("Profile picture updated.", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      if (isDemo) {
        // Demo portals keep changes locally.
        setSuccess("Profile updated successfully.");
        notify("Profile updated successfully.", "success");
        setUser({ ...user, ...form });
      } else {
        const payload = { ...form };
        if (role === "DONOR") {
          payload.weight = payload.weight ? Number(payload.weight) : null;
        }
        if (role === "HOSPITAL") {
          payload.latitude = payload.latitude ? Number(payload.latitude) : null;
          payload.longitude = payload.longitude ? Number(payload.longitude) : null;
        }
        await api.put("/auth/profile", payload);
        const fresh = await refreshProfile();
        setUser(fresh);
        setSuccess("Profile updated successfully.");
        notify("Profile updated successfully.", "success");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateLocation = () => {
    if (!navigator.geolocation) {
      notify("Geolocation is not supported.", "error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setForm((prev) => ({ ...prev, latitude, longitude }));
        notify("Location updated.", "success");
      },
      () => notify("Could not access your location.", "error"),
    );
  };

  if (loading && !user) return <Spinner label="Loading profile…" />;

  return (
    <div className="page">
      <SectionHeader title="Profile" subtitle="Manage your account, role details, and location." />

      <div className="profile-layout">
        <div className="profile-side">
          <Card className="profile-card">
            <div className="profile-avatar-wrap">
              <Avatar name={user?.full_name || form.full_name} src={imagePreview} size={72} />
            </div>
            <h3>{form.full_name || user?.full_name}</h3>
            <p>{user?.email}</p>
            {role === "DONOR" && (
              <StatusBadge status={form.blood_group ? "OPEN" : "CANCELLED"} />
            )}
            <dl className="profile-facts">
              <div>
                <dt>Role</dt>
                <dd>{user?.role}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{form.phone || user?.phone || "—"}</dd>
              </div>
              <div>
                <dt>Verified</dt>
                <dd>{user?.is_verified ? "Yes" : "No"}</dd>
              </div>
              <div>
                <dt>Member since</dt>
                <dd>{formatDate(user?.created_at)}</dd>
              </div>
            </dl>
          </Card>
        </div>

        <Card className="form-card">
          <form onSubmit={handleSave} className="form-grid">
            <Alert tone="error" onClose={() => setError("")}>{error}</Alert>
            <Alert tone="success" onClose={() => setSuccess("")}>{success}</Alert>

            <div className="form-span">
              <h3 className="form-section-title">Profile picture</h3>
              <UploadField
                label="Upload profile picture"
                hint="JPG/PNG, up to 5 MB"
                onFile={onFile}
                preview={imagePreview}
              />
              {imagePreview && (
                <ImagePreview src={imagePreview} alt="Profile preview" onRemove={() => { setImagePreview(null); setForm((p) => ({ ...p, profile_image: "" })); }} />
              )}
            </div>

            <Field label="Full name" htmlFor="full_name">
              <input id="full_name" value={form.full_name} onChange={update("full_name")} className="input" />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <input id="phone" type="tel" value={form.phone} onChange={update("phone")} className="input" />
            </Field>

            {role === "DONOR" && (
              <>
                <Field label="Blood group" htmlFor="blood_group">
                  <select id="blood_group" value={form.blood_group} onChange={update("blood_group")} className="input">
                    <option value="">Select…</option>
                    {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label="Gender" htmlFor="gender">
                  <select id="gender" value={form.gender} onChange={update("gender")} className="input">
                    <option value="">Select…</option>
                    {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label="Date of birth" htmlFor="dob">
                  <input id="dob" type="date" value={form.dob} onChange={update("dob")} className="input" />
                </Field>
                <Field label="Weight (kg)" htmlFor="weight">
                  <input id="weight" type="number" min="0" value={form.weight} onChange={update("weight")} className="input" />
                </Field>
                <Field label="City" htmlFor="city">
                  <input id="city" value={form.city} onChange={update("city")} className="input" />
                </Field>
                <Field label="State" htmlFor="state">
                  <input id="state" value={form.state} onChange={update("state")} className="input" />
                </Field>
                <Field label="Last donation date" htmlFor="last_donation_date">
                  <input id="last_donation_date" type="date" value={form.last_donation_date} onChange={update("last_donation_date")} className="input" />
                </Field>
                <Field label="Consumed alcohol recently" hint="Donors who consumed alcohol recently are deprioritized">
                  <label className="checkbox">
                    <input type="checkbox" checked={form.alcohol_consumed_recently} onChange={update("alcohol_consumed_recently")} />
                    <span>Yes, I consumed alcohol in the last 24 hours</span>
                  </label>
                </Field>
                <div className="form-span">
                  <h3 className="form-section-title">Location management</h3>
                  <div className="location-row">
                    <Field label="Latitude" htmlFor="latitude">
                      <input id="latitude" type="number" step="any" value={form.latitude} onChange={update("latitude")} className="input" />
                    </Field>
                    <Field label="Longitude" htmlFor="longitude">
                      <input id="longitude" type="number" step="any" value={form.longitude} onChange={update("longitude")} className="input" />
                    </Field>
                  </div>
                  <Button type="button" variant="secondary" onClick={updateLocation}>Use my current location</Button>
                </div>
              </>
            )}

            {role === "HOSPITAL" && (
              <>
                <Field label="Hospital name" htmlFor="hospital_name">
                  <input id="hospital_name" value={form.hospital_name} onChange={update("hospital_name")} className="input" />
                </Field>
                <Field label="Registration number" htmlFor="registration_number">
                  <input id="registration_number" value={form.registration_number} onChange={update("registration_number")} className="input" />
                </Field>
                <Field label="Contact person" htmlFor="contact_person">
                  <input id="contact_person" value={form.contact_person} onChange={update("contact_person")} className="input" />
                </Field>
                <Field label="Email" htmlFor="email">
                  <input id="email" type="email" value={form.email} onChange={update("email")} className="input" />
                </Field>
                <div className="form-span">
                  <Field label="Address" htmlFor="address">
                    <textarea id="address" rows={2} value={form.address} onChange={update("address")} className="input" />
                  </Field>
                </div>
                <Field label="City" htmlFor="city">
                  <input id="city" value={form.city} onChange={update("city")} className="input" />
                </Field>
                <Field label="State" htmlFor="state">
                  <input id="state" value={form.state} onChange={update("state")} className="input" />
                </Field>
                <Field label="Pincode" htmlFor="pincode">
                  <input id="pincode" value={form.pincode} onChange={update("pincode")} className="input" />
                </Field>
                <Field label="Latitude" htmlFor="latitude">
                  <input id="latitude" type="number" step="any" value={form.latitude} onChange={update("latitude")} className="input" />
                </Field>
                <Field label="Longitude" htmlFor="longitude">
                  <input id="longitude" type="number" step="any" value={form.longitude} onChange={update("longitude")} className="input" />
                </Field>
              </>
            )}

            {role === "BLOOD_BANK" && (
              <>
                <Field label="Blood bank name" htmlFor="blood_bank_name">
                  <input id="blood_bank_name" value={form.blood_bank_name} onChange={update("blood_bank_name")} className="input" />
                </Field>
                <Field label="Registration number" htmlFor="registration_number">
                  <input id="registration_number" value={form.registration_number} onChange={update("registration_number")} className="input" />
                </Field>
                <Field label="Contact person" htmlFor="contact_person">
                  <input id="contact_person" value={form.contact_person} onChange={update("contact_person")} className="input" />
                </Field>
                <div className="form-span">
                  <Field label="Address" htmlFor="address">
                    <textarea id="address" rows={2} value={form.address} onChange={update("address")} className="input" />
                  </Field>
                </div>
                <Field label="City" htmlFor="city">
                  <input id="city" value={form.city} onChange={update("city")} className="input" />
                </Field>
                <Field label="State" htmlFor="state">
                  <input id="state" value={form.state} onChange={update("state")} className="input" />
                </Field>
                <Field label="Pincode" htmlFor="pincode">
                  <input id="pincode" value={form.pincode} onChange={update("pincode")} className="input" />
                </Field>
              </>
            )}

            {role === "CAMP_ORGANIZER" && (
              <>
                <Field label="Organization" htmlFor="organization">
                  <input id="organization" value={form.organization} onChange={update("organization")} className="input" />
                </Field>
                <Field label="Contact person" htmlFor="contact_person">
                  <input id="contact_person" value={form.contact_person} onChange={update("contact_person")} className="input" />
                </Field>
                <Field label="City" htmlFor="city">
                  <input id="city" value={form.city} onChange={update("city")} className="input" />
                </Field>
                <Field label="State" htmlFor="state">
                  <input id="state" value={form.state} onChange={update("state")} className="input" />
                </Field>
              </>
            )}

            <div className="form-actions">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
