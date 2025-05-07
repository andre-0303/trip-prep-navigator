
import { useState, useEffect } from 'react';
import ChecklistItem from './ChecklistItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Destination, ChecklistItem as ChecklistItemType, determineDestinationType } from '@/services/checklistService';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Download, Save, Plane, Umbrella, Mountain, Tent, Snowflake, Globe, Building, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface TravelChecklistProps {
  destination: Destination;
  onClose?: () => void;
  onSave?: (destination: Destination) => void;
}

const TravelChecklist: React.FC<TravelChecklistProps> = ({ destination, onClose, onSave }) => {
  const [items, setItems] = useState<ChecklistItemType[]>(destination.items);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setItems(destination.items);
  }, [destination]);

  useEffect(() => {
    const completedCount = items.filter(item => item.done).length;
    const totalCount = items.length;
    const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    setProgress(newProgress);
  }, [items]);

  const handleToggle = (id: string, done: boolean) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, done } : item
    );
    setItems(updatedItems);
    saveToLocalStorage({ ...destination, items: updatedItems });
  };

  const saveToLocalStorage = (checklist: Destination) => {
    localStorage.setItem(`checklist-${checklist.id}`, JSON.stringify(checklist));
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Add title and destination type
    doc.setFontSize(20);
    doc.text(`Checklist de viagem: ${destination.name}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Tipo: ${getDestinationTypeLabel(destination.type)}`, 20, 30);
    
    // Add progress information
    doc.text(`Progresso: ${progress}% concluído`, 20, 40);
    
    // Add items grouped by category
    let y = 50;
    
    // Group items by category
    const categorizedItems: Record<string, ChecklistItemType[]> = {};
    items.forEach(item => {
      if (!categorizedItems[item.category]) {
        categorizedItems[item.category] = [];
      }
      categorizedItems[item.category].push(item);
    });
    
    // Add each category and its items
    Object.entries(categorizedItems).forEach(([category, categoryItems]) => {
      // Add new page if needed
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      // Add category title
      doc.setFontSize(14);
      doc.text(category, 20, y);
      y += 10;
      
      // Add items in category
      doc.setFontSize(11);
      categoryItems.forEach(item => {
        const status = item.done ? "[✓]" : "[ ]";
        doc.text(`${status} ${item.name}`, 25, y);
        y += 7;
        
        // Add new page if needed
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
      
      y += 5; // Add space between categories
    });
    
    // Add footer
    doc.setFontSize(9);
    doc.text("Gerado por Trip Prep Navigator", 20, 287);
    
    doc.save(`checklist-${destination.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    
    toast({
      title: "Checklist baixado!",
      description: "Seu PDF foi gerado com sucesso."
    });
  };

  const handleSave = () => {
    const updatedDestination = { ...destination, items };
    saveToLocalStorage(updatedDestination);
    
    // Call the onSave callback if provided
    if (onSave) {
      onSave(updatedDestination);
    }
    
    toast({
      title: "Checklist salva!",
      description: "Sua lista foi salva no navegador."
    });
  };
  
  // Group items by category
  const itemsByCategory: Record<string, ChecklistItemType[]> = {};
  items.forEach(item => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });

  const getDestinationIcon = (type: string) => {
    switch (type) {
      case 'beach': return <Umbrella className="h-6 w-6 text-travel-blue" />;
      case 'mountain': return <Mountain className="h-6 w-6 text-travel-teal" />;
      case 'camping': return <Tent className="h-6 w-6 text-travel-blue" />;
      case 'winter': return <Snowflake className="h-6 w-6 text-travel-teal" />;
      case 'international': return <Globe className="h-6 w-6 text-travel-blue" />;
      case 'city': return <Building className="h-6 w-6 text-travel-teal" />;
      default: return <Plane className="h-6 w-6 text-travel-blue" />;
    }
  };

  const getDestinationTypeLabel = (type: string) => {
    switch (type) {
      case 'beach': return 'Praia';
      case 'mountain': return 'Montanha';
      case 'camping': return 'Camping';
      case 'winter': return 'Inverno';
      case 'international': return 'Internacional';
      case 'city': return 'Cidade';
      default: return 'Geral';
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3 relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fechar checklist"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-2 mb-1">
          {getDestinationIcon(destination.type)}
          <CardTitle className="text-travel-dark text-2xl">{destination.name}</CardTitle>
        </div>
        <CardDescription className="flex flex-col gap-1">
          <span>Tipo: {getDestinationTypeLabel(destination.type)}</span>
          <div className="w-full mt-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-right mt-1">
              {items.filter(item => item.done).length} de {items.length} itens concluídos
            </p>
          </div>
        </CardDescription>
        <div className="flex gap-2 pt-2">
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Baixar PDF
          </Button>
          <Button onClick={handleSave} variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Salvar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
            <div key={category} className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">{category}</h3>
              <div className="grid gap-2">
                {categoryItems.map(item => (
                  <ChecklistItem 
                    key={item.id} 
                    item={item} 
                    onToggle={handleToggle} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelChecklist;
