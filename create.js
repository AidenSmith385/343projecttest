function loadSavedItems() {
    let savedItems = JSON.parse(localStorage.getItem('savedItems')) || []; // look for items in the local storage saved by clothes

    let outfitItemsDiv = document.getElementById('outfit-items'); // for editing the div with ID
    outfitItemsDiv.innerHTML = ''; // clear old stuff

    if (savedItems.length === 0) {
        outfitItemsDiv.innerHTML = '<p class="no-items-message">You have no clothes saved.</p>';
        return;
    } else {
        // Show the total price and action buttons
        document.getElementById('total-price').style.display = 'inline';
        document.getElementById('delete-outfit-btn').style.display = 'inline-block';
        document.getElementById('save-outfit-btn').style.display = 'inline-block';
    }

    let totalPrice = 0; // track the price

    for (let product of savedItems) { // loop thru items in the saved local storage

        let itemRow = document.createElement('div'); // displayed row for the items
        itemRow.setAttribute('class', 'item-row');

        let img = document.createElement('img'); // grab the image from the api call
        img.setAttribute('src', product.image.url);
        img.setAttribute('alt', product.name);

        let name = document.createElement('p'); // gets the listed name
        name.textContent = product.name;

        // add a delete button in the row
        let deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('class', 'delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteItem(product.productURL)); // calls delete function if clicked

        let price = document.createElement('p');
        let salePrice = product.priceRange.minPrice; // the price retrieved from the api call
        totalPrice += salePrice; // adds the total price together
        price.textContent = `$${salePrice.toFixed(2)}`; // converts to a string

        let buyBtn = document.createElement('button'); // creates the buy button in the row
        buyBtn.setAttribute('class', 'buy-btn');
        buyBtn.textContent = 'Buy';
        buyBtn.addEventListener('click', () => {
            window.open(product.productURL, '_blank'); // if clicked the button then the page will open a new window to the original link
        });

        // Append the retrieved elements to the row
        itemRow.appendChild(img);
        itemRow.appendChild(name);
        itemRow.appendChild(deleteBtn);
        itemRow.appendChild(price);
        itemRow.appendChild(buyBtn);

        outfitItemsDiv.appendChild(itemRow);
    }

    document.getElementById('total-price').textContent = `| Total $${totalPrice.toFixed(2)} |`; // updates the text to reflect the total min price
}

function deleteItem(productURL) {
    let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    savedItems = savedItems.filter(item => item.productURL !== productURL); // deletes the item using the productURL
    localStorage.setItem('savedItems', JSON.stringify(savedItems)); // updates the local storage without the item
    loadSavedItems(); // returns to the loop and clears the items so it starts over
}

function deleteOutfit() {
    let additionalMessageText;

    if (localStorage.getItem("outfitIndex") != null) {
        additionalMessageText = " This will not delete the outfit from the My Outfits page" +
            "and will no longer update any outfits there";
    }
    if (confirm("Are you sure you want to delete the entire outfit?" +
        additionalMessageText)) { 
            // ensures the user doesn't want the outfit anymore
        localStorage.removeItem('savedItems');

        let savedOutfits = localStorage.getItem("savedOutfits") || [];
        let outfitIndex = localStorage.getItem("outfitIndex");
        if (outfitIndex != null) {
            localStorage.setItem("savedOutfits", JSON.stringify(savedOutfits));
            localStorage.removeItem("outfitIndex");
        }

        loadSavedItems(); // begins loop again to redisplay items in local storage
    }
}

function saveOutfit() {
    let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    if (savedItems.length === 0) { // can't save nothing
        alert("No items to save.");
        return;
    }

    let outfitIndex = localStorage.getItem("outfitIndex")
    if (outfitIndex == null) {
        let savedOutfits = JSON.parse(localStorage.getItem('savedOutfits')) || [];
        savedOutfits.push(savedItems); // adds the outfit to a new place in local storage
        localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));
    } else {
        let savedOutfits = JSON.parse(localStorage.getItem('savedOutfits')) || [];
        savedOutfits[outfitIndex] = savedItems;
        localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));
    }

    alert("Outfit saved!");
    localStorage.removeItem('savedItems'); // clears after saving
    localStorage.removeItem('outfitIndex');
    loadSavedItems(); // reloads items once they have been cleared
}

document.addEventListener('DOMContentLoaded', () => {
    loadSavedItems(); // when the page is opened then the information in the local storage will be found

    document.getElementById('delete-outfit-btn').addEventListener('click', deleteOutfit); // deletes entire outfit
    document.getElementById('save-outfit-btn').addEventListener('click', saveOutfit); // saves to my outfits
});

function exportClick(ev) {
    // TODO 1. get the current state from localStorage
    let state = JSON.parse(localStorage.getItem("savedItems"))
    console.log(state)

    // TODO 2. get the stringified version of the state from the previous step
    let stringState = JSON.stringify({savedItems: state})

    // TODO 3. encode the state as a URI component
    let encodedStringState = encodeURIComponent(stringState)

    // TODO 4. prepend the encoded string with the data URL dark magic:
    // 'data:application/json;charset=utf-8,'
    // ok, it's not really dark magic, read more here:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs
    encodedStringState = "data:application/json;charset=utf-8," + encodedStringState

    // TODO 5. create a link which has as its href the result from the preceding step and its download attribute set to
    // "transportodons.json"
    let link = document.createElement("a")
    link.setAttribute("href", encodedStringState)
    link.setAttribute("download", "outfit.json")

    // TODO 7. write the javascript to click the newly added link
    link.click();

    link.remove();
}

document.getElementById("export-outfit-btn").addEventListener("click", exportClick);