
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PlaceSearch from '@/components/PlaceSearch';
import TravelChecklist from '@/components/TravelChecklist';
import SavedChecklists from '@/components/SavedChecklists';
import { generateChecklist, Destination } from '@/services/checklistService';
import { Plane, LogOut, MapPin, Search, List, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
    <div className="min-h-screen bg-gradient-to-b from-travel-light via-white to-travel-light">
      <header className="py-6 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="p-2 rounded-full bg-gradient-to-br from-travel-blue to-travel-teal text-white">
                <Plane className="h-6 w-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-travel-dark to-travel-blue bg-clip-text text-transparent">
                Trip Prep Navigator
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                <div className="h-6 w-6 rounded-full bg-travel-teal/20 flex items-center justify-center">
                  <span className="text-travel-teal text-sm font-medium">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {displayName}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-1 border-travel-teal/30 hover:bg-travel-teal/10"
              >
                <LogOut className="h-4 w-4 text-travel-dark" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto py-10 md:py-16">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-travel-teal/10 text-travel-teal animate-float">
                <MapPin className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-travel-dark mb-3">
              Organize sua próxima aventura
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Gere checklists personalizadas para suas viagens e mantenha-se organizado
            </p>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-border">
              <PlaceSearch onSubmit={handleDestinationSubmit} />
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-8 space-y-8">
            {currentChecklist && (
              <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-full bg-travel-teal/10">
                    <Check className="h-5 w-5 text-travel-teal" />
                  </div>
                  <h3 className="text-xl font-semibold">Seu checklist personalizado</h3>
                </div>
                <TravelChecklist destination={currentChecklist} />
              </div>
            )}
          </div>
        </section>

        <Separator className="bg-travel-teal/10" />

        <section className="container mx-auto py-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-full bg-travel-blue/10">
                <List className="h-5 w-5 text-travel-blue" />
              </div>
              <h3 className="text-xl font-semibold text-travel-dark">Checklists salvos</h3>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-border">
              <SavedChecklists onSelect={handleSavedChecklistSelect} />
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto py-8 bg-travel-dark text-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-travel-mint" />
              <p className="font-medium">Trip Prep Navigator</p>
            </div>
            <p className="text-sm opacity-80">Organize sua próxima aventura com facilidade</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
