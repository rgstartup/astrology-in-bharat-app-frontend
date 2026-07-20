import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f9fafb',
      logging: false,
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
