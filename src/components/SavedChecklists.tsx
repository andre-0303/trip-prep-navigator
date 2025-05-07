
import { useState, useEffect } from 'react';
import { Destination, determineDestinationType } from '@/services/checklistService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Umbrella, Mountain, Tent, Snowflake, Globe, Building, Plane, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SavedChecklistsProps {
  onSelect: (checklist: Destination) => void;
  onDeleteChecklist: (id: string) => void;
  onUpgradePlan: () => void;
}

// Maximum number of checklists allowed in basic plan
const MAX_CHECKLISTS_BASIC = 5;

const SavedChecklists: React.FC<SavedChecklistsProps> = ({ onSelect, onDeleteChecklist, onUpgradePlan }) => {
  const [savedChecklists, setSavedChecklists] = useState<Destination[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Load all checklists from localStorage
    const loadSavedChecklists = () => {
      const checklists: Destination[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key && key.startsWith('checklist-') && !key.includes('update-')) {
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
    
    // Create a listener for storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && event.key.startsWith('checklist-')) {
        loadSavedChecklists();
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Create a MutationObserver to watch for localStorage changes in the same tab
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.call(this, key, value);
      if (key.startsWith('checklist-')) {
        loadSavedChecklists();
        setUpdateTrigger(prev => prev + 1); // Force re-render
      }
    };
    
    return () => {
      window.removeEventListener('storage', loadSavedChecklists);
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, [updateTrigger]);

  const handleDelete = (id: string) => {
    localStorage.removeItem(`checklist-${id}`);
    setSavedChecklists(prev => prev.filter(checklist => checklist.id !== id));
    
    if (onDeleteChecklist) {
      onDeleteChecklist(id);
    }
    
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

  // Check if the user has reached the maximum number of checklists
  const hasReachedLimit = savedChecklists.length >= MAX_CHECKLISTS_BASIC;

  if (savedChecklists.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-travel-dark">Checklists Salvas</CardTitle>
            <CardDescription>
              Você tem {savedChecklists.length} checklist(s) salva(s)
              {" "}
              <span className="text-travel-teal font-medium">
                ({savedChecklists.length}/{MAX_CHECKLISTS_BASIC} no plano básico)
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {hasReachedLimit && (
          <Alert className="mb-4 border-travel-teal/30 bg-travel-teal/5">
            <AlertCircle className="h-4 w-4 text-travel-teal" />
            <AlertDescription className="flex justify-between items-center">
              <span>Você atingiu o limite de checklists do plano básico.</span>
              <Button 
                size="sm" 
                onClick={onUpgradePlan}
                className="bg-travel-teal hover:bg-travel-teal/90 text-white"
              >
                Fazer Upgrade
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
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
