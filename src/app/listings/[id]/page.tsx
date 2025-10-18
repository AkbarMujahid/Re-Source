'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Tag, Book, Building, Calendar, IndianRupee, Lightbulb, AlertCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useDoc, useFirebase, useUser, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { doc, collection, query, where, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { suggestResourceRecommendations } from '@/ai/flows/suggest-resource-recommendations';
import { generateModerationReport } from '@/ai/flows/generate-moderation-report';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState<any[] | null>(null);
  const [areRecsLoading, setAreRecsLoading] = useState(false);

  const resourceRef = useMemo(() => doc(firestore, 'listings', params.id), [firestore, params.id]);
  const { data: resource, isLoading: isResourceLoading } = useDoc(resourceRef);

  const allListingsCollection = useMemo(() => collection(firestore, 'listings'), [firestore]);
  const { data: allListings } = useCollection(allListingsCollection);

  const wishlistRef = useMemo(() => user ? doc(firestore, "wishlists", user.uid) : null, [firestore, user]);
  const { data: wishlist, isLoading: isWishlistLoading } = useDoc(wishlistRef);

  const isInWishlist = useMemo(() => {
    return wishlist?.listingIds?.includes(params.id);
  }, [wishlist, params.id]);
  
  const handleWishlistToggle = async () => {
    if (!user || !wishlistRef) {
      toast({ variant: 'destructive', title: 'Please login to use wishlists.' });
      router.push('/login');
      return;
    }
  
    if (isInWishlist) {
      updateDocumentNonBlocking(wishlistRef, { listingIds: arrayRemove(params.id) });
      toast({ title: 'Removed from wishlist.' });
    } else {
      updateDocumentNonBlocking(wishlistRef, {
        userId: user.uid,
        listingIds: arrayUnion(params.id),
      }, { merge: true });
      toast({ title: 'Added to wishlist!' });
    }
  };

  const handleReportListing = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'You must be logged in to report content.' });
      router.push('/login');
      return;
    }
    if (!resource) return;

    setIsReporting(true);
    try {
      // 1. Generate AI summary for the report
      const reportInput = {
        reports: [{
          reporterId: user.uid,
          reportedContentId: resource.id,
          contentType: 'listing' as 'listing' | 'user',
          reason: reportReason
        }]
      };
      const { summary } = await generateModerationReport(reportInput);

      // 2. Save the structured report to Firestore
      const reportsCollection = collection(firestore, 'reports');
      addDocumentNonBlocking(reportsCollection, {
        reporterId: user.uid,
        reportedListingId: resource.id,
        reportedUserId: resource.userId,
        reportSummary: summary,
        reason: reportReason,
        listingTitle: resource.title,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      
      toast({ title: 'Report submitted', description: 'Thank you for helping keep our community safe.' });
      setReportReason(''); // Clear the textarea

    } catch (error: any) {
      console.error("Error submitting report:", error);
      toast({ variant: 'destructive', title: 'Error submitting report', description: error.message });
    } finally {
      setIsReporting(false);
    }
  };
  
  const fetchRecommendations = async () => {
      if (!resource || !allListings || !user) return;
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

    // Fetch recommendations when resource data is available
    useMemo(() => {
        if (resource && allListings && user && !aiRecommendations) {
            fetchRecommendations();
        }
    }, [resource, allListings, user, aiRecommendations]);


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
              <Button size="lg" className="flex-1">
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact Seller
              </Button>
              <Button variant={isInWishlist ? "secondary" : "outline"} size="lg" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-200 hover:border-rose-300" onClick={handleWishlistToggle} disabled={isWishlistLoading}>
                <Heart className={`mr-2 h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                <span className='hidden sm:inline'>{isInWishlist ? 'In Wishlist' : 'Wishlist'}</span>
              </Button>
            </div>

            <Separator className="my-6" />

            {/* Seller Info */}
            <Card className="bg-background">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={resource.sellerAvatarUrl} alt={resource.sellerName} />
                  <AvatarFallback>{resource.sellerName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Sold by {resource.sellerName}</CardTitle>
                </div>
              </CardHeader>
            </Card>

             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="link" className="text-xs text-muted-foreground pl-0 mt-2">
                   <ShieldAlert className="mr-1 h-4 w-4" /> Report this listing
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Report this listing</AlertDialogTitle>
                  <AlertDialogDescription>
                    Describe why you are reporting this listing. Your report will be sent to administrators for review.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="report-reason">Reason</Label>
                    <Textarea 
                      id="report-reason" 
                      placeholder="e.g., This is inappropriate content." 
                      value={reportReason} 
                      onChange={(e) => setReportReason(e.target.value)}
                      disabled={isReporting}
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReportListing} disabled={isReporting || !reportReason}>
                    {isReporting ? 'Submitting...' : 'Submit Report'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
       {(areRecsLoading || (aiRecommendations && aiRecommendations.length > 0)) && (
          <div className="mt-16 pt-12 border-t">
              <div className="flex items-center gap-3 mb-8">
                  <Lightbulb className="w-8 h-8 text-accent"/>
                  <h2 className="text-3xl font-bold font-headline">You Might Also Like</h2>
              </div>
            {areRecsLoading ? (
                <div className="text-center">
                    <p className="text-muted-foreground">Generating AI recommendations...</p>
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
              <Skeleton className="h-12 w-24" />
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
