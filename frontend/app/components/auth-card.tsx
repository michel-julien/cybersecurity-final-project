"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authenticateDemoAccount } from "@/app/actions/auth";
import { useAuth } from "@/app/components/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import demoAccounts from "@/app/data/demo-accounts.json";

export default function AuthCard() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setIsLoggingIn(true);

    try {
      const result = await authenticateDemoAccount(email, password);

      if (!result.success) {
        setLoginError(result.message);
        return;
      }

      signIn(result.email, result.name);
      router.replace("/");
    } catch {
      setLoginError("Unable to check the demo account right now. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  return (
    <Card className="auth-card">
      <CardHeader className="auth-card-heading">
        <p className="eyebrow">PeperoLife account</p>
        <CardTitle id="auth-card-title" className="auth-card-title">
          Log in
        </CardTitle>
        <CardDescription className="auth-card-description">
          Use a demo account to explore the PeperoLife experience.
        </CardDescription>
      </CardHeader>

      <CardContent className="auth-card-content">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <Label htmlFor="email">Email address</Label>
            <Input
              autoComplete="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </div>

          <div className="field">
            <Label htmlFor="password">Password</Label>
            <div className="password-input">
              <Input
                autoComplete="current-password"
                className="auth-input-with-action"
                id="password"
                minLength={8}
                name="password"
                placeholder="Your demo password"
                required
                type={isPasswordVisible ? "text" : "password"}
              />
              <Button
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                className="password-toggle"
                onClick={() => setIsPasswordVisible((visible) => !visible)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                {isPasswordVisible ? (
                  <EyeOff aria-hidden="true" />
                ) : (
                  <Eye aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>

          <div className="form-options">
            <div className="checkbox-field">
              <Checkbox id="remember" name="remember" />
              <Label htmlFor="remember">Keep me signed in</Label>
            </div>
            <span className="form-hint">Demo access</span>
          </div>

          {loginError && (
            <p aria-live="polite" className="login-error" role="alert">
              {loginError}
            </p>
          )}

          <Button
            className="button button-primary full-width"
            disabled={isLoggingIn}
            type="submit"
          >
            {isLoggingIn ? (
              <>
                <LoaderCircle aria-hidden="true" className="animate-spin" />
                Checking account...
              </>
            ) : (
              <>
                Log in to PeperoLife
                <ArrowUpRight aria-hidden="true" />
              </>
            )}
          </Button>
          <p className="demo-note">
            Demo accounts are stored in <code>app/data/demo-accounts.json</code>.
          </p>
        </form>

        <div className="demo-credentials" aria-label="Available demo accounts">
          <p>Try a demo account</p>
          {demoAccounts.map((account) => (
            <div className="demo-account" key={account.email}>
              <span>{account.name}</span>
              <code>
                {account.email} · {account.password}
              </code>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="auth-card-footer">
        <p className="auth-switch">
          Account creation is <strong>coming soon</strong>.{" "}
          <Link className={buttonVariants({ variant: "link", size: "sm" })} href="/signup">
            Learn more
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
