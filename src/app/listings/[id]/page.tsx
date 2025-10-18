
'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Tag, Book, Building, Calendar, IndianRupee, Lightbulb, AlertCircle, Send } from 'lucide-react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useDoc, useUser } from '@/firebase';
import { doc, collection, query, orderBy, addDoc, arrayUnion, arrayRemove, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { useMemo, useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { suggestResourceRecommendations } from '@/ai/flows/suggest-resource-recommendations';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { ChatMessage, Listing, UserProfile } from '@/lib/types';


function ChatArea({ listingId }: { listingId: string }) {
  const { user, firestore, isUserLoading } = useUser();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useMemo(() => {
    if (!firestore || !listingId) return null;
    return query(collection(firestore, 'listings', listingId, 'messages'), orderBy('timestamp', 'asc'));
  }, [firestore, listingId]);

  const { data: messages, isLoading: areMessagesLoading } = useCollection<ChatMessage>(messagesQuery);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || !listingId || newMessage.trim() === '') return;

    const messagesCollection = collection(firestore, 'listings', listingId, 'messages');
    const messageData = {
      senderId: user.uid,
      senderName: user.displayName || 'Anonymous',
      senderAvatar: user.photoURL || '',
      text: newMessage,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(messagesCollection, messageData);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const isLoading = isUserLoading || areMessagesLoading;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Discussion</CardTitle>
      </CardHeader>
      <CardContent className="h-96 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-16 w-3/4 ml-auto" />
            <Skeleton className="h-16 w-3/4" />
          </div>
        ) : (
          messages?.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3',
                message.senderId === user?.uid ? 'justify-end' : 'justify-start'
              )}
            >
              {message.senderId !== user?.uid && (
                 <Avatar className="h-8 w-8 border">
                    <AvatarImage src={message.senderAvatar} />
                    <AvatarFallback>{message.senderName?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-md rounded-lg px-4 py-2 flex flex-col',
                  message.senderId === user?.uid
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <div className="flex items-center gap-2">
                    <p className="text-sm font-bold">{message.senderName}</p>
                    <p className='text-xs text-muted-foreground/80'>
                        {message.timestamp ? format(new Date(message.timestamp.seconds * 1000), 'p') : ''}
                    </p>
                </div>
                <p className="text-sm">{message.text}</p>
              </div>
               {message.senderId === user?.uid && (
                 <Avatar className="h-8 w-8 border">
                    <AvatarImage src={message.senderAvatar} />
                    <AvatarFallback>{message.senderName?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask a question about this item..."
            autoComplete="off"
            disabled={isLoading || !user}
          />
          <Button type="submit" size="icon" disabled={isLoading || !newMessage.trim() || !user}>
            <Send />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}


export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const { user, firestore, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [aiRecommendations, setAiRecommendations] = useState<any[] | null>(null);
  const [areRecsLoading, setAreRecsLoading] = useState(false);

  const resourceRef = useMemo(() => firestore ? doc(firestore, 'listings', params.id) : null, [firestore, params.id]);
  const { data: resource, isLoading: isResourceLoading } = useDoc<Listing>(resourceRef);

  const allListingsCollection = useMemo(() => firestore ? collection(firestore, 'listings') : null, [firestore]);
  const { data: allListings } = useCollection<Listing>(allListingsCollection);

  const wishlistRef = useMemo(() => user && firestore ? doc(firestore, "users", user.uid, "wishlists", user.uid) : null, [firestore, user]);
  const { data: wishlist, isLoading: isWishlistLoading } = useDoc(wishlistRef);

  const isInWishlist = useMemo(() => {
    return wishlist?.listingIds?.includes(params.id);
  }, [wishlist, params.id]);
  
  const handleWishlistToggle = async () => {
    if (!user || !wishlistRef || !firestore) {
      toast({ variant: 'destructive', title: 'Please login to use wishlists.' });
      router.push('/login');
      return;
    }
    
    const wishlistSnap = await getDoc(wishlistRef);
    
    try {
      if (!wishlistSnap.exists()) {
          await setDoc(wishlistRef, { userId: user.uid, listingIds: [] });
      }
    
      if (isInWishlist) {
        await updateDoc(wishlistRef, { listingIds: arrayRemove(params.id) });
        toast({ title: 'Removed from wishlist.' });
      } else {
        await updateDoc(wishlistRef, {
          listingIds: arrayUnion(params.id),
        });
        toast({ title: 'Added to wishlist!' });
      }
    } catch (error) {
        console.error("Error toggling wishlist:", error);
        toast({ variant: "destructive", title: "Could not update wishlist." });
    }
  };

  const fetchRecommendations = async () => {
      if (!resource || !allListings) return;
      setAreRecsLoading(true);
      try {
        const userActivity = `The user is currently viewing the listing '${resource.title}' in the '${resource.department}' department.`;
        const availableResources = allListings
            .filter(listing => listing.id !== resource.id)
            .map(listing => `${listing.title} (${listing.category}, ${listing.department}, Sem ${listing.semester}, ₹${listing.price})`)
            .join('\n');

        const { recommendations: recTitles } = await suggestResourceRecommendations({ userActivity, availableResources });
        
        // Find full listing objects from titles
        const recommendedListings = allListings.filter(listing => recTitles.some(rec => rec.includes(listing.title)));

        setAiRecommendations(recommendedListings);

      } catch (error) {
        console.error("Error fetching AI recommendations:", error);
        setAiRecommendations([]); // Avoid retrying on error
      } finally {
        setAreRecsLoading(false);
      }
    };

    useEffect(() => {
        if (resource && allListings && !aiRecommendations && !areRecsLoading) {
            fetchRecommendations();
        }
    }, [resource, allListings, aiRecommendations, areRecsLoading]);


  if (isResourceLoading) {
    return <ListingDetailSkeleton />;
  }

  if (!resource) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-2xl font-bold">Listing not found</h1>
        <p className="mt-2 text-muted-foreground">This listing may have been removed or the link is incorrect.</p>
        <Button asChild className="mt-6">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }
  
    const sellerRef = useMemo(() => firestore && resource ? doc(firestore, 'users', resource.userId) : null, [firestore, resource]);
    const {data: seller} = useDoc<UserProfile>(sellerRef);


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
              <IndianRupee className="w-7 h-7 mr-2" />
              {resource.price.toFixed(2)}
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <Button variant={isInWishlist ? "secondary" : "outline"} size="lg" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-200 hover:border-rose-300 flex-1" onClick={handleWishlistToggle} disabled={isWishlistLoading || isUserLoading}>
                <Heart className={`mr-2 h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                <span>{isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Seller Info */}
            <Card className="bg-background">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={seller?.photoURL || undefined} alt={seller?.displayName || undefined} />
                  <AvatarFallback>{seller?.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Sold by {seller?.displayName || '...'}</CardTitle>
                </div>
              </CardHeader>
            </Card>
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
                 <ChatArea listingId={params.id} />
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
       {(areRecsLoading || (aiRecommendations && aiRecommendations.length > 0)) && (
          <div className="mt-16 pt-12 border-t">
              <div className="flex items-center gap-3 mb-8">
                  <Lightbulb className="w-8 h-8 text-accent"/>
                  <h2 className="text-3xl font-bold font-headline">You Might Also Like</h2>
              </div>
            {areRecsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <Skeleton className="h-40 w-full" />
                            <CardContent className="p-4">
                                <Skeleton className="h-5 w-3/4 mb-2" />
                                <Skeleton className="h-5 w-1/4" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
                >
                <CarouselContent>
                    {aiRecommendations?.map((item) => (
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
                                        <IndianRupee className="w-4 h-4 mr-1" />
                                        {item.price.toFixed(2)}
                                    </div>
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
            )}
          </div>
        )}
    </div>
  );
}

function ListingDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2">
          <Skeleton className="w-full h-[400px] md:h-[600px] rounded-lg" />
        </div>
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-8 w-1/2 mb-4" />
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-12 flex-1" />
            </div>
            <Separator className="my-6" />
            <Card className="bg-background">
              <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="w-full">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="md:col-span-2">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div>
            <Skeleton className="h-8 w-1/3 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
