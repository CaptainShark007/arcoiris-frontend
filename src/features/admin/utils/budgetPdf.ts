import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatPrice, formatDateLong } from '@/helpers';
import { BudgetDetail } from '@shared/types';

// Genera y descarga el PDF de un presupuesto
export const generateBudgetPdf = (budget: BudgetDetail) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const MARGIN_X = 15;
  const PAGE_WIDTH = 210;
  const BLUE: [number, number, number] = [0, 7, 215];
  const GRAY: [number, number, number] = [107, 114, 128];

  // Encabezado
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, PAGE_WIDTH, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ARCOIRIS', MARGIN_X, 12);

  doc.setFontSize(12);
  doc.text(`Presupuesto N° ${budget.id}`, MARGIN_X, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(formatDateLong(budget.created_at), PAGE_WIDTH - MARGIN_X, 12, {
    align: 'right',
  });
  doc.text(
    budget.valid_until ? `Válido hasta: ${formatDateLong(budget.valid_until)}` : '',
    PAGE_WIDTH - MARGIN_X,
    20,
    { align: 'right' }
  );

  let y = 36;

  // Cliente
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Cliente', MARGIN_X, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(budget.client?.full_name || 'Cliente no asignado', MARGIN_X, y);
  y += 5;
  if (budget.client?.email) {
    doc.text(budget.client.email, MARGIN_X, y);
    y += 5;
  }
  if (budget.client?.phone) {
    doc.text(`Teléfono: ${budget.client.phone}`, MARGIN_X, y);
    y += 5;
  }

  y += 4;

  // Tabla de items
  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN_X, right: MARGIN_X },
    head: [['Producto', 'Cant.', 'Precio', 'Total']],
    body: budget.items.map((item) => {
      const variant = [item.color_name, item.storage, item.finish]
        .filter(Boolean)
        .join(' • ');
      return [
        variant ? `${item.productName}\n${variant}` : item.productName,
        String(item.quantity),
        formatPrice(item.price),
        formatPrice(item.price * item.quantity),
      ];
    }),
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
      lineColor: [229, 231, 235],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: BLUE,
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' },
    },
  });

  let endY = (doc as any).lastAutoTable.finalY as number;
  y = endY + 8;

  // Resumen
  const summaryX = PAGE_WIDTH - MARGIN_X - 70;
  const summaryWidth = 70;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text('Subtotal', summaryX, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(
    formatPrice(budget.total_amount),
    summaryX + summaryWidth,
    y,
    { align: 'right' }
  );
  y += 7;

  doc.setFillColor(229, 231, 235);
  doc.rect(summaryX, y - 5, summaryWidth, 10, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...BLUE);
  doc.text('Total', summaryX + 3, y + 1);
  doc.text(
    formatPrice(budget.total_amount),
    summaryX + summaryWidth - 3,
    y + 1,
    { align: 'right' }
  );
  y += 16;

  // Notas
  if (budget.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Observaciones', MARGIN_X, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const splitNotes = doc.splitTextToSize(budget.notes, PAGE_WIDTH - MARGIN_X * 2);
    doc.text(splitNotes, MARGIN_X, y);
    y += splitNotes.length * 5 + 4;
  }

  // Pie
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text(
    'Este presupuesto tiene validez por ' +
      `${budget.validity_days} día(s) a partir de su emisión.`,
    PAGE_WIDTH / 2,
    285,
    { align: 'center' }
  );
  doc.text(
    'Gracias por confiar en Arcoiris',
    PAGE_WIDTH / 2,
    292,
    { align: 'center' }
  );

  doc.save(`presupuesto-${budget.id}.pdf`);
};
