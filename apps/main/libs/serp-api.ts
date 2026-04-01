import { Place } from "@/lib/types";
const API_BASE_URL = 'http://localhost:6543/api/v1';
export type { Place };

const BLOCKED_DOMAINS = [
  "facebook.com",
  "fbcdn.net",
  "instagram.com",
  "linkedin.com",
  "fbsbx.com",
];

const isValidImageUrl = (url?: string) => {
  if (!url) return false;
  return !BLOCKED_DOMAINS.some((domain) => url.includes(domain));
};

const generateSlug = (title: string) => {
  if (!title) return "unknown-place";
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export async function fetchPlaces(
  query: string,
  location: string = "Mohali, Punjab, India"
): Promise<Place[]> {
  try {
    const searchParams = new URLSearchParams({
      q: query,
      location: location
    });

    const response = await fetch(`${API_BASE_URL}/places/search?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Prevents Next.js from aggressively caching the API response
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend Error (${response.status}):`, errorText);
      throw new Error(`Backend API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Places API Raw Data:", data);
    
    // Normalized Backend Response: { places: [...] }
    const rawPlaces = data?.places;
    
    if (!Array.isArray(rawPlaces)) {
      console.error("Backend Error: 'places' array not found in expected location:", data);
      return [];
    }

    const places = rawPlaces.map((p: any) => ({
      ...p,
      slug: generateSlug(p.title), // Slug generation remains on frontend for client-side routing
      thumbnailUrl: p.thumbnailUrl && p.thumbnailUrl.includes("via.placeholder.com") ? null : p.thumbnailUrl,
    }));

    console.log(`Successfully mapped ${places.length} places for query: ${query}`);
    return places;
  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
}

export async function fetchPlaceImages(placeTitle: string): Promise<string[]> {
  try {
    const searchParams = new URLSearchParams({
      q: placeTitle
    });

    const response = await fetch(`${API_BASE_URL}/places/images?${searchParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch images", response.statusText);
      return [];
    }

    const data = await response.json();
    
    // Normalized Backend Response for Images: { places: [...] }
    const rawPlaces = data?.places;

    if (!Array.isArray(rawPlaces)) {
      console.error("Backend Error: 'places' array not found in fetchPlaceImages:", data);
      return [];
    }

    return rawPlaces
      .map((p: any) => p.thumbnailUrl)
      .filter(Boolean)
      .filter((url: string) => !url.includes("via.placeholder.com"));
  } catch (err) {
    console.error("Error fetching images:", err);
    return [];
  }
}

export async function getPlaceBySlug(slug: string): Promise<Place | null> {
  const places = await fetchPlaces("Best Temples in Mohali and Chandigarh", "Mohali, Punjab, India");
  let found = places.find((p) => p.slug === slug);
  if (found) return found;

  const pilgrimages = await fetchPlaces("Famous Holy Pilgrimage sites in India", "India");
  found = pilgrimages.find((p) => p.slug === slug);
  if (found) return found;

  // Fallback: The place was found via a custom search, so we reverse-engineer the query from the slug
  const queryFromSlug = slug.replace(/-/g, " ");
  const customSearch = await fetchPlaces(`${queryFromSlug} famous places`, "India");
  
  // Try to find the exact match, otherwise return the first best result
  return customSearch.find((p) => p.slug === slug) || customSearch[0] || null;
}


