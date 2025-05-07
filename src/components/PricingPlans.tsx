
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface PricingPlansProps {
  onClose: () => void;
}

const PricingPlans: React.FC<PricingPlansProps> = ({ onClose }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-travel-dark">Atualize seu Plano</h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Plan */}
        <Card className="border-travel-blue/20">
          <CardHeader>
            <CardTitle className="text-lg">Plano Básico</CardTitle>
            <CardDescription className="text-2xl font-bold">Grátis</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-travel-teal" />
                <span className="text-sm">Até 5 checklists</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-travel-teal" />
                <span className="text-sm">Download em PDF</span>
              </li>
              <li className="flex items-center gap-2">
                <X className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Checklists ilimitadas</span>
              </li>
              <li className="flex items-center gap-2">
                <X className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sincronização entre dispositivos</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full border-travel-blue/30"
              onClick={onClose}
            >
              Plano Atual
            </Button>
          </CardFooter>
        </Card>
        
        {/* Premium Plan */}
        <Card className="border-travel-teal shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-travel-teal text-white text-xs px-3 py-1">
            Mais Popular
          </div>
          <CardHeader>
            <CardTitle className="text-lg">Plano Premium</CardTitle>
            <CardDescription className="text-2xl font-bold">R$ 9,90<span className="text-sm font-normal">/mês</span></CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-travel-teal" />
                <span className="text-sm">Checklists ilimitadas</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-travel-teal" />
                <span className="text-sm">Download em PDF</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-travel-teal" />
                <span className="text-sm">Sincronização entre dispositivos</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-travel-teal" />
                <span className="text-sm">Suporte prioritário</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-travel-teal hover:bg-travel-teal/80">
              Assinar Agora
            </Button>
          </CardFooter>
        </Card>
        
        {/* Pro Plan */}
        <Card className="border-travel-blue/20">
          <CardHeader>
            <CardTitle className="text-lg">Plano Família</CardTitle>
            <CardDescription className="text-2xl font-bold">R$ 19,90<span className="text-sm font-normal">/mês</span></CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-travel-teal" />
                <span className="text-sm">Checklists ilimitadas</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-travel-teal" />
                <span className="text-sm">Download em PDF</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-travel-teal" />
                <span className="text-sm">Compartilhamento familiar (até 5 contas)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-travel-teal" />
                <span className="text-sm">Suporte prioritário 24/7</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-travel-blue/30 hover:bg-travel-blue/10">
              Assinar Agora
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PricingPlans;
