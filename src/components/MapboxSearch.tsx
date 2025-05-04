
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin } from 'lucide-react';
import { popularDestinations } from '@/services/checklistService';
import { useToast } from '@/hooks/use-toast';

interface MapboxPlace {
  id: string;
  place_name: string;
  place_type: string[];
  center: [number, number];
}

interface MapboxSearchProps {
  onSubmit: (destination: string) => void;
}

const MapboxSearch: React.FC<MapboxSearchProps> = ({ onSubmit }) => {
  const [destination, setDestination] = useState('');
  const [mapboxToken, setMapboxToken] = useState('');
  const [suggestions, setSuggestions] = useState<MapboxPlace[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenProvided, setTokenProvided] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if token is in localStorage
    const token = localStorage.getItem('mapbox-token');
    if (token) {
      setMapboxToken(token);
      setTokenProvided(true);
    }
  }, []);

  const saveToken = () => {
    if (mapboxToken.trim() === '') {
      toast({
        title: "Token inválido",
        description: "Por favor, insira um token válido do Mapbox",
        variant: "destructive"
      });
      return;
    }
    
    localStorage.setItem('mapbox-token', mapboxToken);
    setTokenProvided(true);
    toast({
      title: "Token salvo!",
      description: "Seu token Mapbox foi salvo com sucesso."
    });
  };
  
  const searchMapbox = async (query: string) => {
    if (!mapboxToken || query.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&types=place,country,region&language=pt`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao buscar sugestões');
      }
      
      const data = await response.json();
      setSuggestions(data.features || []);
      setShowSuggestions(data.features && data.features.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar sugestões. Verifique seu token.",
        variant: "destructive"
      });
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (destination.trim().length >= 3 && tokenProvided) {
        searchMapbox(destination);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [destination, tokenProvided]);
  
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
    if (destination.trim() && tokenProvided) {
      onSubmit(destination.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: MapboxPlace) => {
    const placeName = suggestion.place_name.split(',')[0]; // Get first part of the address
    setDestination(placeName);
    onSubmit(placeName);
    setShowSuggestions(false);
  };

  const handlePopularDestinationClick = (destination: string) => {
    onSubmit(destination);
    setDestination(destination);
    setShowSuggestions(false);
  };
  
  if (!tokenProvided) {
    return (
      <Card className="bg-white shadow-md">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-medium text-center text-travel-dark">
                Configuração do Mapbox
              </h2>
              <p className="text-muted-foreground text-center text-sm">
                Para usar a busca de lugares, você precisa fornecer um token de acesso do Mapbox:
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  placeholder="Cole seu token do Mapbox aqui"
                  className="flex-1 px-3 py-2 border rounded-md"
                />
                <Button onClick={saveToken}>Salvar</Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                Para obter um token, crie uma conta em <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-travel-blue underline">mapbox.com</a> e acesse a seção de tokens no dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <input
                ref={inputRef}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ex: Paris, Nova York, Rio de Janeiro..."
                className="w-full pl-10 px-3 py-2 border rounded-md"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="px-3 py-2 text-sm hover:bg-travel-light cursor-pointer flex items-center gap-2"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <MapPin className="h-4 w-4 text-travel-blue flex-shrink-0" />
                      <span>{suggestion.place_name}</span>
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

export default MapboxSearch;
