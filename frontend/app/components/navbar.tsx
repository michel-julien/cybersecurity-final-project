"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/components/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#order-status", label: "Order status" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  function isCurrentLink(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return false;
  }

  function handleSignOut() {
    signOut();
    router.replace("/");
  }

  return (
    <header className="site-header">
      <div className="page-container nav-shell">
        <Link className="brand" href="/" aria-label="PeperoLife home">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span className="brand-name">
            Pepero<span>Life</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          {navigationLinks.map((link) => (
            <Link
              className={isCurrentLink(link.href) ? "nav-link active" : "nav-link"}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-greeting">Hi, {user.name}</span>
              <Button
                className="button button-outline button-small"
                onClick={handleSignOut}
                type="button"
                variant="outline"
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                className={buttonVariants({ className: "button button-primary button-small" })}
                href="/login"
              >
                Log in <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link
                className={buttonVariants({ className: "nav-signup", variant: "ghost" })}
                href="/signup"
              >
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
