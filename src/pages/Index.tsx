
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PlaceSearch from '@/components/PlaceSearch';
import TravelChecklist from '@/components/TravelChecklist';
import SavedChecklists from '@/components/SavedChecklists';
import { generateChecklist, Destination } from '@/services/checklistService';
import { Plane, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [currentChecklist, setCurrentChecklist] = useState<Destination | null>(null);
  const { user, logout } = useAuth();

  const handleDestinationSubmit = (destination: string) => {
    const newChecklist = generateChecklist(destination);
    setCurrentChecklist(newChecklist);
  };

  const handleSavedChecklistSelect = (checklist: Destination) => {
    setCurrentChecklist(checklist);
    // Scroll to the top to see the checklist
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get user's display name from user metadata or fall back to email
  const displayName = user?.user_metadata?.name || 
                     user?.email?.split('@')[0] || 
                     'Viajante';

  return (
    <div className="min-h-screen bg-gradient-to-b from-travel-light to-white">
      <header className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Plane className="h-8 w-8 text-travel-blue" />
            <h1 className="text-3xl font-bold text-travel-dark">Trip Prep Navigator</h1>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              Olá, {displayName}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sair</span>
            </Button>
          </div>
        </div>
        <p className="text-center text-muted-foreground mb-8">
          Gere checklists personalizadas para suas viagens e mantenha-se organizado
        </p>
        
        <div className="max-w-2xl mx-auto mb-8">
          <PlaceSearch onSubmit={handleDestinationSubmit} />
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
