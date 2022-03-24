import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js"; //1 - inicialização Firebase FireStore .. substituir aqui! a config do firestore

const firebaseConfig = {
    apiKey: "AIzaSyDS_w4ZEM9Us0ZUzTYmD0p35TCsUKi8z_k",
    authDomain: "teste-43d7c.firebaseapp.com",
    projectId: "teste-43d7c",
    storageBucket: "teste-43d7c.appspot.com",
    messagingSenderId: "41835035006",
    appId: "1:41835035006:web:f7bfc9d1630779c85bdb2f",
    measurementId: "G-4JPCFJPPCV"
};

const app = initializeApp(firebaseConfig); //Conectando com o banco de dados

import { getFirestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js"

const db = getFirestore() //pegando banco de dados

const collectionName = 'usuario' //2 - varial com a coleção desejada e maleável ... Alterar aqui! para o nome da sua coleção criada
const usuarioCollectionRef = collection(db, collectionName) //3 - acessando coleção usuario



export const firebase = {
    
    docsDB: [],
    UserID: null,

    readDB: async function(){ //4 - Lendo os dados do Firestore DB
        
        var querySnapshot = await getDocs(usuarioCollectionRef); //querySnapshot é um referencia do banco de dados... Default => const querySnapshot = await getDocs(collection(db, "usuario"));
        this.clearDocsDB() // limpando array de usuarios ao ler novamente
        querySnapshot.forEach((doc)=> {
            // console.log(doc.id, "=>", doc.data());
            // console.log(doc.data().nome)
            this.getUsersDB(doc) //6 - executando pega de usuarios
        });
    },

    getUsersDB: function(doc){ //5 - pegando todos os documentos dentro da coleção e colocando dentro de um array
        this.docsDB.push(doc)
    },


    addUserDB: async function(objUserData){ //9 - adiconando dados
        let add = await addDoc(usuarioCollectionRef, objUserData)
        .then(()=>{
            // alert('User added successfully')
        })
        .catch((error)=>{
            alert('Error:' + error)
        })
    },

    
    getUserId: function(event){

        let user = event.target.parentElement.parentElement;
        this.UserID = user.id
    },

    deleteUserDB: function(event){//10 - deletando dados
    
        this.getUserId(event)
        deleteDoc(doc(db, collectionName, this.UserID));
        // alert('User Successfully Deleted')
    },

    
    clearDocsDB: function(){
        this.docsDB = []
    },

    
    pasteEditValue: async function(name, lastname, gender, age, cpf){ //11 - quando abrir o form de editar dados ele já trás os campos preenchidos com o do campo clicado
    
        let docRef = await doc(db, 'usuario' , this.UserID)
        let docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            name.value = docSnap.data().nome
            lastname.value = docSnap.data().sobrenome
            gender.value = docSnap.data().genero
            age.value = docSnap.data().idade
            cpf.value = docSnap.data().cpf
          } else {
            // doc.data() will be undefined in this case
            // console.log("No such document!");
          }
    },

    updateUserDB: async function(name, lastname, gender, age, cpf){ //12 - pegar os dados do form edit e envia para o banco de dados

        let ref = await doc(db, 'usuario' , this.UserID)
    
        updateDoc(ref, {
            nome: name.value,
            sobrenome: lastname.value,
            genero: gender.value,
            idade: parseInt(age.value),
            cpf: cpf.value
        })
    },
}

// console.log(firebase)
