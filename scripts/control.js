import { firebase } from "./crudFirebase.js"

let contId = 0

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


initializeUserList()

btnRegister.addEventListener('click', showInsertForm)

btnInsert.addEventListener('click', () => {
    if(inputValidation(InsertName, InsertLastName, InsertAge, InsertCpf)){
        firebase.addUserDB(getUserInsertedValue())
        initializeUserList()
        resetForm()
    }
})

btnCloseInsert.addEventListener('click', () => {
    showInsertForm()
    resetForm()
})

btnUpdate.addEventListener('click', async () => {
    if(inputValidation(UpdateName, UpdateLastName, UpdateAge, UpdateCpf)){
        await firebase.updateUserDB(UpdateName, UpdateLastName, UpdateGender, UpdateAge, UpdateCpf)
        initializeUserList()
    }
})

btnCloseUpdate.addEventListener('click', () => {
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
        firebase.pasteEditValue(UpdateName, UpdateLastName, UpdateGender, UpdateAge, UpdateCpf)
    }
}



async function initializeUserList(){ //7 - iniciando lista de usuarios no view e tbm é chamado novamente ao adicionar, excluir ou alterar um dado para atualizar a lista

    await firebase.readDB()
    userList.innerHTML = ''  // clearing user list

    firebase.docsDB.forEach(doc => {
        createUserItemList(doc)
    })

    contId = 0
    // console.log(firebase.docsDB)
}

function createUserItemList(doc){ //8 - criando elementos da lista

    let tRow = document.createElement('tr')
    tRow.id = contId //deixando uma âncora para trabalhar os dados no crud

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

    let btnEdit = document.createElement('a')
    btnEdit.classList.add('btn')
    btnEdit.classList.add('btn-edit')
    btnEdit.innerHTML = 'Edit'
    btnEdit.setAttribute('href','#form_update')
    btnEdit.addEventListener('click', function(event){
        if(listValidation(event)){
            firebase.getUserId(event) // pegando elemento tr para trabalhar o id
            showUpdateForm()
        }else{
            location.reload()
        }
    })
    tdBtns.appendChild(btnEdit)

    let btnDelete = document.createElement('button')
    btnDelete.classList.add('btn')
    btnDelete.classList.add('btn-delete')
    btnDelete.innerHTML = 'Delete'
    btnDelete.addEventListener('click', async (event) => {
        if(listValidation(event)){
            await firebase.deleteUserDB(event)
            initializeUserList()
        }else{
            location.reload()
        }
    })
    tdBtns.appendChild(btnDelete)

    tRow.appendChild(tdNome)
    tRow.appendChild(tdSobrenome)
    tRow.appendChild(tdGenero)
    tRow.appendChild(tdIdade)
    tRow.appendChild(tdCpf)
    tRow.appendChild(tdBtns)
    userList.appendChild(tRow)

    contId++
}


function getUserInsertedValue(){
    return {
        nome: InsertName.value.toLowerCase(),
        sobrenome: InsertLastName.value.toLowerCase(),
        genero: InsertGender.value,
        idade: parseInt(InsertAge.value),
        cpf: InsertCpf.value
    }
}

function listValidation(event){ // verificação de dados para que não haja alteração nos ids

    firebase.getUserId(event)

    let nameHtml =  event.target.parentElement.parentElement.firstChild.innerHTML
    let cpfHtml =  event.target.parentElement.parentElement.children[4].innerHTML

    if(firebase.docsDB[firebase.userId].data().nome == nameHtml  &&  firebase.docsDB[firebase.userId].data().cpf == cpfHtml){
        return true
    }else{

        return false
    }
}

function inputValidation(inputName, inputLastName, inputAge, inputCpf){ // verificação de campos

    if(inputName.value == '' || typeof(inputName.value) != 'string'){
        alert('Incorrent Name')
        return false
    }

    if(inputLastName.value == '' || typeof(inputLastName.value) != 'string'){
        alert('Incorrent Last Name')
        return false
    }

    if(inputAge.value == ''){
        alert('Incorrent Age')
        return false
    }

    if(inputCpf.value.length != 11){
        alert('Incorrent Cpf')
        return false
    }

    return true
}