import express from 'express';
import { uploadFile } from './config.js'; // Importamos la función para subir el archivo de audio a Firebase Storage
import OpenAI from 'openai';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3001;
const openai = new OpenAI(process.env.OPENAI_API_KEY);

app.use(cors({
  origin: 'http://localhost:3000',
}));

// Middleware para procesar solicitudes JSON
app.use(express.json());

// Ruta para recibir el texto a convertir y generar el audio
app.post('/convertir-texto-a-audio', async (req, res) => {
  try {
    const { texto } = req.body; // Obtener el texto de la solicitud

    // Lógica para convertir texto a audio utilizando la API de OpenAI
    const audioFile = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: texto,
    });

    // En la ruta de subida de archivos
    const nombreArchivo = `audio-${Date.now()}.mp3`; // Cambiar la extensión de archivo según el formato de audio
    
    const buffer = Buffer.from(await audioFile.arrayBuffer());

    // Guardar el archivo de audio localmente en el servidor
    const path = `./archivos-audio/${nombreArchivo}`; // Ruta donde se guardará el archivo localmente
    fs.writeFileSync(path, buffer); // Escribir el buffer en el archivo

    // Subir el archivo de audio a Firebase Storage y obtener la URL de descarga
    const url = await uploadFile(nombreArchivo, buffer);

    // Enviar la URL de descarga como respuesta al cliente
    res.json({ success: true, mensaje: 'Audio generado con éxito', ruta: url });
  } catch (error) {
    console.error('Error al convertir texto a audio:', error);
    res.status(500).json({ success: false, mensaje: 'Error al convertir texto a audio' });
  }
});

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});

