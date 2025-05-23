
import { CardContent } from '@/components/ui/card';
import ChecklistItem from '../ChecklistItem';
import { ChecklistItem as ChecklistItemType } from '@/services/checklistService';

interface ChecklistCategoriesProps {
  items: ChecklistItemType[];
  onToggle: (id: string, done: boolean) => void;
}

const ChecklistCategories: React.FC<ChecklistCategoriesProps> = ({ items, onToggle }) => {
  // Group items by category
  const itemsByCategory: Record<string, ChecklistItemType[]> = {};
  items.forEach(item => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = [];
    }
    itemsByCategory[item.category].push(item);
  });

  // Sort categories by name for consistent display
  const sortedCategories = Object.keys(itemsByCategory).sort();

  return (
    <CardContent>
      <div className="space-y-6">
        {sortedCategories.map((category) => (
          <div key={category} className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">{category}</h3>
            <div className="grid gap-2">
              {itemsByCategory[category].map(item => (
                <ChecklistItem 
                  key={item.id} 
                  item={item} 
                  onToggle={onToggle} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  );
};

export default ChecklistCategories;
