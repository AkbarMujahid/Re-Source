import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Tag, Book, Building, Calendar, DollarSign, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


const resource = {
  id: '1',
  title: 'Advanced Calculus Textbook',
  description: "A barely used textbook for MATH-301. Contains all pages, no markings or highlights. Perfect for students looking to save money. This edition is the latest one required by the department. Includes access to online resources, code is unscratched.",
  category: 'Textbooks',
  department: 'Mathematics',
  semester: '3',
  price: 45.0,
  imageUrl: 'https://picsum.photos/seed/1/1200/800',
  imageHint: 'calculus textbook',
  seller: {
    name: 'Jane Doe',
    avatarUrl: 'https://picsum.photos/seed/avatar1/100/100',
    memberSince: '2023-08-15',
  },
};

const recommendedResources = [
    { id: '2', title: 'Calculus II Notes', price: 10.0, imageUrl: 'https://picsum.photos/seed/rec1/600/400', imageHint: 'math notes'},
    { id: '3', title: 'Linear Algebra Textbook', price: 50.0, imageUrl: 'https://picsum.photos/seed/rec2/600/400', imageHint: 'algebra book'},
    { id: '4', title: 'Differential Equations Practice Problems', price: 20.0, imageUrl: 'https://picsum.photos/seed/rec3/600/400', imageHint: 'equations sheet'},
    { id: '5', title: 'Statistics for Engineers', price: 35.0, imageUrl: 'https://picsum.photos/seed/rec4/600/400', imageHint: 'statistics chart'},
];

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column - Image */}
        <div className="md:col-span-2">
          <Card className="overflow-hidden shadow-lg">
            <Image
              src={resource.imageUrl}
              alt={resource.title}
              width={1200}
              height={800}
              className="object-cover w-full h-auto"
              data-ai-hint={resource.imageHint}
              priority
            />
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <h1 className="text-3xl lg:text-4xl font-bold font-headline mb-2">{resource.title}</h1>
            <div className="flex items-center text-3xl font-bold text-primary mb-4">
              <DollarSign className="w-7 h-7 mr-2" />
              {resource.price.toFixed(2)}
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <Button size="lg" className="flex-1">
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact Seller
              </Button>
              <Button variant="outline" size="lg" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-200 hover:border-rose-300">
                <Heart className="mr-2 h-5 w-5" />
                Wishlist
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Seller Info */}
            <Card className="bg-background">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={resource.seller.avatarUrl} alt={resource.seller.name} />
                  <AvatarFallback>{resource.seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Sold by {resource.seller.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Member since {new Date(resource.seller.memberSince).toLocaleDateString()}</p>
                </div>
              </CardHeader>
            </Card>

            <Button variant="link" className="text-xs text-muted-foreground pl-0 mt-2">
              Report this listing
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom Section - Description and Details */}
      <div className="mt-12">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="md:col-span-2">
                <h2 className="text-2xl font-bold font-headline mb-4">Description</h2>
                <p className="text-foreground/80 leading-relaxed">
                    {resource.description}
                </p>
            </div>
            <div>
                 <h2 className="text-2xl font-bold font-headline mb-4">Details</h2>
                 <div className="space-y-3">
                    <div className="flex items-center text-foreground">
                        <Tag className="w-5 h-5 mr-3 text-primary" />
                        <span>Category: <Badge variant="secondary">{resource.category}</Badge></span>
                    </div>
                     <div className="flex items-center text-foreground">
                        <Building className="w-5 h-5 mr-3 text-primary" />
                        <span>Department: <Badge variant="secondary">{resource.department}</Badge></span>
                    </div>
                     <div className="flex items-center text-foreground">
                        <Calendar className="w-5 h-5 mr-3 text-primary" />
                        <span>Semester: <Badge variant="secondary">{resource.semester}</Badge></span>
                    </div>
                 </div>
            </div>
        </div>
      </div>

       {/* AI Recommendations */}
      <div className="mt-16 pt-12 border-t">
          <div className="flex items-center gap-3 mb-8">
              <Lightbulb className="w-8 h-8 text-accent"/>
              <h2 className="text-3xl font-bold font-headline">You Might Also Like</h2>
          </div>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {recommendedResources.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/4">
                <div className="p-1">
                  <Card className="overflow-hidden group transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                     <CardHeader className="p-0 relative">
                        <Link href={`/listings/${item.id}`}>
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            width={600}
                            height={400}
                            className="object-cover w-full h-40"
                            data-ai-hint={item.imageHint}
                          />
                        </Link>
                     </CardHeader>
                      <CardContent className="p-4">
                        <Link href={`/listings/${item.id}`}>
                          <p className="text-md font-bold leading-tight group-hover:text-primary transition-colors truncate">{item.title}</p>
                        </Link>
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center text-lg font-bold text-primary">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {item.price.toFixed(2)}
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600 rounded-full">
                                <Heart className="w-5 h-5" />
                            </Button>
                        </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </div>
  );
}
