
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Privacy } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-headline">
            Privacy Policy
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
                    <Privacy className="w-8 h-8 text-primary" />
                    <CardTitle className="text-2xl font-headline">Your Privacy at Re-Source</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-8 text-muted-foreground">
              <p>
                At Re-Source, your privacy is important. This policy explains how we collect, use, and protect your information when you use our app.
              </p>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">1. Information We Collect</h2>
                <p>We may collect:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li><strong>Account information:</strong> Name, email, password.</li>
                    <li><strong>Listings data:</strong> Items you post for buying/selling.</li>
                    <li><strong>Messages:</strong> Communications with other users within the app.</li>
                    <li><strong>Usage data:</strong> How you use the app, device info, and analytics.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">2. How We Use Your Information</h2>
                <p>We use your data to:</p>
                 <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Provide and improve the app.</li>
                    <li>Allow you to buy, sell, or communicate with other users.</li>
                    <li>Send important updates or notifications.</li>
                    <li>Analyze app usage to improve user experience.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">3. Sharing Your Information</h2>
                 <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>We do not sell your data.</li>
                    <li>Your account info and messages are visible to other users only when necessary for transactions or chats.</li>
                    <li>We may share data if required by law or to protect our rights.</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">4. Security</h2>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>We take reasonable measures to protect your data.</li>
                    <li>No system is completely secure, so use strong passwords and keep your account safe.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">5. Your Rights</h2>
                 <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>You can update or delete your account information at any time.</li>
                    <li>You can request deletion of your account and personal data.</li>
                </ul>
              </div>

               <div>
                <h2 className="text-xl font-bold text-foreground mb-2">6. Third-Party Services</h2>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Our app may use third-party services (like Firebase) to store and process data.</li>
                    <li>These services follow their own privacy rules but are bound to keep your data safe.</li>
                </ul>
              </div>
              
               <div>
                <h2 className="text-xl font-bold text-foreground mb-2">7. Children’s Privacy</h2>
                 <p>
                    The app is not intended for children under 13 (or the applicable legal age).
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">8. Changes to this Policy</h2>
                 <p>
                    We may update this policy. Continued use of the app means you accept any changes.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">9. Contact Us</h2>
                <p>
                  If you have questions about your privacy, please contact us at: <a href="mailto:akbarmujahid1114@gmail.com" className="text-primary hover:underline">akbarmujahid1114@gmail.com</a>.
                </p>
              </div>

            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
