
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Zap, Handshake, Recycle, IndianRupee } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const teamMembers = [
  {
    name: "Akbar Mujahid",
    role: "Founder, CEO, Lead Developer & UX/UI Designer",
    avatar: "/avatars/01.png",
    fallback: "AM",
    imageUrl: "https://picsum.photos/seed/team1/500/500"
  },
];


export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 font-headline">
            About Re-Source
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            We are a student-focused platform dedicated to making academic life more affordable, sustainable, and collaborative.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-4">
              Our mission is to create a trusted, centralized marketplace for students to buy, sell, and exchange academic resources like textbooks, notes, and equipment. We believe that learning materials should be accessible and affordable for everyone.
            </p>
            <p className="text-lg text-muted-foreground">
              By giving old resources a new life, we not only help students save money but also promote a more sustainable campus environment. Re-Source is more than a marketplace; it's a community built on mutual support and shared knowledge.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <Image
              src="https://picsum.photos/seed/campus/600/400"
              alt="College campus"
              width={600}
              height={400}
              className="rounded-lg shadow-lg object-cover w-full"
              data-ai-hint="college campus"
            />
          </div>
        </div>
      </section>

      {/* Our Values Section */}
       <section className="py-16 md:py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Core Values</h2>
            <p className="text-lg text-muted-foreground mt-2">The principles that guide our community.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-accent/10 p-4 rounded-full w-fit">
                  <Handshake className="w-8 h-8 text-accent" />
                </div>
                <CardTitle className="font-headline mt-4">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We foster a supportive network where students can connect, share, and help each other succeed.
                </p>
              </CardContent>
            </Card>
             <Card className="text-center">
              <CardHeader>
                 <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <Recycle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">Sustainability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  By promoting the reuse of academic materials, we contribute to a greener, more eco-friendly campus.
                </p>
              </CardContent>
            </Card>
             <Card className="text-center">
              <CardHeader>
                 <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit">
                  <IndianRupee className="w-8 h-8 text-green-500" />
                </div>
                <CardTitle className="font-headline mt-4">Affordability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We aim to reduce the financial burden on students by providing a platform for reasonably priced resources.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet The Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">Meet The Team</h2>
            <p className="text-lg text-muted-foreground mt-2">The person behind Re-Source.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center">
                <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20">
                  <AvatarImage src={member.imageUrl} alt={member.name} />
                  <AvatarFallback>{member.fallback}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
       <section className="py-16 md:py-24 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Join Our Community</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Ready to start saving money and helping fellow students? Browse listings or sell your own resources today.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/">Browse Listings</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/sell">Sell an Item</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
