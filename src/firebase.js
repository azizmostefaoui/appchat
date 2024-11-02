import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyABciFg4h9h3qfLZw9fgr-mZXgK17nwq6c",
    authDomain: "chat-app-34502.firebaseapp.com",
    projectId: "chat-app-34502",
    storageBucket: "chat-app-34502.appspot.com",
    messagingSenderId: "65744260386",
    appId: "1:65744260386:web:945a83b9aa4a4b8e15297b"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db= getFirestore();
