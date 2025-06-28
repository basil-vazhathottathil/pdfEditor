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

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const base64 = fileReader.result;
      setOriginalFileUrl(base64);
      setEditedFileUrl(null); // Reset edited PDF

      try {
        const rawText = await extractTextFromPdf(base64);
        const jsonText = await getTiptapJsonFromText(rawText);
        const parsed = JSON.parse(jsonText);
        setTiptapContent(parsed);
      } catch (err) {
        console.error("Failed to parse Tiptap JSON:", err);
      }
    };

    fileReader.readAsDataURL(file);
  };

  // Handler to update PDF when editor changes
  const handleEditorUpdate = (editor) => {
    const html = `<div style="min-width:600px;min-height:800px;font-size:16px;font-family:sans-serif;padding:24px;">${generateHTML(editor.getJSON(), editor.extensionManager.extensions)}</div>`;
    console.log("Generated HTML:", html);

    const element = document.createElement('div');
    element.innerHTML = html;

    html2pdf()
      .from(element)
      .toPdf()
      .output('datauristring')
      .then((pdfDataUri) => {
        setEditedFileUrl(pdfDataUri);
      });
  };

  return (
    <div style={{ display: 'flex', gap: '16px', padding: '16px' }}>
      <div style={{ flex: 1 }}>
        <input type="file" onChange={handleUpload} />
        {/* Show original PDF until first edit, then show edited PDF */}
        {originalFileUrl && !editedFileUrl && (
          <PdfViewer file={originalFileUrl} />
        )}
        {editedFileUrl && (
          <PdfViewer file={editedFileUrl} />
        )}
      </div>
      <div style={{ flex: 1 }}>
        {tiptapContent && (
          <Editor
            tiptapJson={tiptapContent}
            onUpdate={handleEditorUpdate}
          />
        )}
      </div>
    </div>
  );
}

export default App;