'use client';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUser, addDocumentNonBlocking } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { collection, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from "next/image";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  description: z.string().min(20, "Description must be at least 20 characters long."),
  category: z.string().min(1, "Please select a category."),
  department: z.string().min(1, "Please select a department."),
  semester: z.string().min(1, "Please select a semester."),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Price must be a positive number.")
  ),
  images: z
    .custom<FileList>()
    .refine((files) => files && files.length > 0, "At least one image is required.")
    .refine((files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE), `Each file size should be less than 5MB.`)
    .refine((files) => Array.from(files).every((file) => ALLOWED_IMAGE_TYPES.includes(file.type)), "Only .jpg, .jpeg, .png and .webp formats are supported."),
});

export default function SellPage() {
  const { user, firestore, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const storage = getStorage();

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      images: undefined,
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      toast({ variant: 'destructive', title: 'You must be logged in to sell an item.' });
      router.push('/login');
    }
  }, [user, isUserLoading, router, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      form.setValue("images", files);
      const newPreviews = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };
  
  const removeImage = (index: number) => {
    const currentFiles = form.getValues("images");
    if (!currentFiles) return;

    const newFiles = Array.from(currentFiles).filter((_, i) => i !== index);
    const dt = new DataTransfer();
    newFiles.forEach(file => dt.items.add(file));
    
    // This is a bit of a hack as react-hook-form doesn't have a simple way to remove from FileList
    const input = document.querySelector<HTMLInputElement>('#dropzone-file');
    if(input) input.files = dt.files;
    
    form.setValue("images", dt.files);
    
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Authentication error. Please log in again.' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const imageUrls: string[] = [];
      for (const imageFile of Array.from(values.images)) {
        const imageRef = ref(storage, `listings/${user.uid}/${Date.now()}_${imageFile.name}`);
        const uploadResult = await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(uploadResult.ref);
        imageUrls.push(imageUrl);
      }

      const listingsCollection = collection(firestore, 'listings');
      addDocumentNonBlocking(listingsCollection, {
        ...values,
        images: undefined, // Don't save the file list to Firestore
        imageUrls,
        userId: user.uid,
        sellerName: user.displayName,
        sellerAvatarUrl: user.photoURL,
        createdAt: serverTimestamp(),
        isApproved: true, 
      });

      toast({ 
        title: 'Listing Created!',
        description: `Your item "${values.title}" has been successfully listed.`,
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
      setIsSubmitting(false);
    }
  };
  
  if (isUserLoading || !user) {
      return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl animate-fade-in-up">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Sell Your Resource</CardTitle>
          <CardDescription>
            Fill out the details below to list your academic resource on the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Item Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Advanced Calculus Textbook, 2nd Edition" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the item's condition, edition, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Textbooks">Textbooks</SelectItem>
                          <SelectItem value="Notes">Notes</SelectItem>
                          <SelectItem value="Study Aids">Study Aids</SelectItem>
                          <SelectItem value="Equipment">Equipment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Department</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                           <SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Semester</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a semester" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {[...Array(8)].map((_, i) => <SelectItem key={i+1} value={`${i+1}`}>{i+1}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Price (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 3500.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Photos</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-center w-full">
                        <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (MAX 5MB each)</p>
                            </div>
                            <Input id="dropzone-file" type="file" className="hidden" multiple={true} onChange={handleImageChange} disabled={isSubmitting} accept={ALLOWED_IMAGE_TYPES.join(",")} />
                        </Label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative aspect-square group">
                      <Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover rounded-md" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <Button size="lg" type="submit" disabled={isSubmitting} className="w-full text-lg">
                {isSubmitting ? 'Listing Item...' : 'List Item for Sale'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
