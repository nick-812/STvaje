

console.log("hello");



/*
document.getElementById('new_users').addEventListener('click', async () => {
    console.log("hh");

    const response = await axios.get('http://0.0.0.0:8080/users');
    console.log (response.data)
    const dodajUporabnika = (user) => {
        const element = document.getElementById ("users");
        const newUser = document.createElement("tr");
        newUser.innerHTML = '<td>${user.id}</td><td>${user.name}</td><td>${user.website}</td>'
        if (element) element.appendChild (newUser);
    }
    for (const user of response.data) {
        dodajUporabnika(user);
    }
})
*/