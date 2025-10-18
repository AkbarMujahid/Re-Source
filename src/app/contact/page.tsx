
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Send } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-headline">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold font-headline mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" type="text" placeholder="John Doe" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" type="text" placeholder="e.g., Feedback about listings" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea id="message" placeholder="Type your message here..." rows={6} />
                </div>
                <div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </div>
              </form>
            </div>

            {/* Contact Information */}
            <div className="bg-muted/50 p-8 rounded-lg">
              <h2 className="text-3xl font-bold font-headline mb-6">Contact Information</h2>
              <div className="space-y-6 text-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full mt-1">
                     <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a href="mailto:support@re-source.com" className="text-muted-foreground hover:text-primary transition-colors">
                      support@re-source.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="bg-primary/10 p-3 rounded-full mt-1">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">(+91) 123-456-7890</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="bg-primary/10 p-3 rounded-full mt-1">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Office</h3>
                    <p className="text-muted-foreground">
                      123 Innovation Drive, <br />
                      SCE Campus, Bengaluru, 560001
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t">
                  <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                  <div className="flex items-center gap-4">
                      <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                          <Twitter className="w-7 h-7" />
                          <span className="sr-only">Twitter</span>
                      </Link>
                      <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                          <Linkedin className="w-7 h-7" />
                          <span className="sr-only">LinkedIn</span>
                      </Link>
                      <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                          <Facebook className="w-7 h-7" />
                          <span className="sr-only">Facebook</span>
                      </Link>
                  </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
