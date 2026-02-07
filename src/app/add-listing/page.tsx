
"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generatePropertyDescription } from "@/ai/flows/generate-property-description";
import { Loader2, Upload, Sparkles, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AddListingPage() {
  const [loadingAI, setLoadingAI] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "Apartment",
    location: "Algiers",
    price: "",
    beds: "1",
    baths: "1",
    amenities: "Balcony, Wifi",
    description: "",
  });
  const { toast } = useToast();

  const handleAIEnhance = async () => {
    if (!formData.price || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in price and location first.",
        variant: "destructive",
      });
      return;
    }

    setLoadingAI(true);
    try {
      const res = await generatePropertyDescription({
        propertyType: formData.type,
        location: formData.location,
        price: Number(formData.price),
        numBedrooms: Number(formData.beds),
        numBathrooms: Number(formData.baths),
        amenities: formData.amenities,
      });
      setFormData({ ...formData, description: res.description });
    } catch (error) {
      console.error(error);
      toast({ title: "AI Error", description: "Could not generate description.", variant: "destructive" });
    } finally {
      setLoadingAI(false);
    }
  };

  const handleImageUpload = () => {
    setUploading(true);
    // Simulate compression and upload
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "Success",
        description: "Images compressed and uploaded successfully for fast loading.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">List Your <span className="text-primary">Crib</span></h1>
          <p className="text-muted-foreground text-lg">Share your property with thousands of potential renters across Algeria.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="rounded-3xl border-none shadow-xl shadow-primary/5">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Property Details</CardTitle>
                <CardDescription>Tell us about the essential features of your place.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Listing Title</Label>
                    <Input id="title" placeholder="e.g., Luxury Sea View Apartment" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Property Type</Label>
                    <Input id="type" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location (City, Neighborhood)</Label>
                    <Input id="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (Monthly DA)</Label>
                    <Input id="price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="beds">Bedrooms</Label>
                    <Input id="beds" type="number" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baths">Bathrooms</Label>
                    <Input id="baths" type="number" value={formData.baths} onChange={e => setFormData({...formData, baths: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amenities">Amenities</Label>
                    <Input id="amenities" placeholder="Balcony, AC, Parking..." value={formData.amenities} onChange={e => setFormData({...formData, amenities: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="description">Description</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleAIEnhance} 
                      disabled={loadingAI}
                      className="text-primary hover:text-primary/80 font-bold"
                    >
                      {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
                      AI Enhance
                    </Button>
                  </div>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the charm of your property..." 
                    className="min-h-[150px] rounded-2xl" 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-xl shadow-primary/5 overflow-hidden">
              <CardHeader className="bg-secondary/30">
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                  <Upload className="w-6 h-6 text-primary" />
                  Visuals
                </CardTitle>
                <CardDescription>Upload high-quality images. We'll handle the compression for you.</CardDescription>
              </CardHeader>
              <CardContent className="p-12">
                <div 
                  className="border-2 border-dashed border-primary/20 rounded-3xl p-12 text-center space-y-4 hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={handleImageUpload}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                    {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                  </div>
                  <div>
                    <p className="text-xl font-bold">Drop your photos here</p>
                    <p className="text-muted-foreground">or click to browse from your device</p>
                  </div>
                  <div className="flex justify-center gap-4 text-xs font-medium text-muted-foreground pt-4">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Auto-Compression</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Fast Load Enabled</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" size="lg" className="flex-1 rounded-2xl h-14">Save Draft</Button>
              <Button size="lg" className="flex-1 rounded-2xl h-14 font-bold shadow-lg shadow-primary/30">Publish Listing</Button>
            </div>
          </div>

          <aside className="space-y-8">
            <Card className="rounded-3xl border-none shadow-xl shadow-primary/5 bg-primary/5">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">1</div>
                  <p>Bright, clear photos of the main living area attract 3x more interest.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">2</div>
                  <p>Be specific about the location. Mention proximity to landmarks like the Great Mosque or major universities.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">3</div>
                  <p>Use our AI Enhancer to write professional copy that sells the "lifestyle" of the home.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-xl shadow-primary/5">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Safety Guarantee</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>Dzayer Cribs verifies every listing to ensure a safe community for both owners and renters.</p>
                <Button variant="secondary" className="w-full rounded-xl">Learn More</Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
