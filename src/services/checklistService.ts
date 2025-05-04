
import { v4 as uuidv4 } from 'uuid';

type DestinationType = 'beach' | 'mountain' | 'city' | 'international' | 'camping' | 'winter' | 'default';

export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  icon?: string;
  done: boolean;
}

export interface Destination {
  id: string;
  name: string;
  type: DestinationType;
  items: ChecklistItem[];
}

// Helper to determine destination type based on input
export const determineDestinationType = (input: string): DestinationType => {
  const lowerInput = input.toLowerCase();
  
  // Specific destinations and their types
  const destinationMap: Record<string, DestinationType> = {
    'florianópolis': 'beach',
    'rio de janeiro': 'beach',
    'cancún': 'beach',
    'maldivas': 'beach',
    'búzios': 'beach',
    'fernando de noronha': 'beach',
    'porto de galinhas': 'beach',
    'gramado': 'winter',
    'campos do jordão': 'winter',
    'bariloche': 'winter',
    'paris': 'international',
    'nova york': 'international',
    'roma': 'international',
    'tóquio': 'international',
    'londres': 'international',
    'barcelona': 'international',
    'chapada dos veadeiros': 'camping',
    'monte roraima': 'mountain',
    'machu picchu': 'mountain',
    'serra da mantiqueira': 'mountain',
    'são paulo': 'city',
    'brasília': 'city',
    'curitiba': 'city',
    'belo horizonte': 'city',
  };

  // Check if the exact destination is in our map
  for (const [destination, type] of Object.entries(destinationMap)) {
    if (lowerInput.includes(destination)) {
      return type;
    }
  }
  
  // Generic type determination based on keywords
  if (lowerInput.includes('praia') || 
      lowerInput.includes('beach') || 
      lowerInput.includes('mar') || 
      lowerInput.includes('ilha')) {
    return 'beach';
  }

  if (lowerInput.includes('mont') || 
      lowerInput.includes('serra') || 
      lowerInput.includes('mountain') || 
      lowerInput.includes('trekking') ||
      lowerInput.includes('hiking')) {
    return 'mountain';
  }

  if (lowerInput.includes('camping') || 
      lowerInput.includes('acampamento') || 
      lowerInput.includes('camp')) {
    return 'camping';
  }

  if (lowerInput.includes('inverno') || 
      lowerInput.includes('neve') || 
      lowerInput.includes('winter') || 
      lowerInput.includes('snow') ||
      lowerInput.includes('frio')) {
    return 'winter';
  }

  if (lowerInput.includes('internacional') || 
      lowerInput.includes('international') || 
      lowerInput.includes('exterior') || 
      lowerInput.includes('abroad') ||
      lowerInput.includes('passport') ||
      lowerInput.includes('passaporte')) {
    return 'international';
  }
  
  // Default to city if nothing else matches
  return 'city';
};

// Generate specific items for destinations
const getDestinationSpecificItems = (destination: string): ChecklistItem[] => {
  const lowerDestination = destination.toLowerCase();
  const id = Date.now().toString();
  
  if (lowerDestination.includes('florianópolis')) {
    return [
      { id: `${id}-specific-1`, name: 'Protetor solar 50+', category: 'Praia', done: false },
      { id: `${id}-specific-2`, name: 'Guia de praias', category: 'Lazer', done: false },
      { id: `${id}-specific-3`, name: 'Roupas para trilhas', category: 'Atividades', done: false },
      { id: `${id}-specific-4`, name: 'Cartão para aluguel de bicicleta', category: 'Transporte', done: false },
    ];
  }
  
  if (lowerDestination.includes('gramado')) {
    return [
      { id: `${id}-specific-1`, name: 'Casaco térmico', category: 'Vestuário', done: false },
      { id: `${id}-specific-2`, name: 'Ingressos para o Snowland', category: 'Lazer', done: false },
      { id: `${id}-specific-3`, name: 'Reservas para fondue', category: 'Alimentação', done: false },
      { id: `${id}-specific-4`, name: 'Mapa da Rota Romântica', category: 'Turismo', done: false },
    ];
  }
  
  if (lowerDestination.includes('paris')) {
    return [
      { id: `${id}-specific-1`, name: 'Adaptador de tomada europeu', category: 'Eletrônicos', done: false },
      { id: `${id}-specific-2`, name: 'Ingressos para a Torre Eiffel', category: 'Turismo', done: false },
      { id: `${id}-specific-3`, name: 'Dicionário francês básico', category: 'Comunicação', done: false },
      { id: `${id}-specific-4`, name: 'Passes de metrô', category: 'Transporte', done: false },
    ];
  }
  
  if (lowerDestination.includes('nova york')) {
    return [
      { id: `${id}-specific-1`, name: 'Adaptador de tomada americano', category: 'Eletrônicos', done: false },
      { id: `${id}-specific-2`, name: 'Passes para museus', category: 'Turismo', done: false },
      { id: `${id}-specific-3`, name: 'MetroCard', category: 'Transporte', done: false },
      { id: `${id}-specific-4`, name: 'Ingressos para Broadway', category: 'Lazer', done: false },
    ];
  }
  
  return [];
};

