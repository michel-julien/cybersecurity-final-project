import AuthCard from "@/app/components/auth-card";

export default function AuthPage() {
  return (
    <div className="auth-page">
      <section className="auth-intro" aria-labelledby="auth-intro-title">
        <div className="auth-intro-inner">
          <p className="eyebrow eyebrow-light">
            <span className="eyebrow-dot" aria-hidden="true" />
            The sweet side of delivery
          </p>
          <h1 id="auth-intro-title">Welcome back, sweet friend.</h1>
          <p>
            Log in to keep your deliveries, notes, and Pepero Day surprises
            close at hand.
          </p>
          <div className="auth-sticks" aria-hidden="true">
            <span className="auth-stick auth-stick-one" />
            <span className="auth-stick auth-stick-two" />
            <span className="auth-stick auth-stick-three" />
          </div>
          <div className="auth-intro-note">
            <span className="note-mark" aria-hidden="true">
              ♥
            </span>
            <span>Made with a little extra care in Seoul.</span>
          </div>
        </div>
      </section>
      <AuthCard />
    </div>
  );
}
