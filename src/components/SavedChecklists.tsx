
import { useState, useEffect } from 'react';
import { Destination } from '@/services/checklistService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface SavedChecklistsProps {
  onSelect: (checklist: Destination) => void;
}

const SavedChecklists: React.FC<SavedChecklistsProps> = ({ onSelect }) => {
  const [savedChecklists, setSavedChecklists] = useState<Destination[]>([]);

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
  }, []);

  const handleDelete = (id: string) => {
    localStorage.removeItem(`checklist-${id}`);
    setSavedChecklists(prev => prev.filter(checklist => checklist.id !== id));
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
              <Card key={checklist.id} className="overflow-hidden">
                <div className="h-2 bg-gray-200">
                  <div 
                    className="h-full bg-travel-teal" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium truncate">{checklist.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {completedItems} de {checklist.items.length} itens concluídos
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onSelect(checklist)}
                    >
                      Abrir
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(checklist.id)}
                      className="text-destructive hover:text-destructive/90"
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
