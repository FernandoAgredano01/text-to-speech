import { initializeApp } from 'firebase/app';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadFile(nombreArchivo, audioFile) {
    const storageRef = ref(storage, nombreArchivo);
    await uploadBytes(storageRef, audioFile, { contentType: 'audio/mpeg' })
    const url = await getDownloadURL(storageRef)
    return url
}