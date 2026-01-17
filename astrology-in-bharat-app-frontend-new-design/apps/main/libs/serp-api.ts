const SERPER_API_KEY = "d8af18e43b74b92ebc1bd50f76849a84241133e7";
const CACHE_KEY_PREFIX = "famous_places_cache_";
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export interface Place {
  title: string;
  address: string;
  rating?: number;
  ratingCount?: number;
  category: string;
  thumbnailUrl?: string;
  cid?: string;
  slug?: string;
  position?: number;
  images?: string[];
}

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
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const getCachedData = (key: string) => {
  if (typeof window === "undefined") return null;
  const cached = localStorage.getItem(CACHE_KEY_PREFIX + key);
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
    localStorage.removeItem(CACHE_KEY_PREFIX + key);
  } catch (e) {
    console.error("Error parsing cache", e);
  }
  return null;
};

const setCachedData = (key: string, data: unknown) => {
  if (typeof window === "undefined") return;
  const cacheObj = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(cacheObj));
};

export async function fetchPlaces(
  query: string,
  location: string = "Mohali, Punjab, India"
): Promise<Place[]> {
  const cacheKey = `${query}_${location}`.toLowerCase().replace(/\s+/g, "_");
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch("https://google.serper.dev/places", {
      method: "POST",
      headers: {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        location: location,
        gl: "in",
      }),
    });
    const data = await response.json();
    const places = (data.places || []).map((p: Place) => ({
      ...p,
      thumbnailUrl: isValidImageUrl(p.thumbnailUrl)
        ? p.thumbnailUrl
        : undefined,
      slug: generateSlug(p.title),
    }));

    setCachedData(cacheKey, places);
    return places;
  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
}

export async function fetchPlaceImages(placeTitle: string): Promise<string[]> {
  const cacheKey = `images_${placeTitle}`.toLowerCase().replace(/\s+/g, "_");
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch("https://google.serper.dev/images", {
      method: "POST",
      headers: {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: placeTitle + " exterior real photo",
        num: 5,
      }),
    });
    const data = await response.json();
    const images = (data.images || [])
      .map((img: { imageUrl: string }) => img.imageUrl)
      .filter(isValidImageUrl);

    setCachedData(cacheKey, images);
    return images;
  } catch (err) {
    console.error("Error fetching images:", err);
    return [];
  }
}

export function getAllCachedPlaces(): Place[] {
  if (typeof window === "undefined") return [];
  const places: Place[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_KEY_PREFIX) && !key.includes("images_")) {
      try {
        const { data } = JSON.parse(localStorage.getItem(key)!);
        if (Array.isArray(data)) {
          places.push(...data);
        }
      } catch {
        // Silently fail for individual cache entry parsing errors
      }
    }
  }
  return places;
}

export function getPlaceBySlug(slug: string): Place | null {
  const cached = getAllCachedPlaces();
  return cached.find((p) => p.slug === slug) || null;
}
