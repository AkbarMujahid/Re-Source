'use client';
import { useUser } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useCollection } from '@/firebase';
import type { Listing } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, PlusCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, isUserLoading, firestore } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  const userListingsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'listings'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: userListings, isLoading: areListingsLoading } = useCollection<Listing>(userListingsQuery);

  if (isUserLoading || areListingsLoading) {
    return (
      <div className="container text-center py-12">
        <p className="mt-4 text-muted-foreground">Loading Profile...</p>
      </div>
    );
  }
  
  if (!user) {
    return null; // Redirect is handling this
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold font-headline">{user.displayName}</h1>
          <p className="text-muted-foreground mt-2">{user.email}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold font-headline">My Listings</h2>
            <Button asChild>
                <Link href="/sell">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Listing
                </Link>
            </Button>
        </div>
        
        {userListings && userListings.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {userListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden flex flex-col group transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="p-0 relative">
                  <Link href={`/listings/${listing.id}`}>
                    <Image
                      src={listing.imageUrl}
                      alt={listing.title}
                      width={600}
                      height={400}
                      className="object-cover w-full h-48"
                      data-ai-hint={listing.imageHint}
                    />
                  </Link>
                </CardHeader>
                <CardContent className="pt-4 flex-grow">
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">{listing.department}</Badge>
                    <Badge variant="outline">Sem {listing.semester}</Badge>
                  </div>
                  <Link href={`/listings/${listing.id}`}>
                    <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                      {listing.title}
                    </CardTitle>
                  </Link>
                </CardContent>
                <CardFooter>
                   <div className="flex items-center text-xl font-bold text-primary">
                     <IndianRupee className="w-5 h-5 mr-1" />
                     {listing.price.toFixed(2)}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h2 className="mt-6 text-2xl font-semibold text-muted-foreground">You haven't listed any items yet.</h2>
                <p className="mt-2 text-muted-foreground">Click the button above to sell your first resource!</p>
            </div>
        )}
      </div>
    </div>
  );
}
