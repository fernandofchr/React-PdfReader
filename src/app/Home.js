"use client";

import React, { useState } from "react";
import UploadPDF from "./components/UploadPDF";
import ExtractedText from "./components/ExtractedText";
import TextToSpeechControls from "./components/TextToSpeechControls";
import { VscFilePdf } from "react-icons/vsc";
import { Button } from "@mui/material";

export default function Home({ onLogout }) {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]); // Historial de archivos cargados
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controla si la barra lateral está abierta

  const handleTextExtracted = (extractedText, fileName) => {
    setText(extractedText);

    // Agregar el archivo al historial si no está ya
    setHistory((prevHistory) => {
      const exists = prevHistory.some((item) => item.fileName === fileName);
      if (!exists) {
        return [...prevHistory, { fileName, text: extractedText }];
      }
      return prevHistory;
    });
  };

  const handleHistoryClick = (fileText) => {
    setText(fileText);
    setIsSidebarOpen(false); // Cierra el sidebar después de seleccionar un archivo
  };

  return (
    <>
      <div className="container mx-auto p-2 space-y-4 relative">
        <UploadPDF onTextExtracted={handleTextExtracted} />
        <ExtractedText text={text} setText={setText} />
        <TextToSpeechControls text={text} />

        {/* Botón para cerrar sesión */}
        <Button variant="contained" onClick={onLogout}>
          Cerrar Sesión
        </Button>

        {/* Botón para mostrar/ocultar el historial */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 right-4 p-3 bg-blue-600 text-white rounded shadow-lg hover:bg-blue-700 focus:outline-none z-50"
          style={{
            marginRight: isSidebarOpen ? "310px" : "0", // Mueve el botón cuando el sidebar esté abierto
          }}
        >
          {isSidebarOpen ? "Cerrar historial" : "Abrir historial"}
        </button>

        {/* Sidebar deslizante */}
        <div
          className={`fixed top-0 right-0 h-full bg-blue-600 shadow-lg transition-transform duration-300 z-40 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ width: "300px" }}
        >
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4 text-white-800">
              Historial de archivos
            </h2>
            <ul className="space-y-4 rounded hover:bg-gray-600">
              {history.map((item, index) => (
                <li key={index} className="flex flex-col items-center">
                  <button
                    onClick={() => handleHistoryClick(item.text)}
                    className="flex flex-col items-center bg-white rounded text-black hover:text-red-900 focus:outline-none w-full"
                  >
                    <VscFilePdf size={50} className="mb-2 mt-2" />
                    <span className="text-sm mb-2 w-full text-center overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.fileName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="fixed right-4">Made by FAS</div>
    </>
  );
}