import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Alert, Button, Card, Field, SectionHeader } from "../../components/ui";

export default function Contact() {
  const { notify } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      notify("Message sent! We'll get back to you shortly.", "success");
    }, 700);
  };

  return (
    <div className="public-page">
      <section className="page-hero page-hero--compact">
        <span className="hero__eyebrow">Contact</span>
        <h1>Get in touch with BloodLink</h1>
        <p className="hero__lead">
          Questions, partnerships, or support — we'd love to hear from you.
        </p>
      </section>

      <section className="section">
        <div className="contact-layout">
          <Card className="contact-card">
            <SectionHeader title="Send us a message" />
            {sent ? (
              <div className="contact-success">
                <span className="contact-success__icon">✅</span>
                <h3>Message sent!</h3>
                <p>Thanks for reaching out. We'll respond to {form.email} soon.</p>
                <Button variant="secondary" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="form-grid">
                <Alert tone="error">{error}</Alert>
                <Field label="Full name" htmlFor="name">
                  <input id="name" value={form.name} onChange={update("name")} className="input" />
                </Field>
                <Field label="Email" htmlFor="email">
                  <input id="email" type="email" value={form.email} onChange={update("email")} className="input" />
                </Field>
                <Field label="Subject" htmlFor="subject">
                  <input id="subject" value={form.subject} onChange={update("subject")} className="input" />
                </Field>
                <Field label="Message" htmlFor="message">
                  <textarea id="message" rows={5} value={form.message} onChange={update("message")} className="input" />
                </Field>
                <div className="form-actions">
                  <Button type="submit" disabled={loading}>{loading ? "Sending…" : "Send message"}</Button>
                </div>
              </form>
            )}
          </Card>

          <div className="contact-side">
            <Card className="contact-info">
              <h3>Contact details</h3>
              <p>📍 CVR College of Engineering, Vastunagar, Telangana</p>
              <p>📞 +91 90000 00000</p>
              <p>✉️ support@bloodlink.org</p>
              <p>🕐 Available 24×7 for emergency support</p>
            </Card>
            <Card className="contact-info">
              <h3>Quick links</h3>
              <p>🩸 Find blood: request or donate instantly</p>
              <p>🎪 Blood camps: register for a camp near you</p>
              <p>🏥 Hospitals: join the BloodLink network</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
