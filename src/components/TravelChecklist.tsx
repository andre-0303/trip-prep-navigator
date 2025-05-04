
import { useState, useEffect } from 'react';
import ChecklistItem from './ChecklistItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Destination, ChecklistItem as ChecklistItemType } from '@/services/checklistService';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Download, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TravelChecklistProps {
  destination: Destination;
}

const TravelChecklist: React.FC<TravelChecklistProps> = ({ destination }) => {
  const [items, setItems] = useState<ChecklistItemType[]>(destination.items);
  const { toast } = useToast();

  useEffect(() => {
    setItems(destination.items);
  }, [destination]);

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
    
    // Add title
    doc.setFontSize(20);
    doc.text(`Checklist de viagem: ${destination.name}`, 20, 20);
    
    // Add items
    doc.setFontSize(12);
    let y = 40;
    
    items.forEach((item, index) => {
      const status = item.done ? '[✓]' : '[ ]';
      doc.text(`${status} ${item.name} (${item.category})`, 20, y);
      y += 10;
      
      // Add new page if needed
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    
    doc.save(`checklist-${destination.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    
    toast({
      title: "Checklist baixado!",
      description: "Seu PDF foi gerado com sucesso."
    });
  };

  const handleSave = () => {
    saveToLocalStorage({ ...destination, items });
    
    toast({
      title: "Checklist salvo!",
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

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-travel-dark text-2xl">Checklist: {destination.name}</CardTitle>
        <CardDescription>
          {items.filter(item => item.done).length} de {items.length} itens concluídos
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
