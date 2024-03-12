import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";


const appSettings = {
    databaseURL: "https://shopping-cart-b5ead-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings); // Initialize the app
const database = getDatabase(app); // Connect app to the database
const groceriesInDB = ref(database, "groceries"); // Create database; ref(reference, title)

const addToCart = document.querySelector('#add-button');
const item = document.querySelector('#input-field');
const shoppingList = document.querySelector('#shopping-list');


addToCart.addEventListener('click', () => {
    let itemValue = item.value;

    push(groceriesInDB, itemValue); // push(reference, value) -> args

    clearInputField();
});


onValue(groceriesInDB, function (snapshot) {
    if (snapshot.exists()) {
        let groceriesArray = Object.entries(snapshot.val());

        clearShoppingList();
        
        for (let i = 0; i < groceriesArray.length; i++) {
            let currentItem = groceriesArray[i];

            addItemToShoppingList(currentItem);
        }
    } else {
        shoppingList.textContent = 'No items here... yet';
    }
});


function clearInputField() {
    item.value = '';
};

function clearShoppingList() {
    shoppingList.innerHTML = '';
}

function addItemToShoppingList(item) {
    let itemID = item[0]
    let itemValue = item[1]

    const newListItem = document.createElement('li') // Create a new list item
    newListItem.textContent = itemValue // Set new list item text content to item value (user input)

    // Deletes an element on click
    newListItem.addEventListener('click', () => {
        let exactLocationOfItemInDB = ref(database, `groceries/${itemID}`) // Locates item in database
        remove(exactLocationOfItemInDB) // Removes item from database
    })

    shoppingList.appendChild(newListItem) // Add new list element to Shopping List (ul)
};