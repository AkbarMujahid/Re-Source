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

const resources = [
  {
    id: '1',
    title: 'Advanced Calculus Textbook',
    category: 'Textbooks',
    department: 'Mathematics',
    semester: '3',
    price: 3500,
    imageUrl: 'https://picsum.photos/seed/1/600/400',
    imageHint: 'calculus textbook',
    seller: 'Jane Doe',
    isNew: true,
  },
  {
    id: '2',
    title: 'Organic Chemistry Model Kit',
    category: 'Study Aids',
    department: 'Chemistry',
    semester: '2',
    price: 2000,
    imageUrl: 'https://picsum.photos/seed/2/600/400',
    imageHint: 'chemistry kit',
    seller: 'John Smith',
  },
  {
    id: '3',
    title: 'Data Structures & Algorithms Notes',
    category: 'Notes',
    department: 'Computer Science',
    semester: '4',
    price: 1200,
    imageUrl: 'https://picsum.photos/seed/3/600/400',
    imageHint: 'programming notes',
    seller: 'Emily White',
  },
  {
    id: '4',
    title: 'Introduction to Psychology',
    category: 'Textbooks',
    department: 'Psychology',
    semester: '1',
    price: 2400,
    imageUrl: 'https://picsum.photos/seed/4/600/400',
    imageHint: 'psychology book',
    seller: 'Michael Brown',
  },
  {
    id: '5',
    title: 'Digital Logic Design Board',
    category: 'Equipment',
    department: 'Electronics',
    semester: '3',
    price: 6000,
    imageUrl: 'https://picsum.photos/seed/5/600/400',
    imageHint: 'circuit board',
    seller: 'Sarah Green',
    isNew: true,
  },
  {
    id: '6',
    title: 'Literary Theory Anthology',
    category: 'Textbooks',
    department: 'Literature',
    semester: '5',
    price: 1600,
    imageUrl: 'https://picsum.photos/seed/6/600/400',
    imageHint: 'literature book',
    seller: 'David Black',
  },
   {
    id: '7',
    title: 'Microbiology Lab Coat',
    category: 'Equipment',
    department: 'Biology',
    semester: '2',
    price: 1440,
    imageUrl: 'https://picsum.photos/seed/7/600/400',
    imageHint: 'lab coat',
    seller: 'Laura Blue',
  },
  {
    id: '8',
    title: 'Advanced Python Programming Guide',
    category: 'Notes',
    department: 'Computer Science',
    semester: '6',
    price: 1760,
    imageUrl: 'https://picsum.photos/seed/8/600/400',
    imageHint: 'python code',
    seller: 'Chris Red',
  },
];

const categoryIcons = {
  Textbooks: <BookOpen className="w-5 h-5" />,
  'Study Aids': <Microscope className="w-5 h-5" />,
  Notes: <Code className="w-5 h-5" />,
  Equipment: <Palette className="w-5 h-5" />,
  default: <BookOpen className="w-5 h-5" />,
};

export default function HomePage() {
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
          <div className="flex justify-center">
            <Link href="/sell">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Sell Your Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-background sticky top-0 md:top-16 z-40 shadow-sm py-4">
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
            </div>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 font-headline">Recently Listed Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {resources.map((resource) => (
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
                  {resource.isNew && (
                    <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">NEW</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/50 hover:bg-white rounded-full text-rose-500 hover:text-rose-600"
                  >
                    <Heart className="w-6 h-6" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-4 flex-grow">
                  <Badge variant="secondary" className="mb-2">{resource.department}</Badge>
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
