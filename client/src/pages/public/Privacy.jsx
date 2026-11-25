import { SectionHeader } from "../../components/ui";
import { Breadcrumbs } from "../../components/kit";
import { navigate } from "../../router/useRoute";

const SECTIONS = [
  { title: "1. Introduction", body: "This Privacy Policy describes how BloodLink collects, uses, and protects personal information provided by users of the platform, including donors, hospitals, blood banks, camp organizers, and administrators." },
  { title: "2. Information we collect", body: "We collect account details (name, email, phone, role), profile information (blood group, city, location coordinates, eligibility, availability), and records of blood requests, responses, donations, and notifications necessary to provide the service." },
  { title: "3. How we use your information", body: "Your information is used to authenticate your account, match you with relevant blood requests, send notifications, maintain donation records, and provide role-based access to the appropriate portal." },
  { title: "4. Location data", body: "BloodLink uses the location coordinates you store in your profile to find nearby matches. BloodLink does not continuously track your location in the background." },
  { title: "5. Data security", body: "Authentication is secured with JSON Web Tokens (JWT) with expiry, and passwords are hashed using bcrypt. Access to functionality is controlled through role-based authorization, and the platform uses secure API practices." },
  { title: "6. Data sharing", body: "We do not sell personal data. Relevant request details may be shared with matched donors and the requesting hospital to coordinate a donation." },
  { title: "7. Your rights", body: "You may view and update your profile, manage your availability, and request changes to your stored information through your account settings." },
  { title: "8. Contact", body: "For privacy-related questions, contact us via the Contact page or the details provided there." },
];

export default function Privacy() {
  return (
    <div className="public-page">
      <div className="legal-head">
        <Breadcrumbs
          items={[
            { label: "BloodLink", href: "#/", onClick: () => navigate("/") },
            { label: "Privacy Policy" },
          ]}
        />
        <SectionHeader title="Privacy Policy" subtitle="How BloodLink handles your personal information." />
      </div>
      <section className="section">
        <div className="legal-body">
          {SECTIONS.map((s) => (
            <div key={s.title} className="legal-section">
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
