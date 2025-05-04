
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChecklistItem as ChecklistItemType } from '@/services/checklistService';
import { CheckCircle, Circle } from 'lucide-react';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string, done: boolean) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ item, onToggle }) => {
  const [isDone, setIsDone] = useState(item.done);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update local state when item prop changes
  useEffect(() => {
    setIsDone(item.done);
  }, [item.done]);

  const handleToggle = () => {
    const newState = !isDone;
    setIsDone(newState);
    setIsAnimating(true);
    onToggle(item.id, newState);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm transition-all hover:bg-gray-50 cursor-pointer group",
        isDone && "checklist-item-done bg-gray-50",
        isAnimating && "animate-fade-in"
      )}
      onClick={handleToggle}
    >
      <div className="flex-shrink-0">
        {isDone ? (
          <CheckCircle className="h-6 w-6 text-travel-teal" />
        ) : (
          <Circle className="h-6 w-6 text-muted-foreground group-hover:text-travel-blue transition-colors" />
        )}
      </div>
      <div className="flex-1">
        <p className={cn("font-medium", isDone && "line-through text-muted-foreground")}>{item.name}</p>
        <p className="text-xs text-muted-foreground">{item.category}</p>
      </div>
    </div>
  );
};

export default ChecklistItem;
