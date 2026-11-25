import { useAuth } from "../../contexts/AuthContext";
import { navigate } from "../../router/useRoute";
import { Button, Card, SectionHeader, StatusBadge } from "../../components/ui";
import { ProgressBar } from "../../components/kit";
import { Breadcrumbs } from "../../components/kit";

export default function VerificationStatus() {
  const { user, role, isAuthenticated } = useAuth();

  const items = [
    { label: "Email verified", done: true },
    { label: "Phone verified", done: true },
    { label: "Profile completed", done: !!user?.full_name },
    {
      label: role === "HOSPITAL" ? "Hospital verified" : role === "BLOOD_BANK" ? "Blood bank verified" : "Identity verified",
      done: user?.is_verified ?? false,
    },
    {
      label: role === "DONOR" ? "Donor eligibility approved" : "Compliance reviewed",
      done: role === "DONOR" ? false : true,
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);
  const isComplete = doneCount === items.length;

  return (
    <div className="page">
      <Breadcrumbs
        items={[
          { label: "BloodLink", href: "#/", onClick: () => navigate("/") },
          { label: "Account" },
          { label: "Verification status" },
        ]}
      />

      <SectionHeader
        title="Account Verification"
        subtitle="Track the verification steps required for full access."
        action={
          isAuthenticated ? (
            <Button variant="secondary" onClick={() => navigate("/app/profile")}>
              Go to profile
            </Button>
          ) : (
            <Button onClick={() => navigate("/login")}>Sign in</Button>
          )
        }
      />

      <Card className="verify-hero">
        <div>
          <h2>{isComplete ? "Account fully verified 🎉" : "Verification in progress"}</h2>
          <p>
            {isComplete
              ? "All verification steps are complete. You have full access to your portal."
              : "Complete the remaining steps to unlock all features."}
          </p>
        </div>
        <div className="verify-progress">
          <span className="verify-progress__pct">{pct}%</span>
          <ProgressBar value={pct} tone={isComplete ? "success" : "primary"} />
        </div>
      </Card>

      <Card className="verify-list">
        <h3>Verification steps</h3>
        <div className="verify-steps">
          {items.map((item) => (
            <div key={item.label} className={`verify-step ${item.done ? "verify-step--done" : ""}`}>
              <span className="verify-step__icon">{item.done ? "✅" : "⏳"}</span>
              <span className="verify-step__label">{item.label}</span>
              {item.done ? (
                <StatusBadge status="COMPLETED" />
              ) : (
                <StatusBadge status="OPEN" />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
