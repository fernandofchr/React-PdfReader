import React, { useEffect, useState } from "react";
import { VscDebugStart } from "react-icons/vsc";
import { VscDebugContinueSmall } from "react-icons/vsc";
import { VscDebugPause } from "react-icons/vsc";
import { VscDebugStop } from "react-icons/vsc";

const TextToSpeechControls = ({ text }) => {
  const [synth, setSynth] = useState(null);
  const [utterance, setUtterance] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSynth(window.speechSynthesis);
    }

    // Calcular duración aproximada del texto al cargarlo
    const words = text.split(" ").length;
    setDuration(words * 0.25); // Suponemos 0.5 segundos por palabra

    // Cargar voces disponibles
    if (synth) {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]); // Asigna la primera voz como predeterminada
      }
    }
  }, [text, synth]);

  const handlePlay = () => {
    if (synth && selectedVoice) {
      const newUtterance = new SpeechSynthesisUtterance(text);
      newUtterance.voice = selectedVoice;

      newUtterance.onboundary = (event) => {
        const charIndex = event.charIndex;
        const totalChars = text.length;
        const progressPercentage = (charIndex / totalChars) * 100;
        setProgress(progressPercentage);
        setCurrentTime((duration * progressPercentage) / 100);
      };

      newUtterance.onend = () => {
        setProgress(100);
        setCurrentTime(duration);
      };

      setUtterance(newUtterance);
      synth.speak(newUtterance);
    }
  };

  const handlePause = () => {
    if (synth && synth.speaking) {
      synth.pause();
    }
  };

  const handleResume = () => {
    if (synth && synth.paused) {
      synth.resume();
    }
  };

  const handleStop = () => {
    if (synth) {
      synth.cancel();
      setProgress(0);
      setCurrentTime(0);
    }
  };

  const handleChangeVoice = () => {
    if (synth) {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]); // Cambia la voz a la primera en la lista como ejemplo
      }
    }
  };

  // Formatear tiempo en minutos y segundos
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-4 bg-blue-600 rounded-lg shadow-md items-center">
      <div className="space-y-2">
        <input
          type="range"
          value={progress}
          className="w-full"
          min="0"
          max="100"
          readOnly
        />
        <div className="flex justify-between text-sm text-black">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handlePlay}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <VscDebugStart size={32} />
          </button>
          <button
            onClick={handlePause}
            className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            <VscDebugPause size={32} />
          </button>
          <button
            onClick={handleResume}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <VscDebugContinueSmall size={32} />
          </button>
          <button
            onClick={handleStop}
            className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <VscDebugStop size={32} />
          </button>

          <button
            onClick={handleChangeVoice}
            className="p-2 bg-gray-500 text-white rounded hover:bg-red-600"
          >
            Cargar Voces
          </button>
        </div>

        <div className="mt-3 justify-center w-full">
          <select
            value={selectedVoice ? selectedVoice.name : ""}
            onChange={(e) => {
              const voice = voices.find((v) => v.name === e.target.value);
              setSelectedVoice(voice);
            }}
            className="p-3 border border-black-300 rounded text-black"
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeechControls;
