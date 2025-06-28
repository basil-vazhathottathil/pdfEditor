import { useEffect, useRef } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';

GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfViewer({ file }) {
  const canvasRef = useRef();

  useEffect(() => {
    let renderTask = null;
    let cancelled = false;

    const render = async () => {
      const pdf = await getDocument(file).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Start rendering
      renderTask = page.render({ canvasContext: context, viewport });
      try {
        await renderTask.promise;
      } catch (e) {
        if (!cancelled) throw e;
      }
    };

    render();

    return () => {
      cancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [file]);

  return <canvas ref={canvasRef} style={{ width: '100%', border: '1px solid #ccc' }} />;
}
