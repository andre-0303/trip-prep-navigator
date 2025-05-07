
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Destination } from '@/services/checklistService';
import { useToast } from '@/hooks/use-toast';
import ChecklistHeader from './checklist/ChecklistHeader';
import ChecklistCategories from './checklist/ChecklistCategories';
import { generateChecklistPDF } from '@/utils/pdfUtils';

interface TravelChecklistProps {
  destination: Destination;
  onClose?: () => void;
  onSave?: (destination: Destination) => void;
}

const TravelChecklist: React.FC<TravelChecklistProps> = ({ destination, onClose, onSave }) => {
  const [items, setItems] = useState<any[]>(destination.items);
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
    const doc = generateChecklistPDF(destination, progress, items);
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

  return (
    <Card className="animate-fade-in">
      <ChecklistHeader 
        destination={destination}
        progress={progress}
        items={items}
        onClose={onClose}
        onSave={handleSave}
        onDownload={handleDownload}
      />
      <ChecklistCategories 
        items={items} 
        onToggle={handleToggle} 
      />
    </Card>
  );
};

export default TravelChecklist;
