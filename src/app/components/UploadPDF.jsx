"use client";
import React, { useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// Configurar la ubicación del worker
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const UploadPDF = ({ onTextExtracted }) => {
  const [fileName, setFileName] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const loadingTask = getDocument({ data: e.target.result });
        const pdf = await loadingTask.promise;

        let textArray = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(" ");
          textArray.push(pageText);
        }

        // Normalizar el texto: eliminar espacios múltiples y saltos de línea innecesarios
        let cleanText = textArray.join(" ").replace(/\s+/g, " ").trim();

        // Enviar el texto extraído y el nombre del archivo al componente padre
        onTextExtracted(cleanText, file.name);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="bg-black-50 p-4 rounded shadow-lg w-full">
      <h2 className="text-xl font-bold mb-2 text-white">Subir PDF</h2>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="block w-full text-sm text-white-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
        "
      />
      {fileName && (
        <p className="mt-2 text-sm text-white-600">Archivo cargado: {fileName}</p>
      )}
    </div>
  );
};

export default UploadPDF;
