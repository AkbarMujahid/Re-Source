
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-headline">
            Terms of Service
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            Effective Date: 18/10/25
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <CardTitle className="text-2xl font-headline">Welcome to Re-Source!</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-8 text-muted-foreground">
              <p>
                By using our app, you agree to these terms. Please read them carefully.
              </p>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Eligibility</h2>
                <p>
                  You must be of legal age in your country to use the app.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Accounts</h2>
                <p>
                  Keep your account details safe and provide accurate information. You are responsible for all activities that occur under your account.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Be Respectful</h2>
                <p>
                  Do not post harmful, misleading, or illegal content. Respect other users and engage in constructive communication. Harassment or abuse of any kind will not be tolerated.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Content & Communication</h2>
                <p>
                  You are responsible for what you post or send through the app. We reserve the right to review and remove any content that violates our rules or community standards, with or without notice.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Transactions</h2>
                <p>
                  Any buying, selling, or exchanging of resources between users is done at your own risk. Re-Source acts as a platform to connect users, but we do not guarantee transactions, vet listings, or handle payments.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Privacy</h2>
                <p>
                  Your use of the app is subject to our Privacy Policy, which explains how we collect, use, and protect your personal data. You can find the Privacy Policy <Link href="/privacy" className="text-primary hover:underline">here</Link>.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Limitations of Liability</h2>
                <p>
                  The app is provided “as is.” We are not responsible for any disputes, errors, financial losses, or other damages that may arise from your use of the app.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Termination</h2>
                <p>
                  We reserve the right to suspend or permanently remove accounts that violate these terms. You can also choose to delete your account at any time.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Governing Law</h2>
                <p>
                  These terms are governed by the laws of India.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Updates to Terms</h2>
                <p>
                  We may update these terms from time to time. We will notify you of significant changes. Continued use of the app after such changes means you accept the new terms.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">Contact Us</h2>
                <p>
                  If you have any questions about these terms, please contact us at: <a href="mailto:akbarmujahid1114@gmail.com" className="text-primary hover:underline">akbarmujahid1114@gmail.com</a>.
                </p>
              </div>

            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
