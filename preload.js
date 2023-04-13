const axios = require('axios');

const { contextBridge, ipcRenderer, globalShortcut } = require('electron');
const dexie = require('dexie');

console.log ("preload");


let token = ""


document.addEventListener('DOMContentLoaded', async () => {
    console.log("hh");

    const db = new dexie('localDB');
    db.version(3).stores({
        pets: '_id, name, date_of_birth, animal_id, user_id', // Primary key and indexed props
        newPets: 'name, _id, date_of_birth, animal_id, user_id',
    });



    /*const response = await axios.post('http://localhost:8083/register', {
        username: 'nick812',
        password: 'geslo123'
    });*/
    const login = await axios.post('http://localhost:8083/login', {
        username: 'nick812',
        password: 'geslo123'
    });
    
    token = login.data['token'];

    axios.defaults.headers.common = {'Authorization': `bearer ${token}`};







    //posodobitev ob zagonu
    document.getElementById("upload").click();

    const petsList = await db.pets.toArray();
    const newpetsList = await db.newPets.toArray();

    const dodajPet = (pet) => {
        const element = document.getElementById("users");
        const newUser = document.createElement("tr");
        newUser.innerHTML = `<td>${pet._id}</td><td>${pet.name}</td><td>${pet.date_of_birth}</td><td>${pet.animal_id}</td><td>${pet.user_id}</td>`
        if (element) element.appendChild (newUser);
    }
    for (const pet of petsList) {
        dodajPet(pet);
    }
    for (const pet of newpetsList) {
        dodajPet(pet);
    }


    document.getElementById("new_users").addEventListener('click', async () => {
        console.log("click");
        
        const oldPets = await db.pets.toArray();
        const newPetsList = await db.newPets.toArray();

        var Table = document.getElementById("users");
        Table.innerHTML = "<tr><th width=\"20%\">ID</th><th width=\"20%\">Name</th><th width=\"20%\">Date</th><th width=\"20%\">Animal ID</th><th width=\"20%\">Owner ID</th></tr>";

        const dodajPet = (pet) => {
            const element = document.getElementById("users");
            const newUser = document.createElement("tr");
            newUser.innerHTML = `<td>${pet._id}</td><td>${pet.name}</td><td>${pet.date_of_birth}</td><td>${pet.animal_id}</td><td>${pet.user_id}</td>`
            if (element) element.appendChild (newUser);
        }
        for (const pet of oldPets) {
            dodajPet(pet);
        }
        for (const pet of newPetsList) {
            dodajPet(pet);
        }
    })

    document.getElementById("vnos").addEventListener('click', async () => {

        await db.newPets.put({
            _id: "Not Uploaded",
            name: document.getElementById("vnosName").value,
            date_of_birth: document.getElementById("vnosDate").value,
            animal_id: document.getElementById("vnosAnimal").value,
            user_id: document.getElementById("vnosUser").value
        });

        document.getElementById("vnosName").value = ""
        document.getElementById("vnosDate").value = ""
        document.getElementById("vnosUser").value = ""
        document.getElementById("vnosAnimal").value = ""

        const newPetsList = await db.newPets.toArray();
        console.log(newPetsList);

    })

    document.getElementById("urejanje").addEventListener('click', async () => {
        const response = axios.put('http://localhost:3004/api/updatePet', {
            id: document.getElementById("urejanjeID").value,
            attribute: document.getElementById("urejanjeTip").value,
            value: document.getElementById("urejanjeVrednost").value
        });

        document.getElementById("urejanjeID").value = ""
        document.getElementById("urejanjeTip").value = ""
        document.getElementById("urejanjeVrednost").value = ""
        
        console.log (response.data)

        const NOTIFICATION_TITLE = 'Posodobljeno'
        const NOTIFICATION_BODY = 'Zahtevani podatki so se posodobili.'

        new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })

    })
    
    document.getElementById("izbris").addEventListener('click', async () => {
        const response = axios.delete('http://localhost:3004/api/deletePet', {
            id: document.getElementById("izbrisID").value
        });

        document.getElementById("izbrisID").value = ""
        
        console.log (response.data)

    })

    document.getElementById("iskanje").addEventListener('click', async () => {

        //let res = await axios.get('http://localhost:3001/api/getPet?id=6401a9bea8c01bbb1e85a4d3');
        //let data = res.data;
        //console.log(data);

        const response = await axios.get('http://localhost:3004/api/getPet', {
            params: {
                id: document.getElementById("iskanjeID").value
            }
        });

        document.getElementById("iskanjeID").value = ""

        odgovor = JSON.stringify(response.data);
        document.getElementById("iskanjeOut").innerHTML = odgovor
        
        console.log (response.data)

    })

    //posodobitev ob povezavi
    window.addEventListener('online', async () => {
        document.getElementById("upload").click();
    })

    //posodobitev ob kliku
    document.getElementById("upload").addEventListener('click', async () => {

        const newPetsList = await db.newPets.toArray();
        
        //uploadanje petov na strežnik
        for (const pet of newPetsList) {

            const response = await axios.post('http://localhost:3004/api/createPet', {
                name: pet.name,
                date: pet.date_of_birth,
                user_id: pet.user_id,
                animal_id: pet.animal_id
            });

            console.log (response.data)
        }

        await db.newPets.clear();

        //fetchanje novih petov iz strežnika
        const response = await axios.get('http://localhost:3004/api/getAllPets', {
            params: {
                id: token
            }, 
        });
        for (const pet of response.data) {
            await db.pets.put({
                _id: pet._id,
                name: pet.name,
                date_of_birth: pet.date_of_birth,
                animal_id: pet.animal_id,
                user_id: pet.user_id
            });
        }

        console.log("Uploaded and refreshed")

    })

})




    
