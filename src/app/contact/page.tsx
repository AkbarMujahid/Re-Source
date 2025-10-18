
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Send } from "lucide-react";
import Link from "next/link";

// Custom WhatsApp Icon Component
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M16.75 13.96c.25.13.41.2.52.34.11.14.15.33.1.53-.06.23-.34.42-.69.52-.31.09-.75.14-1.32.06-.71-.1-1.39-.39-2.04-.79-.89-.55-1.61-1.28-2.2-2.12-.51-.73-.83-1.55-.9-2.43-.07-.88.23-1.63.78-2.22.2-.21.43-.37.66-.46.23-.09.43-.1.58-.05.15.05.29.1.41.17.12.07.21.15.28.25.1.13.15.28.11.45-.02.13-.05.26-.09.39-.04.13-.1.29-.15.39-.1.22-.21.43-.06.66.3.43.68.84 1.12 1.22.44.38.85.71 1.29.98.24.15.42.21.58.21.17,0,.31-.03.44-.1.15-.09.28-.2.4-.33.09-.1.19-.19.3-.25.11-.06.22-.09.33-.09.15,0,.29.04.41.12s.22.18.3.31c.08.13.12.26.12.41-.01.15-.05.28-.12.41z M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 18.2a8.2 8.2 0 1 1 8.2-8.2 8.21 8.21 0 0 1-8.2 8.2z" />
  </svg>
);


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
                    <a href="mailto:akbarmujahid1114@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                      akbarmujahid1114@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="bg-primary/10 p-3 rounded-full mt-1">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">(+91) 7039965293</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t">
                  <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                  <div className="flex items-center gap-4">
                      <Link href="https://wa.me/917039965293" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <WhatsAppIcon className="w-7 h-7" />
                          <span className="sr-only">WhatsApp</span>
                      </Link>
                      <Link href="https://www.linkedin.com/in/akbarmujahid" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <Linkedin className="w-7 h-7" />
                          <span className="sr-only">LinkedIn</span>
                      </Link>
                      <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                          <Twitter className="w-7 h-7" />
                          <span className="sr-only">Twitter</span>
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
