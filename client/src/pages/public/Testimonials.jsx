import { Card, SectionHeader, Badge } from "../../components/ui";
import { StarRating } from "../../components/kit";
import { testimonials } from "../../lib/mockData";

export default function Testimonials() {
  return (
    <div className="public-page">
      <section className="page-hero page-hero--compact">
        <span className="hero__eyebrow">Testimonials</span>
        <h1>Stories from the BloodLink community</h1>
        <p className="hero__lead">
          Hear from donors, medical professionals, and organizers about how
          BloodLink makes a difference.
        </p>
      </section>

      <section className="section">
        <SectionHeader title="What people say" />
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <Card key={t.name} className="testimonial-card">
              <StarRating value={5} />
              <p className="testimonial-card__quote">“{t.text}”</p>
              <div className="testimonial-card__author">
                <span className="testimonial-card__avatar">{t.avatar}</span>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
              {i === 0 && <Badge tone="info">Featured</Badge>}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
