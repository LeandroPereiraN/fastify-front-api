const usersForm = document.getElementById("usersForm")
const inputName = document.getElementById("nombre")
const inputLastName = document.getElementById("apellido")

const getUsers = async () => {
    const res = await fetch('http://localhost:3000/users')
    users = await res.json()
    return users;
}

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

const insertUsersToList = async () => {
    const userList = document.getElementById('userList')
    const users = await getUsers();

    userList.innerHTML = users.reduce((html, user) => {
        return html + `<li>${user.nombre} ${user.apellido}</li>`
    }, '')
}

usersForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    createUser();
    insertUsersToList()
})

insertUsersToList();