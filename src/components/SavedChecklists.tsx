
import { useState, useEffect } from 'react';
import { Destination, determineDestinationType } from '@/services/checklistService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Umbrella, Mountain, Tent, Snowflake, Globe, Building, Plane } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SavedChecklistsProps {
  onSelect: (checklist: Destination) => void;
}

const SavedChecklists: React.FC<SavedChecklistsProps> = ({ onSelect }) => {
  const [savedChecklists, setSavedChecklists] = useState<Destination[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load all checklists from localStorage
    const loadSavedChecklists = () => {
      const checklists: Destination[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key && key.startsWith('checklist-')) {
          try {
            const checklistJson = localStorage.getItem(key);
            if (checklistJson) {
              const checklist = JSON.parse(checklistJson);
              checklists.push(checklist);
            }
          } catch (error) {
            console.error('Error parsing saved checklist:', error);
          }
        }
      }
      
      setSavedChecklists(checklists);
    };
    
    loadSavedChecklists();
    
    // Add event listener to update the list when localStorage changes in another tab
    window.addEventListener('storage', loadSavedChecklists);
    
    return () => {
      window.removeEventListener('storage', loadSavedChecklists);
    };
  }, []);

  const handleDelete = (id: string) => {
    localStorage.removeItem(`checklist-${id}`);
    setSavedChecklists(prev => prev.filter(checklist => checklist.id !== id));
    
    toast({
      title: "Checklist removida",
      description: "A checklist foi removida com sucesso."
    });
  };

  const getDestinationIcon = (type: string) => {
    switch (type) {
      case 'beach': return <Umbrella className="h-5 w-5 text-travel-blue" />;
      case 'mountain': return <Mountain className="h-5 w-5 text-travel-teal" />;
      case 'camping': return <Tent className="h-5 w-5 text-travel-blue" />;
      case 'winter': return <Snowflake className="h-5 w-5 text-travel-teal" />;
      case 'international': return <Globe className="h-5 w-5 text-travel-blue" />;
      case 'city': return <Building className="h-5 w-5 text-travel-teal" />;
      default: return <Plane className="h-5 w-5 text-travel-blue" />;
    }
  };

  if (savedChecklists.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-travel-dark">Checklists Salvas</CardTitle>
        <CardDescription>
          Você tem {savedChecklists.length} checklist(s) salva(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedChecklists.map(checklist => {
            const completedItems = checklist.items.filter(item => item.done).length;
            const progress = Math.round((completedItems / checklist.items.length) * 100);
            
            return (
              <Card key={checklist.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-2 bg-gray-200">
                  <div 
                    className="h-full bg-travel-teal" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {getDestinationIcon(checklist.type)}
                    <h3 className="font-medium truncate">{checklist.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {completedItems} de {checklist.items.length} itens concluídos
                  </p>
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onSelect(checklist)}
                      className="text-travel-blue border-travel-blue hover:bg-travel-light"
                    >
                      Abrir
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(checklist.id)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedChecklists;
