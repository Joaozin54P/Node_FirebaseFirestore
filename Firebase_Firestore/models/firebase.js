const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
apiKey: "AIzaSyBSB--BxgCALlYff6SpFmKS33gavF8aUYo",
authDomain: "projeto-webzinho.firebaseapp.com",
projectId: "projeto-webzinho",
storageBucket: "projeto-webzinho.firebasestorage.app",
messagingSenderId: "582403109508",
appId: "1:582403109508:web:e605bae74a1036a7a6c8d1",
measurementId: "G-2G6BXG0PFN"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Retorna o banco de dados Firestore
const db = getFirestore(app);

module.exports = db;