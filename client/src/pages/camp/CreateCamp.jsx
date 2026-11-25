import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { navigate } from "../../router/useRoute";
import { Alert, Button, Card, Field, SectionHeader } from "../../components/ui";
import { UploadField } from "../../components/kit";

const POSTERS = ["🩸", "💼", "🎓", "❄️", "🌾", "🏥"];

export default function CreateCamp() {
  const { notify } = useToast();
  const [form, setForm] = useState({
    title: "",
    city: "Hyderabad",
    location: "",
    date: "",
    time: "09:00",
    capacity: 100,
    poster: "🩸",
  });
  const [error, setError] = useState("");
  const [posterImage, setPosterImage] = useState(null);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.location || !form.date) {
      setError("Title, location, and date are required.");
      return;
    }
    notify(`Camp “${form.title}” created successfully.`, "success");
    navigate("/app/manage-camps");
  };

  return (
    <div className="page">
      <SectionHeader title="Create Blood Camp" subtitle="Set up a new donation camp and manage its capacity." />

      <Card className="form-card">
        <form onSubmit={handleSubmit} className="form-grid">
          <Alert tone="error" onClose={() => setError("")}>{error}</Alert>

          <div className="form-span">
            <Field label="Camp title" htmlFor="title">
              <input id="title" required value={form.title} onChange={update("title")} className="input" placeholder="Community Blood Donation Camp" />
            </Field>
          </div>

          <Field label="City" htmlFor="city">
            <input id="city" value={form.city} onChange={update("city")} className="input" />
          </Field>

          <div className="form-span">
            <Field label="Location" htmlFor="location">
              <input id="location" required value={form.location} onChange={update("location")} className="input" placeholder="Venue address" />
            </Field>
          </div>

          <Field label="Date" htmlFor="date">
            <input id="date" type="date" required value={form.date} onChange={update("date")} className="input" />
          </Field>

          <Field label="Time" htmlFor="time">
            <input id="time" type="time" value={form.time} onChange={update("time")} className="input" />
          </Field>

          <Field label="Capacity" htmlFor="capacity">
            <input id="capacity" type="number" min="1" value={form.capacity} onChange={update("capacity")} className="input" />
          </Field>

          <Field label="Camp poster icon" hint="Pick a poster style">
            <div className="poster-picker">
              {POSTERS.map((p) => (
                <button
                  type="button"
                  key={p}
                  className={`poster-picker__item ${form.poster === p ? "poster-picker__item--active" : ""}`}
                  onClick={() => setForm((prev) => ({ ...prev, poster: p }))}
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>

          <div className="form-span">
            <UploadField
              label="Upload camp poster (optional)"
              hint="JPG/PNG, up to 5 MB"
              onFile={(file) => {
                const reader = new FileReader();
                reader.onload = () => setPosterImage(reader.result);
                reader.readAsDataURL(file);
              }}
              preview={posterImage}
            />
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => navigate("/app/manage-camps")}>Cancel</Button>
            <Button type="submit">Create camp</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
