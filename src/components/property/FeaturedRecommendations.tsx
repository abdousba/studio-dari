
"use client";

import { useEffect, useState } from "react";
import { suggestProperties, type SuggestedPropertiesOutput } from "@/ai/flows/ai-suggested-properties";
import { PropertyCard } from "./PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function FeaturedRecommendations() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAIRecommendations() {
      try {
        const result = await suggestProperties({
          searchHistory: "Searching for modern apartments in Algiers and villas in Oran",
          savedProperties: "Modern sea view apartment Algiers",
          userPreferences: "Prefers quiet areas with good views and close to parks",
        });
        setRecommendations(result.suggestedProperties);
      } catch (error) {
        console.error("AI recommendation failed", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAIRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[4/3] rounded-3xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-primary font-bold">
        <Sparkles className="w-5 h-5" />
        <span className="uppercase tracking-widest text-sm font-headline">AI-Powered For You</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.slice(0, 3).map((propName, idx) => (
          <PropertyCard
            key={idx}
            id={`ai-${idx}`}
            title={propName}
            location="Algiers, Algeria"
            price={120000 + idx * 5000}
            beds={2 + (idx % 2)}
            baths={1 + (idx % 2)}
            sqft={110 + idx * 10}
            image={PlaceHolderImages[idx % PlaceHolderImages.length].imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
