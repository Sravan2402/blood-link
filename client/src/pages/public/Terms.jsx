import { SectionHeader } from "../../components/ui";
import { Breadcrumbs } from "../../components/kit";
import { navigate } from "../../router/useRoute";

const SECTIONS = [
  { title: "1. Acceptance of terms", body: "By accessing or using BloodLink, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform." },
  { title: "2. Description of service", body: "BloodLink is a real-time emergency blood donor finder and blood request management platform that connects donors, hospitals, blood banks, camp organizers, and administrators." },
  { title: "3. User accounts", body: "You must provide accurate and complete information when registering, maintain the security of your credentials, and are responsible for activity under your account." },
  { title: "4. Eligibility to donate", body: "Donors are responsible for ensuring they are eligible to donate. BloodLink matches requests based on stored profile data; final eligibility is confirmed during donation screening by authorized staff." },
  { title: "5. Hospital & organization responsibilities", body: "Hospitals and organizations are responsible for the accuracy of blood requests and for managing donor responses, selection, and donation completion in accordance with applicable medical practices." },
  { title: "6. Prohibited conduct", body: "Users must not misuse the platform, provide false information, attempt to disrupt the service, or misuse notifications or matching features." },
  { title: "7. Notifications", body: "In-app notifications are provided to coordinate requests. Users are responsible for responding promptly to relevant notifications." },
  { title: "8. Availability", body: "The service is provided on an 'as is' basis. BloodLink aims for high availability but does not guarantee uninterrupted operation." },
  { title: "9. Limitation of liability", body: "BloodLink is a coordination platform and is not a substitute for professional medical care. To the maximum extent permitted by law, BloodLink is not liable for outcomes arising from donations or requests coordinated through the platform." },
  { title: "10. Changes & contact", body: "These terms may be updated over time. Material changes will be communicated through the platform. For questions, use the Contact page." },
];

export default function Terms() {
  return (
    <div className="public-page">
      <div className="legal-head">
        <Breadcrumbs
          items={[
            { label: "BloodLink", href: "#/", onClick: () => navigate("/") },
            { label: "Terms & Conditions" },
          ]}
        />
        <SectionHeader title="Terms & Conditions" subtitle="The terms that govern use of the BloodLink platform." />
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
