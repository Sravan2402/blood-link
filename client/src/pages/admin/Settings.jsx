import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Alert, Button, Card, Field, SectionHeader } from "../../components/ui";

export default function Settings() {
  const { notify } = useToast();
  const [form, setForm] = useState({
    siteName: "BloodLink",
    supportEmail: "support@bloodlink.org",
    autoVerify: "true",
    minUnits: "1",
    maxRadius: "25",
    smsNotifications: "true",
    emailNotifications: "true",
  });
  const [saved, setSaved] = useState(false);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const save = (e) => {
    e.preventDefault();
    setSaved(true);
    notify("Settings saved successfully.", "success");
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="page">
      <SectionHeader title="Settings" subtitle="Platform-wide configuration and security policies." />

      <Card className="form-card">
        <form onSubmit={save} className="form-grid">
          <Alert tone={saved ? "success" : "error"} onClose={() => setSaved(false)}>
            {saved ? "Settings saved." : ""}
          </Alert>

          <div className="form-span">
            <Field label="Site name" htmlFor="siteName">
              <input id="siteName" value={form.siteName} onChange={update("siteName")} className="input" />
            </Field>
          </div>
          <div className="form-span">
            <Field label="Support email" htmlFor="supportEmail">
              <input id="supportEmail" type="email" value={form.supportEmail} onChange={update("supportEmail")} className="input" />
            </Field>
          </div>

          <Field label="Minimum units per request" htmlFor="minUnits">
            <input id="minUnits" type="number" min="1" value={form.minUnits} onChange={update("minUnits")} className="input" />
          </Field>
          <Field label="Default search radius (km)" htmlFor="maxRadius">
            <input id="maxRadius" type="number" min="1" value={form.maxRadius} onChange={update("maxRadius")} className="input" />
          </Field>

          <Field label="Auto-verify accounts" htmlFor="autoVerify">
            <select id="autoVerify" value={form.autoVerify} onChange={update("autoVerify")} className="input">
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </Field>
          <Field label="SMS notifications" htmlFor="sms">
            <select id="sms" value={form.smsNotifications} onChange={update("smsNotifications")} className="input">
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </Field>
          <Field label="Email notifications" htmlFor="email">
            <select id="email" value={form.emailNotifications} onChange={update("emailNotifications")} className="input">
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </Field>

          <div className="form-actions">
            <Button type="submit">Save settings</Button>
          </div>
        </form>
      </Card>

      <Card className="dash-card">
        <h3>Security</h3>
        <ul className="security-list">
          <li>✅ JWT authentication with 4-hour expiry tokens</li>
          <li>✅ Passwords encrypted with bcrypt</li>
          <li>✅ Role-based access control (DONOR, HOSPITAL, BLOOD_BANK, CAMP_ORGANIZER, ADMIN)</li>
          <li>✅ Route guards for protected portals</li>
          <li>✅ Input validation on all forms</li>
          <li>✅ Audit logging of critical actions</li>
        </ul>
      </Card>
    </div>
  );
}
