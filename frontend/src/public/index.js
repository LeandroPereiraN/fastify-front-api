const usersForm = document.getElementById("usersForm")
const inputName = document.getElementById("nombre")
const inputLastName = document.getElementById("apellido")

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
            await showUserList();
            alert('Usuario eliminado exitosamente');
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

        // Crea el formulario dentro de content
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

        const btnCancelarEdicion = document.createElement("button");
        btnCancelarEdicion.textContent = "Cancelar";
        btnCancelarEdicion.type = "button";
        btnCancelarEdicion.style.backgroundColor = "#6c757d";
        btnCancelarEdicion.style.color = "white";
        btnCancelarEdicion.style.border = "1px solid #6c757d";

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.marginTop = "10px";
        buttonContainer.append(btnGuardarEdicion, btnCancelarEdicion);

        formEditar.append(inputEditarNombre, inputEditarApellido, buttonContainer);
        content.appendChild(formEditar);

        let usuarioEditando = null;

        window.abrirEdicion = async (index) => {
            const freshUsers = await getUsers();
            usuarioEditando = freshUsers[index];
            inputEditarNombre.value = usuarioEditando.nombre;
            inputEditarApellido.value = usuarioEditando.apellido;
            formEditar.style.display = "block";
        };

        btnCancelarEdicion.addEventListener("click", () => {
            formEditar.style.display = "none";
            usuarioEditando = null;
            inputEditarNombre.value = "";
            inputEditarApellido.value = "";
        });

        // Otro evento - guardar
        formEditar.addEventListener("submit", async (e) => {
            e.preventDefault();
            const nuevoNombre = inputEditarNombre.value.trim();
            const nuevoApellido = inputEditarApellido.value.trim();

            if (!nuevoNombre || !nuevoApellido) {
                alert("Complete ambos campos");
                return;
            }

            // Verificar si no hay cambios
            if (nuevoNombre === usuarioEditando.nombre && nuevoApellido === usuarioEditando.apellido) {
                alert("No se han realizado cambios");
                return;
            }

            try {
                const allUsers = await getUsers();

                const userExist = allUsers.find(user =>
                    user.nombre.toLowerCase() === nuevoNombre.toLowerCase() &&
                    user.apellido.toLowerCase() === nuevoApellido.toLowerCase()
                );

                if (userExist) {
                    alert("Ya existe un usuario con ese nombre y apellido.");
                    return;
                }

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
                    await showUserList();
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
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <button type="submit">Crear</button>
                <button type="button" id="cancelBtn" style="background-color: #6c757d; color: white; border: 1px solid #6c757d;">Cancelar</button>
            </div>
        </form>
    `;

    const form = document.getElementById('usersForm');
    form.addEventListener('submit', handleCreateUser);

    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => {
        showUserList();
    });
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
            await showUserList();
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

document.addEventListener('DOMContentLoaded', async () => {
    await showUserList();
});