import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Sparkles, Home as HomeIcon } from "lucide-react";
import { FeaturedRecommendations } from "@/components/property/FeaturedRecommendations";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto text-center max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles className="w-4 h-4" />
            Elevating Real Estate in Algeria
          </div>
          
          <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
            Find Your Dream <span className="text-primary italic">Crib</span> in Algeria
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            From modern Algiers apartments to cozy Oran villas, discover curated rental listings that feel like home.
          </p>

          <div className="max-w-3xl mx-auto p-2 bg-white rounded-3xl shadow-2xl shadow-primary/10 flex flex-col md:flex-row gap-2 animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="flex-1 flex items-center px-4 gap-2">
              <Search className="text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Search by city, neighborhood..." 
                className="border-none shadow-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="flex-1 flex items-center px-4 gap-2 md:border-l">
              <MapPin className="text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Property Type" 
                className="border-none shadow-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground/60"
              />
            </div>
            <Button size="lg" className="rounded-2xl px-10 h-14 text-lg font-bold shadow-lg shadow-primary/30">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="space-y-2">
              <h2 className="text-4xl font-headline font-bold">Featured <span className="text-primary">Cribs</span></h2>
              <p className="text-muted-foreground">Hand-picked properties for your lifestyle.</p>
            </div>
            <Button variant="link" asChild className="text-primary font-bold text-lg">
              <Link href="/properties">View All Properties →</Link>
            </Button>
          </div>
          
          <FeaturedRecommendations />
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline font-bold mb-12">Newest on <span className="text-primary">Dzayer Cribs</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PlaceHolderImages.map((img, i) => (
              <PropertyCard
                key={img.id}
                id={img.id}
                title={img.description.split('in')[0]}
                location={img.description.split('in')[1] || "Algeria"}
                price={85000 + (i * 12000)}
                beds={i + 1}
                baths={Math.max(1, i)}
                sqft={80 + (i * 20)}
                image={img.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/50 pt-20 pb-10 mt-auto border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
                  <HomeIcon className="w-6 h-6" />
                </div>
                <span className="text-2xl font-headline font-bold text-foreground tracking-tight">
                  Dzayer <span className="text-primary">Cribs</span>
                </span>
              </Link>
              <p className="text-muted-foreground leading-relaxed">
                Modernizing the rental experience in Algeria. Discover elegance, comfort, and ease.
              </p>
            </div>
            <div>
              <h4 className="font-headline font-bold mb-6 text-lg">Platform</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/properties" className="hover:text-primary transition-colors">Find a Home</Link></li>
                <li><Link href="/add-listing" className="hover:text-primary transition-colors">List Your Place</Link></li>
                <li><Link href="/map" className="hover:text-primary transition-colors">Explore on Map</Link></li>
                <li><Link href="/ai-suggest" className="hover:text-primary transition-colors">AI Recommendations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-bold mb-6 text-lg">Support</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/faq" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-primary transition-colors">Safety Tips</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline font-bold mb-6 text-lg">Newsletter</h4>
              <p className="text-muted-foreground mb-4">Get the latest cribs in your inbox.</p>
              <div className="flex gap-2">
                <Input placeholder="Email" className="rounded-xl border-none shadow-sm" />
                <Button className="rounded-xl px-4">Join</Button>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} Dzayer Cribs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}