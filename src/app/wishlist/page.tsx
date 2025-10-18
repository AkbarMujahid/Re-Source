import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, IndianRupee, BookOpen, Calendar } from 'lucide-react';
import Link from 'next/link';

const wishlistItems = [
  {
    id: '2',
    title: 'Organic Chemistry Model Kit',
    category: 'Study Aids',
    department: 'Chemistry',
    semester: '2',
    price: 2000,
    imageUrl: 'https://picsum.photos/seed/2/600/400',
    imageHint: 'chemistry kit',
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
  },
];

export default function WishlistPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-headline">My Wishlist</h1>
        <p className="text-muted-foreground mt-2">The resources you're keeping an eye on.</p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {wishlistItems.map((resource) => (
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
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/50 hover:bg-white rounded-full text-destructive-foreground"
                >
                  <X className="w-5 h-5" />
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
                  <BookOpen className="w-5 h-5" />
                  {resource.category}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold text-muted-foreground">Your Wishlist is Empty</h2>
          <p className="mt-2 text-muted-foreground">Start browsing to find resources you'd like to save!</p>
          <Link href="/">
            <Button className="mt-6">Browse Resources</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
