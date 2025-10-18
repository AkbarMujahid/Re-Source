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
import { UploadCloud } from "lucide-react"

export default function SellPage() {
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
          <form className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title" className="font-bold text-lg">Item Title</Label>
              <Input id="title" placeholder="e.g., Advanced Calculus Textbook, 2nd Edition" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="font-bold text-lg">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the item's condition, edition, and any other relevant details."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category" className="font-bold">Category</Label>
                   <Select>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="textbooks">Textbooks</SelectItem>
                        <SelectItem value="notes">Notes</SelectItem>
                        <SelectItem value="study-aids">Study Aids</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="department" className="font-bold">Department</Label>
                   <Select>
                    <SelectTrigger id="department">
                        <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="chem">Chemistry</SelectItem>
                        <SelectItem value="psy">Psychology</SelectItem>
                        <SelectItem value="ece">Electronics</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="semester" className="font-bold">Semester</Label>
                    <Input id="semester" type="number" placeholder="e.g., 3" />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="price" className="font-bold">Price (₹)</Label>
                    <Input id="price" type="number" placeholder="e.g., 3500.00" />
                </div>
            </div>

             <div className="grid gap-2">
              <Label htmlFor="photos" className="font-bold text-lg">Photos</Label>
              <div className="flex items-center justify-center w-full">
                <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    <Input id="dropzone-file" type="file" className="hidden" multiple />
                </Label>
                </div> 
            </div>

          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button size="lg">List Item</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
