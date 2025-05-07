
import { jsPDF } from 'jspdf';
import { Destination } from '@/services/checklistService';

export const getDestinationTypeLabel = (type: string) => {
  switch (type) {
    case 'beach': return 'Praia';
    case 'mountain': return 'Montanha';
    case 'camping': return 'Camping';
    case 'winter': return 'Inverno';
    case 'international': return 'Internacional';
    case 'city': return 'Cidade';
    default: return 'Geral';
  }
};

export const generateChecklistPDF = (destination: Destination, progress: number, items: any[]) => {
  const doc = new jsPDF();
  
  // Add title and destination type
  doc.setFontSize(20);
  doc.text(`Checklist de viagem: ${destination.name}`, 20, 20);
  doc.setFontSize(12);
  doc.text(`Tipo: ${getDestinationTypeLabel(destination.type)}`, 20, 30);
  
  // Add progress information
  doc.text(`Progresso: ${progress}% concluído`, 20, 40);
  
  // Add items grouped by category
  let y = 50;
  
  // Group items by category
  const categorizedItems: Record<string, any[]> = {};
  items.forEach(item => {
    if (!categorizedItems[item.category]) {
      categorizedItems[item.category] = [];
    }
    categorizedItems[item.category].push(item);
  });
  
  // Add each category and its items
  Object.entries(categorizedItems).forEach(([category, categoryItems]) => {
    // Add new page if needed
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    
    // Add category title
    doc.setFontSize(14);
    doc.text(category, 20, y);
    y += 10;
    
    // Add items in category
    doc.setFontSize(11);
    categoryItems.forEach(item => {
      const status = item.done ? "[✓]" : "[ ]";
      doc.text(`${status} ${item.name}`, 25, y);
      y += 7;
      
      // Add new page if needed
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    
    y += 5; // Add space between categories
  });
  
  // Add footer
  doc.setFontSize(9);
  doc.text("Gerado por Trip Prep Navigator", 20, 287);
  
  return doc;
};
