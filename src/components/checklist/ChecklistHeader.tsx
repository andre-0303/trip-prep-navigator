
import { Destination } from '@/services/checklistService';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Save, Umbrella, Mountain, Tent, Snowflake, Globe, Building, Plane, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getDestinationTypeLabel } from '@/utils/pdfUtils';

interface ChecklistHeaderProps {
  destination: Destination;
  progress: number;
  items: any[];
  onClose?: () => void;
  onSave: () => void;
  onDownload: () => void;
}

const ChecklistHeader: React.FC<ChecklistHeaderProps> = ({ 
  destination, 
  progress, 
  items, 
  onClose, 
  onSave, 
  onDownload 
}) => {
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

  return (
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
        <Button onClick={onDownload} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Baixar PDF
        </Button>
        <Button onClick={onSave} variant="outline" size="sm">
          <Save className="mr-2 h-4 w-4" />
          Salvar
        </Button>
      </div>
    </CardHeader>
  );
};

export default ChecklistHeader;
