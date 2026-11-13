import type { Metadata } from "next";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Coming soon",
};

export default function SignupPage() {
  return (
    <section className="coming-soon-page" aria-labelledby="coming-soon-title">
      <Card className="coming-soon-card">
        <CardContent className="coming-soon-content">
          <CardTitle id="coming-soon-title">Coming soon</CardTitle>
        </CardContent>
      </Card>
    </section>
  );
}
