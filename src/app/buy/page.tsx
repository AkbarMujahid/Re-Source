
'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Heart, Search, ChevronDown, BookOpen, Microscope, Code, Palette, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
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

export default function BuyPage() {
  const { firestore } = useUser();
  const listingsCollection = useMemo(() => firestore ? collection(firestore, 'listings') : null, [firestore]);
  const { data: resources, isLoading } = useCollection(listingsCollection);
  
  return (
    <div className="w-full animate-fade-in-up">
      {/* Search and Filter Section */}
      <section className="bg-background sticky top-16 z-40 shadow-sm py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search for textbooks, notes, equipment..." className="pl-10" />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-1/2 md:w-auto justify-between">
                    Category <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Textbooks</DropdownMenuItem>
                  <DropdownMenuItem>Notes</DropdownMenuItem>
                  <DropdownMenuItem>Study Aids</DropdownMenuItem>
                  <DropdownMenuItem>Equipment</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-1/2 md:w-auto justify-between">
                    Department <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Mathematics</DropdownMenuItem>
                  <DropdownMenuItem>Chemistry</DropdownMenuItem>
                  <DropdownMenuItem>Computer Science</DropdownMenuItem>
                  <DropdownMenuItem>Psychology</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto justify-between">
                    Semester <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>1</DropdownMenuItem>
                  <DropdownMenuItem>2</DropdownMenuItem>
                  <DropdownMenuItem>3</DropdownMenuItem>
                  <DropdownMenuItem>4</DropdownMenuItem>
                  <DropdownMenuItem>5</DropdownMenuItem>
                  <DropdownMenuItem>6</DropdownMenuItem>
                  <DropdownMenuItem>7</DropdownMenuItem>
                  <DropdownMenuItem>8</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 font-headline">All Resources</h2>
          {isLoading && 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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
            <Button size="lg" variant="outline">
              Load More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
