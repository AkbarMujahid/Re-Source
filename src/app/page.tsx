
'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heart, BookOpen, Microscope, Code, Palette, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useCollection } from '@/firebase';
import { collection, limit, orderBy, query } from 'firebase/firestore';
import { useMemo } from 'react';
import { useUser } from '@/firebase/provider';
import { Skeleton } from '@/components/ui/skeleton';


const categoryIcons = {
  Textbooks: <BookOpen className="w-5 h-5" />,
  'Study Aids': <Microscope className="w-5 h-5" />,
  Notes: <Code className="w-5 h-5" />,
  Equipment: <Palette className="w-5 h-5" />,
  default: <BookOpen className="w-5 h-5" />,
};

export default function HomePage() {
  const { firestore } = useUser();
  const listingsCollection = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'listings'), orderBy('createdAt', 'desc'), limit(8));
  }, [firestore]);
  const { data: resources, isLoading } = useCollection(listingsCollection);
  
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-primary/10 py-20 md:py-32 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 font-headline">
            Your Campus Marketplace
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
            Re-Source is the easiest way for students at SCE to buy, sell, and exchange academic resources.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/buy">
                <Button size="lg">
                    Browse & Buy
                </Button>
            </Link>
            <Link href="/sell">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Sell Your Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 font-headline">Recently Listed Resources</h2>
          {isLoading && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden flex flex-col">
                  <CardHeader className="p-0 relative">
                      <Skeleton className="w-full h-48" />
                  </CardHeader>
                  <CardContent className="pt-4 flex-grow">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          }
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {resources?.map((resource) => (
              <Card key={resource.id} className="overflow-hidden flex flex-col group transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <CardHeader className="p-0 relative">
                  <Link href={`/listings/${resource.id}`}>
                    <Image
                      src={resource.imageUrl}
                      alt={resource.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-48"
                      data-ai-hint={resource.imageHint}
                    />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/50 hover:bg-white rounded-full text-rose-500 hover:text-rose-600"
                  >
                    <Heart className="w-6 h-6" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-4 flex-grow">
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">{resource.department}</Badge>
                    <Badge variant="outline">Sem {resource.semester}</Badge>
                  </div>
                  <Link href={`/listings/${resource.id}`}>
                    <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                      {resource.title}
                    </CardTitle>
                  </Link>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center text-xl font-bold text-primary">
                     <IndianRupee className="w-5 h-5 mr-1" />
                     {resource.price.toFixed(2)}
                  </div>
                   <div className="flex items-center text-sm text-muted-foreground gap-1">
                    {categoryIcons[resource.category as keyof typeof categoryIcons] || categoryIcons.default}
                    {resource.category}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
           <div className="text-center mt-12">
            <Link href="/buy">
                <Button size="lg" variant="outline">
                    View All Listings
                </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
