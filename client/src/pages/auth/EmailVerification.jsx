import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { navigate, useRoute } from "../../router/useRoute";
import { Alert, Button, Field } from "../../components/ui";
import { Spinner } from "../../components/ui";
import { Breadcrumbs } from "../../components/kit";

export default function EmailVerification() {
  const { notify } = useToast();
  const route = useRoute();
  const email = route.query.get("email") || "";
  const [emailValue, setEmailValue] = useState(email);
  const [status, setStatus] = useState("pending"); // pending | verifying | verified
  const [error, setError] = useState("");

  const handleVerify = () => {
    setError("");
    if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("verifying");
    setTimeout(() => {
      setStatus("verified");
      notify("Email verified successfully!", "success");
    }, 1200);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <Breadcrumbs
          items={[
            { label: "BloodLink", href: "#/", onClick: () => navigate("/") },
            { label: "Email verification" },
          ]}
        />
        <div className="auth-card__brand">
          <span className="auth-card__mark">✉️</span>
          <h1>Verify your email</h1>
          <p>Confirm your email address to activate your account</p>
        </div>

        <div className="auth-form">
          <Alert tone="error">{error}</Alert>

          {status === "verified" ? (
            <div className="verify-success">
              <span className="verify-success__icon">✅</span>
              <h3>Email verified</h3>
              <p>Your email address {emailValue || "has been"} is now verified.</p>
              <Button onClick={() => navigate("/login")}>Continue to login</Button>
            </div>
          ) : (
            <>
              <Field label="Email address" htmlFor="email">
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  className="input"
                  disabled={status === "verifying"}
                />
              </Field>
              <Button onClick={handleVerify} disabled={status === "verifying"}>
                {status === "verifying" ? "Verifying…" : "Verify email"}
              </Button>
              {status === "verifying" && (
                <div className="verify-status">
                  <Spinner label="Sending verification…" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
