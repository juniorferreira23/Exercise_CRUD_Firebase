//-----------Inicialização---------------------------------
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

const app = initializeApp(firebaseConfig);
//------------------------------------------------------------

import { getFirestore, doc, onSnapshot, getDocs, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField, query, where } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js"

const db = getFirestore() //Conectando com o banco de cados
const usuarioCollectionRef = collection(db, 'usuario') //referencia da coleção usuario

const btnRegister = document.querySelector('.btn-register')

const formInsertUser = document.querySelector('.form-insert-user')
const InsertName = document.querySelector('#insert_name')
const InsertLastName = document.querySelector('#insert_last_name')
const InsertGender = document.querySelector('#insert_gender')
const InsertAge = document.querySelector('#insert_age')
const InsertCpf = document.querySelector('#insert_cpf')

const btnInsert = document.querySelector('#btn_insert')
const btnCloseInsert = document.querySelector('#close_insert_form')

const formUpdateUser = document.querySelector('.form-update-user')
const UpdateName = document.querySelector('#update_name')
const UpdateLastName = document.querySelector('#update_last_name')
const UpdateGender = document.querySelector('#update_gender')
const UpdateAge = document.querySelector('#update_age')
const UpdateCpf = document.querySelector('#update_cpf')

const btnUpdate = document.querySelector('#btn_update')
const btnCloseUpdate = document.querySelector('#close_update_form')

const userList = document.querySelector('.table-body')

let USER = null

createUserList()


btnRegister.addEventListener('click', showInsertForm)

btnInsert.addEventListener('click', ()=>{
    addData()
    createUserList()
    resetForm()
})

btnCloseInsert.addEventListener('click', ()=>{
    showInsertForm()
    resetForm()
})

btnUpdate.addEventListener('click', updateUser)

btnCloseUpdate.addEventListener('click', ()=>{
    showUpdateForm()
    resetForm()
})


function resetForm(){
    InsertName.value = ''
    InsertLastName.value = ''
    InsertAge.value = ''
    InsertCpf.value = ''
}


function showInsertForm(){
    if(formInsertUser.classList.contains('show')){
        formInsertUser.classList.remove('show')
    }else{
        formInsertUser.classList.add('show')
    }
}

function showUpdateForm(){
    if(formUpdateUser.classList.contains('show')){
        formUpdateUser.classList.remove('show')
    }else{
        formUpdateUser.classList.add('show')
        necklaceData()
    }

}


//----------------- ADICIONANDO DADOS/ INSERT DATA -----------------------
async function addData(){
    let add = await addDoc(usuarioCollectionRef, {
        nome: InsertName.value,
        sobrenome: InsertLastName.value,
        genero: InsertGender.value,
        idade: parseInt(InsertAge.value),
        cpf: InsertCpf.value
    })
    .then(()=>{
        // alert('User added successfully')
    })
    .catch((error)=>{
        alert('Error:' + error)
    })
}

//------- LENDO TODOS OS DADOS DA COLEÇÃO/ READING ALL COLLECTION ---------
async function createUserList(){

    var querySnapshot = await getDocs(usuarioCollectionRef); //querySnapshot é um espelho do banco de dados... Default => const querySnapshot = await getDocs(collection(db, "usuario"));
    userList.innerHTML = ''  // clearing user list

    querySnapshot.forEach((doc)=> {
    // console.log(doc.id, "=>", doc.data());
    // console.log(doc.data().nome)
    createUserItemListDB(doc)
    });


}

function createUserItemListDB(doc){

    let tRow = document.createElement('tr')
    tRow.id = doc.id

    let tdNome = document.createElement('td')
    tdNome.innerHTML = doc.data().nome

    let tdSobrenome = document.createElement('td')
    tdSobrenome.innerHTML = doc.data().sobrenome

    let tdGenero = document.createElement('td')
    tdGenero.innerHTML = doc.data().genero

    let tdIdade = document.createElement('td')
    tdIdade.innerHTML = doc.data().idade

    let tdCpf = document.createElement('td')
    tdCpf.innerHTML = doc.data().cpf

    let tdBtns = document.createElement('td')

    let btnUpdate = document.createElement('button')
    btnUpdate.classList.add('btn')
    btnUpdate.classList.add('btn-update')
    btnUpdate.innerHTML = 'Edit'
    btnUpdate.addEventListener('click', getUserId)
    btnUpdate.addEventListener('click', showUpdateForm)
    tdBtns.appendChild(btnUpdate)

    let btnDelete = document.createElement('button')
    btnDelete.classList.add('btn')
    btnDelete.classList.add('btn-delete')
    btnDelete.innerHTML = 'Delete'
    btnDelete.addEventListener('click', deleteUser)
    tdBtns.appendChild(btnDelete)

    tRow.appendChild(tdNome)
    tRow.appendChild(tdSobrenome)
    tRow.appendChild(tdGenero)
    tRow.appendChild(tdIdade)
    tRow.appendChild(tdCpf)
    tRow.appendChild(tdBtns)
    userList.appendChild(tRow)
}


//------------ DELETANDO USUARIO/ DELETE USER -------------------
function deleteUser(event){

    let user = event.target.parentElement.parentElement;
    // console.log(user.id)

    deleteDoc(doc(db, "usuario", user.id));
    // alert('User Successfully Deleted')

    createUserList()
}


//------------ EDITANDO USUARIO/ UPDATE USER -------------------
async function updateUser(){

    let ref = await doc(db, 'usuario' , USER)

    updateDoc(ref, {
        nome: UpdateName.value,
        sobrenome: UpdateLastName.value,
        genero: UpdateGender.value,
        idade: parseInt(UpdateAge.value),
        cpf: UpdateCpf.value
    })

    createUserList()
}

async function necklaceData(){

    let docRef = await doc(db, 'usuario' , USER)
    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        UpdateName.value = docSnap.data().nome
        UpdateLastName.value = docSnap.data().sobrenome
        UpdateGender.value = docSnap.data().genero
        UpdateAge.value = docSnap.data().idade
        UpdateCpf.value = docSnap.data().cpf
      } else {
        // doc.data() will be undefined in this case
        // console.log("No such document!");
      }
}

function getUserId(event){

    let user = event.target.parentElement.parentElement;
    
    USER = user.id

}