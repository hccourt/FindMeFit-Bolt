import { Location } from './types';

const NOMINATIM_API = 'https://nominatim.openstreetmap.org';

const VENUE_CATEGORIES = [
  'leisure=fitness_centre',
  'leisure=sports_centre',
  'leisure=stadium',
  'leisure=gym',
  'amenity=gym',
  'sport=fitness',
  'building=sports_hall'
];

export interface GeocodingResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  category?: string;
  importance: number;
  address?: {
    city?: string;
    town?: string;
    state?: string;
    country?: string;
    country_code?: string;
    road?: string;
    house_number?: string;
    postcode?: string;
  };
}

// Function to normalize text for comparison
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .trim();
}

// Function to calculate similarity between two strings
function stringSimilarity(str1: string, str2: string): number {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  const pairs1 = new Set();
  const pairs2 = new Set();
  
  for (let i = 0; i < s1.length - 1; i++) {
    pairs1.add(s1.slice(i, i + 2));
  }
  
  for (let i = 0; i < s2.length - 1; i++) {
    pairs2.add(s2.slice(i, i + 2));
  }
  
  const intersection = new Set([...pairs1].filter(x => pairs2.has(x)));
  const union = new Set([...pairs1, ...pairs2]);
  
  return intersection.size / union.size;
}

export async function searchLocations(query: string): Promise<Location[]> {
  if (!query || query.length < 2) return [];
  
  // Create venue-specific search queries
  const queries = VENUE_CATEGORIES.map(category => ({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '5',
    'accept-language': 'en',
    countrycodes: 'gb,us,ca,au,nz,ie', // Limit to English-speaking countries for better results
    dedupe: '1',
    ['category']: category
  }));
  
  try {
    // Make parallel requests for each venue category
    const responses = await Promise.all(
      queries.map(params => 
        fetch(`${NOMINATIM_API}/search?${new URLSearchParams(params)}`)
          .then(res => res.json())
          .catch(() => [])
      )
    );
    
    // Combine and deduplicate results
    const allResults: GeocodingResult[] = Array.from(
      new Set(responses.flat().map(r => r.place_id))
    ).map(id => responses.flat().find(r => r.place_id === id));
    
    // Process and filter results based on similarity
    const processedResults = allResults
      .map(result => {
        // Construct a detailed venue name
        const venueName = result.display_name.split(',')[0];
        const address = [
          result.address?.road,
          result.address?.house_number,
          result.address?.postcode
        ].filter(Boolean).join(' ');
        
        const similarity = stringSimilarity(venueName, query);
        
        // Get parent location (state/region and country)
        const parentName = [
          address,
          result.address?.state,
          result.address?.country
        ].filter(Boolean).join(', ');
        
        return {
          similarity,
          location: {
            id: `loc-${result.place_id}`,
            name: venueName,
            type: 'venue',
            parent: {
              id: result.osm_type,
              name: parentName,
              type: 'address',
            },
            coordinates: {
              latitude: parseFloat(result.lat),
              longitude: parseFloat(result.lon),
            },
          },
        };
      })
      .filter(({ similarity }) => similarity > 0.2)
      .sort((a, b) => {
        // Sort by similarity and then by name length (prefer shorter names)
        if (Math.abs(b.similarity - a.similarity) > 0.1) {
          return b.similarity - a.similarity;
        }
        return a.location.name.length - b.location.name.length;
      })
      .slice(0, 10); // Take top 10 results
    
    return processedResults.map(result => result.location);
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}