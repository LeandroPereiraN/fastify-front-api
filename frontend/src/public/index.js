const usersForm = document.getElementById("usersForm")
const inputName = document.getElementById("nombre")
const inputLastName = document.getElementById("apellido")

/*

const createUser = async () => {
    await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: inputName.value,
            apellido: inputLastName.value
        })
    });
}
*/

const getUserListHTML = (users) => {
    return `
        <ul id="userList">
            ${users.map(user => `
                <li>
                    ${user.nombre} ${user.apellido}
                    <button onclick="deleteUser('${user.nombre}', '${user.apellido}')">Eliminar</button>
                </li>
            `).join('')}
        </ul>
    `;
}

const getUsers = async () => {
    const res = await fetch('http://localhost:3000/users')
    users = await res.json()
    return users;
}

const createUser = async (nombre, apellido) => {
    await fetch('http://localhost:3000/users', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            apellido: apellido
        })
    });
}

const updateUser = async (nombre, apellido) => {
    await fetch('http://localhost:3000/users', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            apellido: apellido
        })
    });
}

const insertUsersToList = async () => {
    const userList = document.getElementById('userList')
    const users = await getUsers();

    userList.innerHTML = users.reduce((html, user) => {
        return html + `<li>${user.nombre} ${user.apellido}</li>`
    }, '')
}

/*
usersForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    createUser();
    insertUsersToList()
})
*/

const deleteUser = async (nombre, apellido) => {
    try {
        const response = await fetch(`http://localhost:3000/users`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre,
                apellido: apellido
            })
        });
        
        if (response.ok) {
            showUserList();
        } else {
            const errorData = await response.json();
            alert('Error al eliminar usuario: ' + errorData.message);
        }
    } catch (err) {
        console.error('Error al eliminar usuario:', err);
    }
}

const showUserList = async () => {
    try {
        const users = await getUsers();
        const content = document.getElementById('content');
        content.innerHTML = getUserListHTML(users);

    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        document.getElementById('content').innerHTML = '<p>Error al cargar los usuarios</p>';
    }
}

showUserList();