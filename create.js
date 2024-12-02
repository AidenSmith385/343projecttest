function loadSavedItems() {
    let savedItems = JSON.parse(localStorage.getItem('savedItems')) || []; // look for items in the local storage saved by clothes
    
    if (savedItems.length === 0) { // Check if there are no saved items
        // Display message if no saved items
        let noItemsMessage = document.createElement('p');
        noItemsMessage.textContent = 'You have no saved clothes';
        outfitItemsDiv.appendChild(noItemsMessage);
        return;
    }

    let outfitItemsDiv = document.getElementById('outfit-items'); // for editing the div with ID
    outfitItemsDiv.innerHTML = ''; // clear old stuff
    let totalPrice = 0; // track the price

    for (let product of savedItems) { // loop thru items in the saved local storage

        let itemRow = document.createElement('div'); // displayed row for the items
        itemRow.setAttribute('class', 'item-row');

        let img = document.createElement('img'); // grab the image from the api call
        img.setAttribute('src', product.image.url);
        img.setAttribute('alt', product.productTitle);

        let name = document.createElement('p'); // gets the listed name
        name.textContent = product.productTitle;

        // add a delte button in the row
        let deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('class', 'delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteItem(product.webID)); // calls delete function if clicked

        let price = document.createElement('p');
        let salePrice = product.prices[0].salePrice.minPrice; // the price retreived from the api call
        totalPrice += salePrice; // adds the total price together
        price.textContent = `$${salePrice.toFixed(2)}`; // converts to a string

        let buyBtn = document.createElement('button'); // creates the buy button in the row
        buyBtn.setAttribute('class', 'buy-btn');
        buyBtn.textContent = 'Buy';
        buyBtn.addEventListener('click', () => {
            window.open(`https://www.kohls.com${product.seoURL}`, '_blank'); // if clicked the button then the page will open a new window to the original link
        });

        // Append the retreived elements to the row
        itemRow.appendChild(img); 
        itemRow.appendChild(name);
        itemRow.appendChild(deleteBtn);
        itemRow.appendChild(price);
        itemRow.appendChild(buyBtn);

        outfitItemsDiv.appendChild(itemRow);
    }

    document.getElementById('total-price').textContent = `| Total $${totalPrice.toFixed(2)} |`; // updtes the text to reflect the total min price
}

function deleteItem(webID) {
    let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    savedItems = savedItems.filter(item => item.webID !== webID); // deletes the item using the web ID
    localStorage.setItem('savedItems', JSON.stringify(savedItems)); // updates the local storage wihtout the item
    loadSavedItems(); // returns to the loop and clears the items so it starts over
}

function deleteOutfit() {
    if (confirm("Are you sure you want to delete the entire outfit?")) { // ensures the user doesnt want the outift anymore
        localStorage.removeItem('savedItems');
        loadSavedItems(); // begins loop again to redisplay items in local storage
    }
}

function saveOutfit() {
    let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    if (savedItems.length === 0) { // cant save nothing
        alert("No items to save.");
        return;
    }

    let savedOutfits = JSON.parse(localStorage.getItem('savedOutfits')) || [];
    savedOutfits.push(savedItems); // adds the outfit to a new place in local storage
    localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));

    alert("Outfit saved!");
    localStorage.removeItem('savedItems'); // clears after saving
    loadSavedItems(); // reloads items once they have been cleared
}

document.addEventListener('DOMContentLoaded', () => {
    loadSavedItems(); // when the page is opened then the information in the local storage will be found

    document.getElementById('delete-outfit-btn').addEventListener('click', deleteOutfit); // deletes entire outfit
    document.getElementById('save-outfit-btn').addEventListener('click', saveOutfit); // saves to my outfits
});