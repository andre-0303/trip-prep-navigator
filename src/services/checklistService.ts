
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

// Generate a checklist based on destination type
export const generateChecklist = (destination: string): Destination => {
  const destinationType = determineDestinationType(destination);
  const id = Date.now().toString();
  
  // Base items for all trips
  const baseItems: ChecklistItem[] = [
    { id: `${id}-1`, name: 'Carteira e documentos', category: 'Documentos', icon: 'id-card', done: false },
    { id: `${id}-2`, name: 'Celular e carregador', category: 'Eletrônicos', icon: 'smartphone', done: false },
    { id: `${id}-3`, name: 'Remédios pessoais', category: 'Saúde', icon: 'pill', done: false },
    { id: `${id}-4`, name: 'Escova e pasta de dente', category: 'Higiene', icon: 'toothbrush', done: false },
    { id: `${id}-5`, name: 'Roupas íntimas', category: 'Vestuário', icon: 'underwear', done: false },
  ];

  let specificItems: ChecklistItem[] = [];

  switch (destinationType) {
    case 'beach':
      specificItems = [
        { id: `${id}-6`, name: 'Protetor solar', category: 'Saúde', icon: 'sun', done: false },
        { id: `${id}-7`, name: 'Roupas de banho', category: 'Vestuário', icon: 'swimsuit', done: false },
        { id: `${id}-8`, name: 'Chapéu ou boné', category: 'Vestuário', icon: 'hat', done: false },
        { id: `${id}-9`, name: 'Chinelos', category: 'Vestuário', icon: 'flip-flops', done: false },
        { id: `${id}-10`, name: 'Óculos de sol', category: 'Acessórios', icon: 'sunglasses', done: false },
        { id: `${id}-11`, name: 'Toalha de praia', category: 'Lazer', icon: 'towel', done: false },
        { id: `${id}-12`, name: 'Repelente de insetos', category: 'Saúde', icon: 'bug', done: false },
      ];
      break;

    case 'mountain':
      specificItems = [
        { id: `${id}-6`, name: 'Casaco impermeável', category: 'Vestuário', icon: 'jacket', done: false },
        { id: `${id}-7`, name: 'Botas de trilha', category: 'Vestuário', icon: 'boots', done: false },
        { id: `${id}-8`, name: 'Mochila', category: 'Equipamento', icon: 'backpack', done: false },
        { id: `${id}-9`, name: 'Cantil de água', category: 'Equipamento', icon: 'water-bottle', done: false },
        { id: `${id}-10`, name: 'Snacks energéticos', category: 'Alimentação', icon: 'food', done: false },
        { id: `${id}-11`, name: 'Kit de primeiros socorros', category: 'Saúde', icon: 'first-aid', done: false },
        { id: `${id}-12`, name: 'Lanterna', category: 'Equipamento', icon: 'flashlight', done: false },
      ];
      break;

    case 'camping':
      specificItems = [
        { id: `${id}-6`, name: 'Barraca', category: 'Equipamento', icon: 'tent', done: false },
        { id: `${id}-7`, name: 'Saco de dormir', category: 'Equipamento', icon: 'sleeping-bag', done: false },
        { id: `${id}-8`, name: 'Lanterna', category: 'Equipamento', icon: 'flashlight', done: false },
        { id: `${id}-9`, name: 'Isqueiro ou fósforos', category: 'Equipamento', icon: 'lighter', done: false },
        { id: `${id}-10`, name: 'Canivete multiuso', category: 'Equipamento', icon: 'knife', done: false },
        { id: `${id}-11`, name: 'Repelente de insetos', category: 'Saúde', icon: 'bug', done: false },
        { id: `${id}-12`, name: 'Kit de cozinha', category: 'Equipamento', icon: 'cooking', done: false },
      ];
      break;

    case 'winter':
      specificItems = [
        { id: `${id}-6`, name: 'Casaco térmico', category: 'Vestuário', icon: 'winter-jacket', done: false },
        { id: `${id}-7`, name: 'Luvas', category: 'Vestuário', icon: 'gloves', done: false },
        { id: `${id}-8`, name: 'Gorro/touca', category: 'Vestuário', icon: 'winter-hat', done: false },
        { id: `${id}-9`, name: 'Cachecol', category: 'Vestuário', icon: 'scarf', done: false },
        { id: `${id}-10`, name: 'Meias térmicas', category: 'Vestuário', icon: 'socks', done: false },
        { id: `${id}-11`, name: 'Hidratante labial', category: 'Higiene', icon: 'lip-balm', done: false },
        { id: `${id}-12`, name: 'Roupas térmicas', category: 'Vestuário', icon: 'thermal-wear', done: false },
      ];
      break;

    case 'international':
      specificItems = [
        { id: `${id}-6`, name: 'Passaporte', category: 'Documentos', icon: 'passport', done: false },
        { id: `${id}-7`, name: 'Seguro viagem', category: 'Documentos', icon: 'insurance', done: false },
        { id: `${id}-8`, name: 'Adaptador de tomada', category: 'Eletrônicos', icon: 'plug', done: false },
        { id: `${id}-9`, name: 'Dicionário/App tradutor', category: 'Utilidades', icon: 'translator', done: false },
        { id: `${id}-10`, name: 'Moeda estrangeira', category: 'Finanças', icon: 'money', done: false },
        { id: `${id}-11`, name: 'Cópia dos documentos', category: 'Documentos', icon: 'document', done: false },
        { id: `${id}-12`, name: 'Cartão internacional', category: 'Finanças', icon: 'credit-card', done: false },
      ];
      break;

    case 'city':
    default:
      specificItems = [
        { id: `${id}-6`, name: 'Mapa/App de navegação', category: 'Utilidades', icon: 'map', done: false },
        { id: `${id}-7`, name: 'Guia turístico', category: 'Utilidades', icon: 'guide', done: false },
        { id: `${id}-8`, name: 'Câmera', category: 'Eletrônicos', icon: 'camera', done: false },
        { id: `${id}-9`, name: 'Powerbank', category: 'Eletrônicos', icon: 'battery', done: false },
        { id: `${id}-10`, name: 'Óculos de sol', category: 'Acessórios', icon: 'sunglasses', done: false },
        { id: `${id}-11`, name: 'Roupa confortável', category: 'Vestuário', icon: 'clothes', done: false },
        { id: `${id}-12`, name: 'Calçado confortável', category: 'Vestuário', icon: 'shoes', done: false },
      ];
      break;
  }

  return {
    id,
    name: destination,
    type: destinationType,
    items: [...baseItems, ...specificItems]
  };
};

export const suggestedDestinations = [
  'Praia de Copacabana',
  'Nova York',
  'Serra da Mantiqueira',
  'Acampamento na Chapada dos Veadeiros',
  'Bariloche (inverno)',
  'Europa'
];
