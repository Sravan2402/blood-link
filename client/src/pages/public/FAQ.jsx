import { SectionHeader } from "../../components/ui";
import { faqs } from "../../lib/mockData";

export default function FAQ() {
  return (
    <div className="public-page">
      <section className="page-hero page-hero--compact">
        <span className="hero__eyebrow">FAQ</span>
        <h1>Frequently asked questions</h1>
        <p className="hero__lead">
          Everything you need to know about BloodLink, donating, and the
          request workflow.
        </p>
      </section>

      <section className="section">
        <SectionHeader title="Common questions" />
        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section section--tint">
        <div className="awareness-grid">
          <div className="faq-note">
            <h3>Still have questions?</h3>
            <p>Reach out to our team and we'll get back to you quickly.</p>
          </div>
          <div className="faq-note">
            <h3>Need urgent help?</h3>
            <p>If you're a hospital with an emergency request, post it on BloodLink to reach nearby donors instantly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
