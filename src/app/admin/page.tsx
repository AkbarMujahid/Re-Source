'use client';
import { useUser } from '@/firebase';
import { collection, query, where, orderBy, doc, updateDoc, Firestore } from 'firebase/firestore';
import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { AlertCircle, CheckCircle, Clock, ShieldCheck, Inbox, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useCollection } from '@/firebase/firestore/use-collection';

export default function AdminPage() {
    const { firestore, user } = useUser();
    const router = useRouter();
    const { toast } = useToast();

    const userDocRef = useMemo(() => user && firestore ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
    const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

    const reportsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'reports'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: reports, isLoading: areReportsLoading } = useCollection(reportsQuery);
    
    useEffect(() => {
        // Security: Redirect if user is not an admin after loading is complete.
        if (!isUserLoading && userData && !userData.isAdmin) {
            router.replace('/');
        }
    }, [isUserLoading, userData, router]);

    const pendingReports = useMemo(() => reports?.filter(r => r.status === 'pending'), [reports]);
    const resolvedReports = useMemo(() => reports?.filter(r => r.status === 'resolved'), [reports]);

    const isLoading = isUserLoading || areReportsLoading;

    if (isLoading) {
        return <AdminPageSkeleton />;
    }

    // Security: Show access denied if user is not an admin, while redirecting
    if (!isUserLoading && !userData?.isAdmin) {
        return (
            <div className="container text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>
                <p className="mt-2 text-muted-foreground">You do not have permission to view this page. Redirecting...</p>
            </div>
        );
    }
    
    const handleResolveReport = async (reportId: string) => {
        if (!firestore) return;
        const reportRef = doc(firestore, 'reports', reportId);
        try {
            await updateDoc(reportRef, { status: 'resolved' });
            toast({ title: "Report Resolved", description: "The report has been marked as resolved." });
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Error", description: error.message });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-4xl font-bold font-headline mb-2">Admin Panel</h1>
            <p className="text-muted-foreground mb-8">Manage reports and moderate content.</p>

            <Tabs defaultValue="pending">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pending">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Pending Reports ({pendingReports?.length ?? 0})
                    </TabsTrigger>
                    <TabsTrigger value="resolved">
                         <ShieldCheck className="mr-2 h-4 w-4" />
                        Resolved Reports ({resolvedReports?.length ?? 0})
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    <ReportTable reports={pendingReports} onResolve={handleResolveReport} />
                </TabsContent>
                <TabsContent value="resolved">
                    <ReportTable reports={resolvedReports} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ReportTable({ reports, onResolve }: { reports: any[] | null, onResolve?: (reportId: string) => void }) {
    if (!reports || reports.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-lg mt-4">
                <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-6 text-2xl font-semibold text-muted-foreground">All Clear!</h2>
                <p className="mt-2 text-muted-foreground">There are no reports in this category.</p>
            </div>
        );
    }

    return (
        <Card className="mt-4">
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Listing</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>AI Summary</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/listings/${report.reportedListingId}`} className="hover:underline text-primary">
                                        {report.listingTitle}
                                    </Link>
                                </TableCell>
                                <TableCell>{report.reason}</TableCell>
                                <TableCell className="max-w-xs">{report.reportSummary}</TableCell>
                                <TableCell>{new Date(report.createdAt?.seconds * 1000).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    {report.status === 'pending' && onResolve && (
                                        <Button size="sm" onClick={() => onResolve(report.id)}>Mark as Resolved</Button>
                                    )}
                                    {report.status === 'resolved' && (
                                        <Badge variant="secondary">Resolved</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}


function AdminPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-96 mb-8" />
            
            <div className="grid grid-cols-2 gap-4 h-10 mb-4">
                <Skeleton className="h-full w-full"/>
                <Skeleton className="h-full w-full"/>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><Skeleton className="h-5 w-20"/></TableHead>
                                <TableHead><Skeleton className="h-5 w-24"/></TableHead>
                                <TableHead><Skeleton className="h-5 w-32"/></TableHead>
                                <TableHead><Skeleton className="h-5 w-16"/></TableHead>
                                <TableHead className="text-right"><Skeleton className="h-5 w-20 ml-auto"/></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(3)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-40"/></TableCell>
                                    <TableCell><Skeleton className="h-5 w-52"/></TableCell>
                                    <TableCell><Skeleton className="h-5 w-64"/></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-28 ml-auto"/></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
