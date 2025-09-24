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
            ${users.map((user, index) => `
                <li>
                    ${user.nombre} ${user.apellido}
                    <button onclick="abrirEdicion(${index})">Modificar</button> 
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

/*const showUserList = async () => {
    try {
        const users = await getUsers();
        const content = document.getElementById('content');
        content.innerHTML = getUserListHTML(users);

    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        document.getElementById('content').innerHTML = '<p>Error al cargar los usuarios</p>';
    }
}*/

const showUserList = async () => {
    try {
        const users = await getUsers();
        const content = document.getElementById('content');
        content.innerHTML = getUserListHTML(users);

        // Crea el formulario dentro de content, ver con el equipo luego si lo dejamos asi
        const formEditar = document.createElement("form");
        formEditar.id = "formEditar";
        formEditar.style.display = "none";
        formEditar.style.marginTop = "10px";

        const inputEditarNombre = document.createElement("input");
        inputEditarNombre.placeholder = "Nuevo nombre";

        const inputEditarApellido = document.createElement("input");
        inputEditarApellido.placeholder = "Nuevo apellido";

        const btnGuardarEdicion = document.createElement("button");
        btnGuardarEdicion.textContent = "Guardar";

        formEditar.append(inputEditarNombre, inputEditarApellido, btnGuardarEdicion);
        content.appendChild(formEditar);

        let usuarioEditando = null;

        window.abrirEdicion = async (index) => {
            const freshUsers = await getUsers();
            usuarioEditando = freshUsers[index];
            inputEditarNombre.value = usuarioEditando.nombre;
            inputEditarApellido.value = usuarioEditando.apellido;
            formEditar.style.display = "block";
        };

        // Otro evento - guardar
        formEditar.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nuevoNombre = inputEditarNombre.value.trim();
            const nuevoApellido = inputEditarApellido.value.trim();

            if (!nuevoNombre || !nuevoApellido) {
                alert("Complete ambos campos");
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/users', {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nombreOriginal: usuarioEditando.nombre,
                        apellidoOriginal: usuarioEditando.apellido,
                        nombre: nuevoNombre,
                        apellido: nuevoApellido
                    })
                });

                if (response.ok) {
                    alert("Usuario modificado exitosamente");
                    showUserList(); 
                } else {
                    const errorData = await response.json();
                    alert("Error: " + errorData.message);
                }
            } catch (error) {
                console.error("Error al modificar usuario:", error);
                alert("Error de conexión con el servidor");
            }
        });

    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        document.getElementById('content').innerHTML = '<p>Error al cargar los usuarios</p>';
    }
};

// Muestra el formulario para crear un usuario
const showCreateForm = () => {
    const content = document.getElementById('content');

    // Se inyecta en index.HtML, en div content
    content.innerHTML = `
        <h2>Crear usuario</h2>
        <form id="usersForm">
            <label for="nombre">Nombre:</label>
            <input id="nombre" type="text" name="nombre" required><br>
            <label for="apellido">Apellido:</label>
            <input id="apellido" type="text" name="apellido" required><br>
            <button type="submit">Crear</button>
        </form>
    `;

    const form = document.getElementById('usersForm');
    form.addEventListener('submit', handleCreateUser);
};

const handleCreateUser = async (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();

    if (!nombre || !apellido) {
        alert('Por favor completa ambos campos');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, apellido })
        });

        if (response.ok) {
            // Si esta ok se actualiza la lista
            alert('Usuario creado exitosamente');
            showUserList();
        } else {
            // Si no esta ok, muestra el error
            const errorData = await response.json();
            alert('Error: ' + errorData.message);
        }
    } catch (error) {
        console.error('Error al crear usuario:', error);
        alert('Error de conexión con el servidor');
    }
};
