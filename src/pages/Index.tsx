
import { useState } from 'react';
import DestinationInput from '@/components/DestinationInput';
import TravelChecklist from '@/components/TravelChecklist';
import SavedChecklists from '@/components/SavedChecklists';
import { generateChecklist, Destination } from '@/services/checklistService';
import { Plane } from 'lucide-react';

const Index = () => {
  const [currentChecklist, setCurrentChecklist] = useState<Destination | null>(null);

  const handleDestinationSubmit = (destination: string) => {
    const newChecklist = generateChecklist(destination);
    setCurrentChecklist(newChecklist);
  };

  const handleSavedChecklistSelect = (checklist: Destination) => {
    setCurrentChecklist(checklist);
    // Scroll to the top to see the checklist
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-travel-light to-white">
      <header className="container mx-auto py-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Plane className="h-8 w-8 text-travel-blue" />
          <h1 className="text-3xl font-bold text-travel-dark">Trip Prep Navigator</h1>
        </div>
        <p className="text-center text-muted-foreground mb-8">
          Gere checklists personalizadas para suas viagens e mantenha-se organizado
        </p>
        
        <div className="max-w-2xl mx-auto mb-8">
          <DestinationInput onSubmit={handleDestinationSubmit} />
        </div>
      </header>

      <div className="container mx-auto pb-20">
        <div className="max-w-3xl mx-auto space-y-8">
          {currentChecklist && (
            <TravelChecklist destination={currentChecklist} />
          )}

          <SavedChecklists onSelect={handleSavedChecklistSelect} />
        </div>
      </div>

      <footer className="py-6 bg-travel-dark text-white text-center text-sm">
        <div className="container mx-auto">
          <p className="opacity-80">Trip Prep Navigator - Organize sua próxima aventura</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
