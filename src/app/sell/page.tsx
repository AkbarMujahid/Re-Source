'use client';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useUser, addDocumentNonBlocking } from "@/firebase"
import { useToast } from "@/hooks/use-toast"
import { UploadCloud } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { collection, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function SellPage() {
  const { user, firestore, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      toast({ variant: 'destructive', title: 'You must be logged in to sell an item.' });
      router.push('/login');
    }
  }, [user, isUserLoading, router, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) {
      // This should not happen due to the useEffect redirect, but it's a good safeguard.
      toast({ variant: 'destructive', title: 'Authentication error. Please log in again.' });
      return;
    }
    if (!title || !description || !category || !department || !semester || !price || !imageFile) {
        toast({ variant: 'destructive', title: 'Please fill all fields and upload an image.' });
        return;
    }

    setIsLoading(true);

    try {
      // 1. Upload image to Firebase Storage
      const storage = getStorage();
      const imageRef = ref(storage, `listings/${user.uid}/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);

      // 2. Add listing to Firestore
      const listingsCollection = collection(firestore, 'listings');
      addDocumentNonBlocking(listingsCollection, {
        title,
        description,
        category,
        department,
        semester,
        price: parseFloat(price),
        imageUrl,
        userId: user.uid,
        sellerName: user.displayName,
        sellerAvatarUrl: user.photoURL,
        createdAt: serverTimestamp(),
        isApproved: true, // Assuming auto-approval for now
      });

      toast({ 
        title: 'Listing Created!',
        description: `Your item "${title}" has been successfully listed.`,
      });
      router.push('/buy');

    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast({
        variant: 'destructive',
        title: 'Error creating listing',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isUserLoading || !user) {
      return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Sell Your Resource</CardTitle>
          <CardDescription>
            Fill out the details below to list your academic resource on the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="title" className="font-bold text-lg">Item Title</Label>
              <Input id="title" placeholder="e.g., Advanced Calculus Textbook, 2nd Edition" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="font-bold text-lg">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the item's condition, edition, and any other relevant details."
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category" className="font-bold">Category</Label>
                   <Select onValueChange={setCategory} value={category} disabled={isLoading}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Textbooks">Textbooks</SelectItem>
                        <SelectItem value="Notes">Notes</SelectItem>
                        <SelectItem value="Study Aids">Study Aids</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="department" className="font-bold">Department</Label>
                   <Select onValueChange={setDepartment} value={department} disabled={isLoading}>
                    <SelectTrigger id="department">
                        <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Psychology">Psychology</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Literature">Literature</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="semester" className="font-bold">Semester</Label>
                     <Select onValueChange={setSemester} value={semester} disabled={isLoading}>
                        <SelectTrigger id="semester">
                            <SelectValue placeholder="Select a semester" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="7">7</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="price" className="font-bold">Price (₹)</Label>
                    <Input id="price" type="number" placeholder="e.g., 3500.00" value={price} onChange={(e) => setPrice(e.target.value)} disabled={isLoading}/>
                </div>
            </div>

             <div className="grid gap-2">
              <Label htmlFor="photos" className="font-bold text-lg">Photos</Label>
              <div className="flex items-center justify-center w-full">
                <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                        {imageFile ? <p className="text-sm text-muted-foreground">{imageFile.name}</p> :
                        <>
                          <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, or any image format</p>
                        </>
                        }
                    </div>
                    <Input id="dropzone-file" type="file" className="hidden" multiple={false} onChange={handleImageChange} disabled={isLoading} accept="image/*" />
                </Label>
                </div> 
            </div>
            <Button size="lg" type="submit" disabled={isLoading}>
              {isLoading ? 'Listing Item...' : 'List Item'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
