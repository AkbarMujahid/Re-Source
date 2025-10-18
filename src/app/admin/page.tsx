'use client';
import { useUser } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc, Firestore } from 'firebase/firestore';
import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { AlertCircle, CheckCircle, Clock, ShieldCheck, Inbox, MessageSquare, Users, Package, LayoutDashboard, IndianRupee } from 'lucide-react';
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
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useCollection } from '@/firebase/firestore/use-collection';
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
  } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';


export default function AdminPage() {
    const { firestore, user } = useUser();
    const router = useRouter();
    const { toast } = useToast();

    const userDocRef = useMemo(() => user && firestore ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
    const { data: userData, isLoading: isUserLoading } = useDoc(userDocRef);

    const reportsQuery = useMemo(() => firestore ? query(collection(firestore, 'reports'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: reports, isLoading: areReportsLoading } = useCollection(reportsQuery);

    const usersQuery = useMemo(() => firestore ? query(collection(firestore, 'users'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: users, isLoading: areUsersLoading } = useCollection(usersQuery);

    const listingsQuery = useMemo(() => firestore ? query(collection(firestore, 'listings'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: listings, isLoading: areListingsLoading } = useCollection(listingsQuery);
    
    useEffect(() => {
        if (!isUserLoading && userData && !userData.isAdmin) {
            router.replace('/');
        }
    }, [isUserLoading, userData, router]);

    const pendingReports = useMemo(() => reports?.filter(r => r.status === 'pending'), [reports]);
    const resolvedReports = useMemo(() => reports?.filter(r => r.status === 'resolved'), [reports]);

    const isLoading = isUserLoading || areReportsLoading || areUsersLoading || areListingsLoading;

    if (isLoading) {
        return <AdminPageSkeleton />;
    }
    
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
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                <Tabs defaultValue="dashboard" className="col-span-2">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</TabsTrigger>
                        <TabsTrigger value="listings"><Package className="mr-2 h-4 w-4" />Listings</TabsTrigger>
                        <TabsTrigger value="users"><Users className="mr-2 h-4 w-4" />Users</TabsTrigger>
                        <TabsTrigger value="reports"><ShieldCheck className="mr-2 h-4 w-4" />Reports</TabsTrigger>
                    </TabsList>
                    <TabsContent value="dashboard">
                        <DashboardContent users={users} listings={listings} reports={reports} />
                    </TabsContent>
                    <TabsContent value="listings">
                        <ListingsTable listings={listings} />
                    </TabsContent>
                    <TabsContent value="users">
                        <UsersTable users={users} />
                    </TabsContent>
                    <TabsContent value="reports">
                         <Tabs defaultValue="pending" className="mt-4">
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
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}

function DashboardContent({ users, listings, reports }: { users: any[] | null, listings: any[] | null, reports: any[] | null }) {
    
    const totalRevenue = useMemo(() => listings?.reduce((acc, listing) => acc + listing.price, 0) || 0, [listings]);
    const listingsPerCategory = useMemo(() => {
        const counts: {[key: string]: number} = {};
        listings?.forEach(listing => {
            counts[listing.category] = (counts[listing.category] || 0) + 1;
        });
        return Object.entries(counts).map(([name, total]) => ({ name, total }));
    }, [listings]);

    const chartConfig = {
        total: {
          label: "Listings",
          color: "hsl(var(--chart-1))",
        },
      } satisfies import("@/components/ui/chart").ChartConfig

    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Total from all listings</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Listings</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{listings?.length ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Total listings on the platform</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{users?.length ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Total registered users</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{reports?.filter(r => r.status === 'pending').length ?? 0}</div>
                    <p className="text-xs text-muted-foreground">Reports needing review</p>
                </CardContent>
            </Card>

            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Listings per Category</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                     <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <BarChart accessibilityLayer data={listingsPerCategory}>
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 15)}
                            />
                            <YAxis />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dashed" />}
                            />
                            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}

function ListingsTable({ listings }: { listings: any[] | null }) {
     if (!listings || listings.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-lg mt-4">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-6 text-2xl font-semibold text-muted-foreground">No Listings Found</h2>
                <p className="mt-2 text-muted-foreground">There are no listings on the platform yet.</p>
            </div>
        );
    }
    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>All Listings</CardTitle>
                <CardDescription>A list of all resources currently on the marketplace.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Seller</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {listings.map((listing) => (
                            <TableRow key={listing.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/listings/${listing.id}`} className="hover:underline text-primary">
                                        {listing.title}
                                    </Link>
                                </TableCell>
                                <TableCell>{listing.sellerName}</TableCell>
                                <TableCell><Badge variant="outline">{listing.category}</Badge></TableCell>
                                <TableCell><Badge variant="secondary">{listing.department}</Badge></TableCell>
                                <TableCell className="text-right">₹{listing.price.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}


function UsersTable({ users }: { users: any[] | null }) {
    if (!users || users.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-lg mt-4">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-6 text-2xl font-semibold text-muted-foreground">No Users Found</h2>
                <p className="mt-2 text-muted-foreground">There are no registered users on the platform yet.</p>
            </div>
        );
    }

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };


    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>A list of all registered users on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Joined On</TableHead>
                            <TableHead>Admin</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium flex items-center gap-2">
                                     <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                                        <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                                    </Avatar>
                                    {user.displayName}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{new Date(user.createdAt?.seconds * 1000).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {user.isAdmin ? (
                                        <Badge>Admin</Badge>
                                    ) : (
                                        <Badge variant="secondary">User</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
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
            <CardContent className='pt-6'>
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
         <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
                <Skeleton className="h-8 w-48" />
            </div>
             <div className="mx-auto grid w-full max-w-6xl items-start gap-6">
                 <div className="grid grid-cols-4 gap-2 h-10">
                    <Skeleton className="h-full w-full"/>
                    <Skeleton className="h-full w-full"/>
                    <Skeleton className="h-full w-full"/>
                    <Skeleton className="h-full w-full"/>
                </div>

                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    <Skeleton className="h-28 w-full"/>
                    <Skeleton className="h-28 w-full"/>
                    <Skeleton className="h-28 w-full"/>
                    <Skeleton className="h-28 w-full"/>
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-full"/></TableCell>
                                        <TableCell><Skeleton className="h-5 w-full"/></TableCell>
                                        <TableCell><Skeleton className="h-5 w-full"/></TableCell>
                                        <TableCell><Skeleton className="h-5 w-full"/></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
