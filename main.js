const modal = document.getElementById('modal');
const botao = document.getElementById('cadastrarCliente')
const botaofecha = document.getElementById('modal-close')
const btnSalvar = document.getElementById('salvar')


const openModal = () => modal.classList.add('active')
const closeModal = () =>{
    clearFields()
    modal.classList.remove('active')
} 

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [] // tb poderia ser || [] 
const setLocalStorage = (dbClient) => localStorage.setItem('db_client', JSON.stringify(dbClient))

//CRUD

const deleteClient = (index) =>{
    const dbClient = readClient()
    dbClient.splice(index,1)
    setLocalStorage(dbClient)

}
const updateClient = (i, client) => {
    const dbClient = readClient()
    dbClient[i] = client
    setLocalStorage(dbClient)

}


const readClient = () => getLocalStorage()


const createClient = (client) =>{
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)

}

const isValidFields = () =>{
    return document.getElementById('form').reportValidity()
    
}

//Interação com layout

const clearFields = () =>{
   const fields = document.querySelectorAll('.modal-field')
   fields.forEach(field => field.value = '')
}

    const saveClient = ()=>{
        if(isValidFields()){
            const client = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value,
                idade: document.getElementById('idade').value,
            }
            const index = document.getElementById('nome').dataset.index
            if(index == 'new'){
                createClient(client)
                updateTable()
                closeModal()
            }else{
                updateClient(index, client)
                updateTable()
                document.getElementById('nome').dataset.index = 'new';
                closeModal()
            }
            
        }
        
        
    }

    const createRow = (client, index) => {
        const newRow = document.createElement('tr')
        newRow.innerHTML =  `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.telefone}</td>
        <td>${client.idade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}"> Editar</button>
            <button type="button" class="button red" id="delete-${index}"> Excluir</button>
        </td>
        `

        document.querySelector('#tableClient>tbody').appendChild(newRow)
    }

    const clearTable = () =>{
        const rows = document.querySelectorAll('#tableClient>tbody tr')
        rows.forEach(row => row.parentNode.removeChild(row))
    }

    const updateTable = ()=> {
        const dbClient = readClient()
        clearTable()
        dbClient.forEach(createRow)
        
    }

    updateTable()   

    const fillFields = (client)=>{
        document.getElementById('nome').value = client.nome
        document.getElementById('email').value = client.email
        document.getElementById('telefone').value = client.telefone
        document.getElementById('idade').value = client.idade
        document.getElementById('nome').dataset.index = client.index


    }

    const editClient = (index)=> {
        const client = readClient()[index]
        client.index = index
        fillFields(client)
        openModal()
        
    }
    

    const editDelete = (e)=>{

        if(e.target.type == 'button'){

            const [action, index] = e.target.id.split('-')
            
            if(action == 'edit'){
                    editClient(index)

            }else{
                const client = readClient()[index]
                const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
                if(response){
                    deleteClient(index)
                    updateTable()
                }
                
                
            }

        }

    }
// Eventos
botao.addEventListener('click',openModal)
botaofecha.addEventListener('click', closeModal)
btnSalvar.addEventListener('click',saveClient)

document.querySelector('#tableClient>tbody').addEventListener('click', editDelete)