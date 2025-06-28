// ✅ App.jsx
import { useState } from 'react';
import PdfViewer from './components/PdfViewer';
import Editor from './components/Editor/Editor';
import { extractTextFromPdf } from './utils/pdfExtract';
import { getTiptapJsonFromText } from './services/groqApi';
import { generateHTML } from "@tiptap/core";
import html2pdf from "html2pdf.js";

function App() {
  const [originalFileUrl, setOriginalFileUrl] = useState(null);
  const [editedFileUrl, setEditedFileUrl] = useState(null);
  const [tiptapContent, setTiptapContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const base64 = fileReader.result;
      setOriginalFileUrl(base64);
      setEditedFileUrl(null);
      setLoading(true);

      try {
        const rawText = await extractTextFromPdf(base64);
        const jsonText = await getTiptapJsonFromText(rawText);
        const parsed = JSON.parse(jsonText);
        setTiptapContent(parsed);
      } catch (err) {
        console.error("Failed to parse Tiptap JSON:", err);
        setTiptapContent({
          type: 'doc',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Failed to load content. Edit manually.' }] }]
        });
      } finally {
        setLoading(false);
      }
    };

    fileReader.readAsDataURL(file);
  };

  const handleEditorUpdate = (editor) => {
    const htmlBody = generateHTML(editor.getJSON(), editor.extensionManager.extensions);

    const styledHtml = `
      <div>
        <style>
          body {
            font-family: ${editor.getAttributes('fontFamily')?.family || 'sans-serif'};
            font-size: ${editor.getAttributes('fontSize')?.size || '16px'};
            line-height: 1.6;
            padding: 24px;
          }
          h1 { font-size: 24px; font-weight: bold; }
          h2 { font-size: 20px; font-weight: bold; }
          p { margin-bottom: 1em; }
        </style>
        <body>${htmlBody}</body>
      </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = styledHtml;

    html2pdf()
      .from(element)
      .set({
        margin: 0,
        filename: 'edited.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
      })
      .toPdf()
      .output('datauristring')
      .then((pdfDataUri) => setEditedFileUrl(pdfDataUri));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      <div style={{ flex: 1, borderRight: '2px solid #e2e8f0', padding: '16px', overflow: 'auto', backgroundColor: '#ffffff' }}>
        <input type="file" onChange={handleUpload} style={{ marginBottom: '12px' }} />
        {originalFileUrl && !editedFileUrl && <PdfViewer file={originalFileUrl} />}
        {editedFileUrl && <PdfViewer file={editedFileUrl} />}
      </div>

      <div style={{ flex: 1, padding: '16px', overflow: 'auto', backgroundColor: '#f8fafc' }}>
        {loading ? (
          <p>⏳ Generating editable content from PDF using AI...</p>
        ) : (
          <Editor
            tiptapJson={tiptapContent ?? {
              type: 'doc',
              content: [
                {
                  type: 'heading',
                  attrs: { level: 2 },
                  content: [{ type: 'text', text: 'Welcome to the PDF Editor' }]
                },
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Upload a PDF to begin editing text here.' }]
                }
              ]
            }}
            onUpdate={handleEditorUpdate}
          />
        )}
      </div>
    </div>
  );
}

export default App;
