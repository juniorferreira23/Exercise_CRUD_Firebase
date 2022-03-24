import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";

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

const collectionName = 'usuario'
const usuarioCollectionRef = collection(db, collectionName) //referencia da coleção usuario



export const firebase = {
    
    docsDB: [],
    UserID: null,

    readDB: async function(){
        
        var querySnapshot = await getDocs(usuarioCollectionRef); //querySnapshot é um referencia do banco de dados... Default => const querySnapshot = await getDocs(collection(db, "usuario"));
        this.clearDocsDB()
        querySnapshot.forEach((doc)=> {
            // console.log(doc.id, "=>", doc.data());
            // console.log(doc.data().nome)
            this.docsDB.push(doc)
        });
    },


    addUserDB: async function(objUserData){
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

    deleteUserDB: function(event){
    
        this.getUserId(event)
        deleteDoc(doc(db, collectionName, this.UserID));
        // alert('User Successfully Deleted')
    },

    
    clearDocsDB: function(){
        this.docsDB = []
    },

    
    pasteEditValue: async function(name, lastname, gender, age, cpf){
    
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

    updateUserDB: async function(name, lastname, gender, age, cpf){

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
