
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { suggestedDestinations, popularDestinations } from '@/services/checklistService';
import { Search } from 'lucide-react';

interface DestinationInputProps {
  onSubmit: (destination: string) => void;
}

const DestinationInput: React.FC<DestinationInputProps> = ({ onSubmit }) => {
  const [destination, setDestination] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim()) {
      onSubmit(destination.trim());
      setDestination('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSubmit(suggestion);
    setDestination('');
    setShowSuggestions(false);
  };

  const handlePopularDestinationClick = (destination: string) => {
    onSubmit(destination);
    setShowSuggestions(false);
  };

  // Filter suggestions based on input
  useEffect(() => {
    if (destination.trim().length > 1) {
      const filtered = suggestedDestinations.filter(
        sugg => sugg.toLowerCase().includes(destination.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
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

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-medium text-center text-travel-dark">
              Para onde você vai viajar?
            </h2>
            <p className="text-muted-foreground text-center text-sm">
              Digite seu destino e receba uma checklist personalizada
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Ex: Florianópolis, Gramado, Paris..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10"
                >
                  {filteredSuggestions.map(suggestion => (
                    <div
                      key={suggestion}
                      className="px-3 py-2 text-sm hover:bg-travel-light cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit">Gerar Checklist</Button>
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

export default DestinationInput;
