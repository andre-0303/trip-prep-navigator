
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin } from 'lucide-react';
import { popularDestinations } from '@/services/checklistService';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface PlaceSearchProps {
  onSubmit: (destination: string) => void;
}

interface NominatimPlace {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

const PlaceSearch: React.FC<PlaceSearchProps> = ({ onSubmit }) => {
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState<NominatimPlace[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const searchPlaces = async (query: string) => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    
    try {
      setIsLoading(true);
      // Using OpenStreetMap's Nominatim API (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`,
        {
          headers: {
            'Accept-Language': 'pt-BR,pt',
            'User-Agent': 'TripPrepNavigator/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Erro ao buscar sugestões');
      }
      
      const data: NominatimPlace[] = await response.json();
      setSuggestions(data);
      setShowSuggestions(data && data.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar sugestões de lugares.",
        variant: "destructive"
      });
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (destination.trim().length >= 3) {
        searchPlaces(destination);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [destination]);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      onSubmit(destination.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: NominatimPlace) => {
    // Extract city or country name from the display_name
    const nameParts = suggestion.display_name.split(', ');
    const placeName = nameParts[0]; // Usually the first part is the place name
    
    setDestination(placeName);
    onSubmit(placeName);
    setShowSuggestions(false);
  };

  const handlePopularDestinationClick = (destination: string) => {
    onSubmit(destination);
    setDestination(destination);
    setShowSuggestions(false);
  };

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-medium text-center text-travel-dark">
              Para onde você vai viajar?
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              Digite qualquer cidade ou país e receba uma checklist personalizada
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ex: Paris, Nova York, Rio de Janeiro..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.place_id}
                      className="px-3 py-2 text-sm hover:bg-travel-light cursor-pointer flex items-center gap-2"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <MapPin className="h-4 w-4 text-travel-blue flex-shrink-0" />
                      <span>{suggestion.display_name}</span>
                    </div>
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="absolute right-3 top-2.5">
                  <div className="h-5 w-5 border-2 border-travel-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <Button type="submit" disabled={isLoading || !destination.trim()}>Gerar Checklist</Button>
          </div>
        </form>

        {/* Popular Destinations */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Destinos Populares:</h3>
          <div className="flex flex-wrap gap-2">
            {popularDestinations.map(destination => (
              <Button 
                key={destination} 
                variant="outline" 
                size="sm"
                className="bg-travel-light text-travel-dark border-travel-teal hover:bg-travel-teal hover:text-white"
                onClick={() => handlePopularDestinationClick(destination)}
              >
                {destination}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceSearch;
