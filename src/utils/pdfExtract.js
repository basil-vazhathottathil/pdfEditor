import { getDocument } from 'pdfjs-dist';

export const extractTextFromPdf = async (fileUrl) => {
  const pdf = await getDocument(fileUrl).promise;
  const text = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    text.push(`Page ${i}: ${pageText}`);
  }

  return text.join('\n\n');
};
