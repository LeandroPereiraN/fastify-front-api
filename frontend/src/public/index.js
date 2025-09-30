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

const deleteUser = async (nombre, apellido) => {
    const success = await userService.deleteUser(nombre, apellido);
    if (success) {
        await showUserList();
    }
}

const showUserList = async () => {
    const users = await userService.getAllUsers();
    const content = document.getElementById('content');

    if (users.length === 0) {
        content.innerHTML = '<p>No hay usuarios registrados</p>';
        return;
    }

    content.innerHTML = getUserListHTML(users);

    createEditForm();
};

const createEditForm = () => {
    const content = document.getElementById('content');

    // Crear formulario de edición
    const formEditar = document.createElement("form");
    formEditar.id = "formEditar";
    formEditar.style.display = "none";
    formEditar.style.marginTop = "10px";

    const inputEditarNombre = document.createElement("input");
    inputEditarNombre.id = "inputEditarNombre";
    inputEditarNombre.placeholder = "Nuevo nombre";
    inputEditarNombre.required = true;

    const inputEditarApellido = document.createElement("input");
    inputEditarApellido.id = "inputEditarApellido";
    inputEditarApellido.placeholder = "Nuevo apellido";
    inputEditarApellido.required = true;

    const btnGuardarEdicion = document.createElement("button");
    btnGuardarEdicion.type = "submit";
    btnGuardarEdicion.textContent = "Guardar";

    const btnCancelarEdicion = document.createElement("button");
    btnCancelarEdicion.type = "button";
    btnCancelarEdicion.textContent = "Cancelar";
    btnCancelarEdicion.onclick = () => {
        formEditar.style.display = "none";
        clearEditForm();
    };

    formEditar.append(inputEditarNombre, inputEditarApellido, btnGuardarEdicion, btnCancelarEdicion);
    content.appendChild(formEditar);

    let usuarioEditando = null;

    window.abrirEdicion = async (index) => {
        usuarioEditando = await userService.getUserByIndex(index);
        if (usuarioEditando) {
            inputEditarNombre.value = usuarioEditando.nombre;
            inputEditarApellido.value = usuarioEditando.apellido;
            formEditar.style.display = "block";
        }
    };

    formEditar.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!usuarioEditando) return;

        const nuevoNombre = inputEditarNombre.value.trim();
        const nuevoApellido = inputEditarApellido.value.trim();

        const success = await userService.updateUser(usuarioEditando, nuevoNombre, nuevoApellido);

        if (success) {
            formEditar.style.display = "none";
            clearEditForm();
            await showUserList();
        }
    });

    function clearEditForm() {
        inputEditarNombre.value = "";
        inputEditarApellido.value = "";
        usuarioEditando = null;
    }
};

const showCreateForm = () => {
    const content = document.getElementById('content');

    content.innerHTML = `
        <h2>Crear usuario</h2>
        <form id="usersForm">
            <label for="nombre">Nombre:</label>
            <input id="nombre" type="text" name="nombre" required><br>
            <label for="apellido">Apellido:</label>
            <input id="apellido" type="text" name="apellido" required><br>
            <label for="password">Contraseña:</label>
            <input id="password" type="text" name="password" required><br>
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
    const password = document.getElementById('password').value.trim();

    const success = await userService.createUser(nombre, apellido, password);

    if (success) {
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        document.getElementById('password').value = '';
        await showUserList();
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    await showUserList();
});