// Generate a checklist based on destination type
export const generateChecklist = (destination: string): Destination => {
  const destinationType = determineDestinationType(destination);
  const id = uuidv4();
  
  // Base items for all trips
  const baseItems: ChecklistItem[] = [
    { id: uuidv4(), name: 'Carteira e documentos', category: 'Documentos', done: false },
    { id: uuidv4(), name: 'Celular e carregador', category: 'Eletrônicos', done: false },
    { id: uuidv4(), name: 'Remédios pessoais', category: 'Saúde', done: false },
    { id: uuidv4(), name: 'Escova e pasta de dente', category: 'Higiene', done: false },
    { id: uuidv4(), name: 'Roupas íntimas', category: 'Vestuário', done: false },
  ];

  let specificItems: ChecklistItem[] = [];

  // Get type-based items
  switch (destinationType) {
    case 'beach':
      specificItems = [
        { id: uuidv4(), name: 'Protetor solar', category: 'Saúde', done: false },
        { id: uuidv4(), name: 'Roupas de banho', category: 'Vestuário', done: false },
        { id: uuidv4(), name: 'Chapéu ou boné', category: 'Vestuário', done: false },
        { id: uuidv4(), name: 'Chinelos', category: 'Vestuário', done: false },
        { id: uuidv4(), name: 'Óculos de sol', category: 'Acessórios', done: false },
        { id: uuidv4(), name: 'Toalha de praia', category: 'Lazer', done: false },
        { id: uuidv4(), name: 'Repelente de insetos', category: 'Saúde', done: false },
      ];
      break;

    case 'mountain':
      specificItems = [
        { id: uuidv4(), name: 'Casaco impermeável', category: 'Vestuário', done: false },
        { id: uuidv4(), name: 'Botas de trilha', category: 'Vestuário', done: false },
        { id: uuidv4(), name: 'Mochila', category: 'Equipamento', done: false },
        { id: uuidv4(), name: 'Cantil de água', category: 'Equipamento', done: false },
        { id: uuidv4(), name: 'Snacks energéticos', category: 'Alimentação', done: false },
        { id: uuidv4(), name: 'Kit de primeiros socorros', category: 'Saúde', done: false },
        { id: uuidv4(), name: 'Lanterna', category: 'Equipamento', done: false },
      ];
      break;

    case 'camping':
      specificItems = [
        { id: uuidv4(), name: 'Barraca', category: 'Equipamento', done: false },
        { id: uuidv4(), name: 'Saco de dormir', category: 'Equipamento', done: false },
        { id: uuidv4(), name: 'Lanterna', category: 'Equipamento', done: false },
        { id: uuidv4(), name: 'Isqueiro ou fósforos', category: 'Equipamento', done: false },
        { id: uuidv4(), name: 'Canivete multiuso', category: 'Equipamento', done: false },
        { id: uuidv4(), name: 'Repelente de insetos', category: 'Saúde', done: false },
        { id: uuidv4(), name: 'Kit de cozinha', category: 'Equipamento', done: false },
      ];
      break;

    case 'winter':
      specificItems = [
        { id: uuidv4(), name: 'Casaco térmico', category: 'Vestuário', done: false },
        { id: uuidv4(), name: 'Luvas', category: 'Vestuário', done: false },
        { id: uuidv4(), name: 'Gorro/touca', category: 'Vestuário', done: false },
        { id: uuidv4(), name: 'Cachecol', category: 'Vestuário', done: false },
        { id: uuidv4(), name: 'Meias térmicas', category: 'Vestuário', done: false },
        { id: uuidv4(), name: 'Hidratante labial', category: 'Higiene', done: false },
        { id: uuidv4(), name: 'Roupas térmicas', category: 'Vestuário', done: false },
      ];
      break;

    case 'international':
      specificItems = [
        { id: uuidv4(), name: 'Passaporte', category: 'Documentos', done: false },
        { id: uuidv4(), name: 'Seguro viagem', category: 'Documentos', done: false },
        { id: uuidv4(), name: 'Adaptador de tomada', category: 'Eletrônicos', done: false },
        { id: uuidv4(), name: 'Dicionário/App tradutor', category: 'Utilidades', done: false },
        { id: uuidv4(), name: 'Moeda estrangeira', category: 'Finanças', done: false },
        { id: uuidv4(), name: 'Cópia dos documentos', category: 'Documentos', done: false },
        { id: uuidv4(), name: 'Cartão internacional', category: 'Finanças', done: false },
      ];
      break;

    case 'city':
    default:
      specificItems = [
        { id: uuidv4(), name: 'Mapa/App de navegação', category: 'Utilidades', done: false },
        { id: uuidv4(), name: 'Guia turístico', category: 'Utilidades', done: false },
        { id: uuidv4(), name: 'Câmera', category: 'Eletrônicos', done: false },
        { id: uuidv4(), name: 'Powerbank', category: 'Eletrônicos', done: false },
        { id: uuidv4(), name: 'Óculos de sol', category: 'Acessórios', done: false },
        { id: uuidv4(), name: 'Roupa confortável', category: 'Vestuário', done: false },
        { id: uuidv4(), name: 'Calçado confortável', category: 'Vestuário', done: false },
      ];
      break;
  }

  // Add destination-specific items
  const destinationItems = getDestinationSpecificItems(destination);

  return {
    id,
    name: destination,
    type: destinationType,
    items: [...baseItems, ...specificItems, ...destinationItems]
  };
};

// Suggested destinations for autocomplete feature
export const suggestedDestinations = [
  'Florianópolis',
  'Rio de Janeiro',
  'Gramado',
  'Campos do Jordão',
  'Paris',
  'Nova York',
  'Londres',
  'Tóquio',
  'Barcelona',
  'Cancún',
  'Bariloche',
  'Fernando de Noronha',
  'Chapada dos Veadeiros',
  'Bonito',
  'São Paulo',
  'Salvador',
  'Porto de Galinhas',
  'Brasília',
  'Maldivas',
  'Roma',
  'Búzios',
  'Machu Picchu'
];

// Popular destinations to show as quick options
export const popularDestinations = [
  'Florianópolis',
  'Rio de Janeiro',
  'Gramado',
  'Paris',
  'Nova York',
  'Chapada dos Veadeiros'
];
