import { useAuth } from "../../contexts/AuthContext";
import { navigate } from "../../router/useRoute";
import { Button } from "../../components/ui";
import { Breadcrumbs } from "../../components/kit";

export default function Unauthorized() {
  const { isAuthenticated, role } = useAuth();

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <Breadcrumbs
          items={[
            { label: "BloodLink", href: "#/", onClick: () => navigate("/") },
            { label: "Access denied" },
          ]}
        />
        <div className="auth-card__brand">
          <span className="auth-card__mark">🔒</span>
          <h1>Access denied</h1>
          <p>
            You don't have permission to view this page. It may require a
            different role or a verified account.
          </p>
        </div>

        <div className="auth-form">
          <div className="verify-status">
            <p>
              {isAuthenticated
                ? `Your current role is ${role}. This section is reserved for another role.`
                : "Please sign in with an account that has access to this section."}
            </p>
          </div>
          <div className="auth-form__row auth-form__row--center">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/app/dashboard")}>Back to dashboard</Button>
            ) : (
              <Button onClick={() => navigate("/login")}>Sign in</Button>
            )}
            <Button variant="secondary" onClick={() => navigate("/")}>
              Go to home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
