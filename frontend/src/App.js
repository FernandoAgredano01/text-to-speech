import React, { useState } from 'react';
import './index.css';

const App = () => {
  const [texto, setTexto] = useState('');
  const [rutaAudio, setRutaAudio] = useState('');
  const [audioGenerado, setAudioGenerado] = useState(false);

  const handleGenerarAudio = async () => {
    const response = await fetch('http://localhost:3001/convertir-texto-a-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ texto }),
    });
    const data = await response.json();
    if (data.success) {
      setRutaAudio(data.ruta);
      setAudioGenerado(true);
    } else {
      console.error('Error al generar el archivo de audio');
    }
  };

  const handleVolverAIntentar = () => {
    setAudioGenerado(false);
    setTexto('');
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-200">
      <h1 className="text-3xl font-serif mb-6 mt-20">TEXT-TO-SPEECH</h1>
      <textarea
        className="w-2/3 h-28 p-2 rounded-lg border-4 border-black shadow-md mb-4"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe aquí el texto que deseas convertir a audio..."
        rows={4}
        cols={50}
        disabled={audioGenerado}
      />
      {audioGenerado ? (
        <div className="flex flex-col items-center">
          <button
            className="h-16 w-80 bg-pink-600 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded mb-4"
            onClick={handleVolverAIntentar}
          >
            Volver a intentarlo
          </button>
          <div className="flex justify-center mt-5 items-center gap-10">
            <audio controls className="h-18 w-100 text-white font-bold rounded">
              <source src={rutaAudio} type="audio/mpeg" />
              Su navegador no soporta el elemento de audio.
            </audio>
            <a
              href={rutaAudio}
              download="audio.mp3"
              className="h-18 w-100 text-black font-bold rounded"
              target="_blank" rel="noopener noreferrer"
            >
              Download
            </a>
          </div>
        </div>
      ) : (
        <button
          className="h-16 w-80 bg-pink-600 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded"
          onClick={handleGenerarAudio}
        >
          Generar Audio
        </button>
      )}
    </div>
  );
};

export default App;
