'use client';
import { useUser } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { AlertCircle, Users, Package, FileText, DollarSign, BarChart } from 'lucide-react';
import { useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const ADMIN_UID = 'xqBCK8gcsgQGfVFFan33QsQAqlC3';

export default function AdminPage() {
  const { user, isUserLoading, firestore } = useUser();
  const router = useRouter();

  const usersCollection = useMemo(() => firestore ? collection(firestore, 'users') : null, [firestore]);
  const { data: users, isLoading: areUsersLoading } = useCollection(usersCollection);

  const listingsCollection = useMemo(() => firestore ? collection(firestore, 'listings') : null, [firestore]);
  const { data: listings, isLoading: areListingsLoading } = useCollection(listingsCollection);

  const reportsCollection = useMemo(() => firestore ? collection(firestore, 'reports') : null, [firestore]);
  const { data: reports, isLoading: areReportsLoading } = useCollection(reportsCollection);

  useEffect(() => {
    if (!isUserLoading && user?.uid !== ADMIN_UID) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user?.uid !== ADMIN_UID) {
    return (
      <div className="container text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Loading or checking permissions...</p>
      </div>
    );
  }

  const totalUsers = users?.length || 0;
  const totalListings = listings?.length || 0;
  const totalReports = reports?.length || 0;
  const totalRevenue = listings?.reduce((sum, item) => sum + item.price, 0) || 0;

  const listingsPerCategory = useMemo(() => {
    if (!listings) return [];
    const counts = listings.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [listings]);

  const chartConfig = {
    value: { label: 'Listings' },
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">Admin Panel</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{areUsersLoading ? '...' : totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{areListingsLoading ? '...' : totalListings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{areListingsLoading ? '...' : totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{areReportsLoading ? '...' : totalReports}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Listings per Category</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <RechartsBarChart accessibilityLayer data={listingsPerCategory}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value, hsl(var(--primary)))" radius={4} />
                </RechartsBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>UID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.photoURL} />
                          <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {user.displayName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.uid}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>All Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Seller</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings?.map(listing => (
                    <TableRow key={listing.id}>
                      <TableCell className="font-medium">{listing.title}</TableCell>
                      <TableCell><Badge variant="secondary">{listing.category}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{listing.department}</Badge></TableCell>
                      <TableCell>₹{listing.price.toFixed(2)}</TableCell>
                      <TableCell>{listing.sellerName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reported Items</CardTitle>
            </CardHeader>
            <CardContent>
              {reports && reports.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Listing ID</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Reported By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports?.map(report => (
                      <TableRow key={report.id}>
                        <TableCell>{report.listingId}</TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell>{report.reporterId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No reports found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
