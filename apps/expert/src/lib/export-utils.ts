import { toCanvas } from 'html-to-image';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { EarningsDashboardData } from '../components/Earnings/types';

/**
 * Exports a DOM element to a PDF file.
 * @param elementId The ID of the HTML element to capture.
 * @param fileName The name of the resulting PDF file.
 */
export const exportElementToPDF = async (elementId: string, fileName: string = 'report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  try {
    const canvas = await toCanvas(element, {
      pixelRatio: 2,
      backgroundColor: '#f9fafb',
    });

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('[PDF Export] Critical error during PDF generation:', error);
    throw error;
  }
};

/**
 * Generates a custom styled PDF with Logo, Date, and the Dashboard Visuals.
 */
export const exportDataToPDF = async (data: EarningsDashboardData, dateRange: string, fileName: string = 'report.pdf') => {
  const elementId = 'earnings-report';
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    compress: true
  });
  
  // 1. Add Logo
  const logoUrl = '/images/web-logo.png'; // Using the main logo
  try {
    const img = new Image();
    img.src = logoUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    const imgWidth = 45;
    const imgHeight = (img.height * imgWidth) / img.width;
    doc.addImage(img, 'PNG', 14, 10, imgWidth, imgHeight);
  } catch(e) {
    console.error("Failed to load logo", e);
  }
  
  let currentY = 35;
  
  // 2. Add Title and Date
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Earnings Report', 14, currentY);
  currentY += 8;
  
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date Range: ${dateRange}`, 14, currentY);
  currentY += 10;

  // 3. Capture Dashboard UI sections individually to prevent page breaks in the middle of components
  try {
    const sections = Array.from(document.querySelectorAll('.pdf-export-section')) as HTMLElement[];
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const availableWidth = pdfWidth - (margin * 2);
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const canvas = await toCanvas(section, {
        pixelRatio: 2,
        backgroundColor: '#f9fafb',
      });
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      let imgHeight = (canvas.height * availableWidth) / canvas.width;
      let imgWidthToDraw = availableWidth;
      let xOffset = margin;

      const maxAllowedHeight = pageHeight - margin * 2; // Allow some margin at top/bottom

      // Scale down only if a SINGLE section is taller than a whole page
      if (imgHeight > maxAllowedHeight) {
        const ratio = maxAllowedHeight / imgHeight;
        imgHeight = maxAllowedHeight;
        imgWidthToDraw = availableWidth * ratio;
        xOffset = margin + (availableWidth - imgWidthToDraw) / 2;
      }

      // Check if this section fits on the current page
      if (currentY + imgHeight > pageHeight - margin) {
        doc.addPage();
        currentY = margin; // Reset Y for new page
      }

      doc.addImage(dataUrl, 'JPEG', xOffset, currentY, imgWidthToDraw, imgHeight, undefined, 'FAST');
      currentY += imgHeight + 8; // add a small gap between sections
    }
  } catch (error) {
    console.error('[PDF Export] Failed to capture dashboard element:', error);
  }

  doc.save(fileName);
  return true;
};
