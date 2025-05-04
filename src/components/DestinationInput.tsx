
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { suggestedDestinations } from '@/services/checklistService';
import { Search } from 'lucide-react';

interface DestinationInputProps {
  onSubmit: (destination: string) => void;
}

const DestinationInput: React.FC<DestinationInputProps> = ({ onSubmit }) => {
  const [destination, setDestination] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
                onFocus={() => setShowSuggestions(true)}
                placeholder="Ex: Praia, Nova York, Serra..."
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              
              {showSuggestions && (
                <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10">
                  <div className="p-2 text-xs text-muted-foreground">
                    Sugestões:
                  </div>
                  {suggestedDestinations.map(suggestion => (
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
      </CardContent>
    </Card>
  );
};

export default DestinationInput;
