// Importação 
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "colocar apikey aqui",
    authDomain: "cominio de autenticação aqui",
    projectId: "nome do seu projeto aqui",
    storageBucket: "storange",
    messagingSenderId: "id de identificação mensage aqui",
    appId: "id do aplicativo",
    measurementId: "outra id "
  };

// Inicializar a conexão com o Firebase
firebase.initializeApp(firebaseConfig);

// Exportar a instância do Firestore
export const firestore = firebase.firestore();
