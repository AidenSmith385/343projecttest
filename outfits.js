function loadSavedOutfits() {

    let savedOutfits = JSON.parse(localStorage.getItem('savedOutfits')) || []; // finds the items in local storage
    let savedOutfitsDiv = document.getElementById('saved-outfits');
    savedOutfitsDiv.innerHTML = ''; // Clear existing content

    // Hide the "Delete All Outfits" button if there are no outfits
    if (savedOutfits.length === 0) {
        // Create a container div with the same class as in create.js
        let noOutfitsContainer = document.createElement('div');
        noOutfitsContainer.setAttribute('class', 'table');

        // Create the message paragraph
        let messageP = document.createElement('p');
        messageP.setAttribute('class', 'no-items-message');
        messageP.textContent = 'You have no outfits saved.';

        // Append the message to the container
        noOutfitsContainer.appendChild(messageP);

        // Append the container to the savedOutfitsDiv
        savedOutfitsDiv.appendChild(noOutfitsContainer);
    } else {
        // Show the "Delete All Outfits" button if outfits exist
        let deleteAllBtn = document.getElementById('delete-all-outfits-btn');
        if (deleteAllBtn) {
            deleteAllBtn.style.display = 'inline-block';
        }
    }

    savedOutfits.forEach((outfit, index) => {
        let outfitDiv = document.createElement('div');
        outfitDiv.setAttribute('class', 'outfit mb-4'); // creates an attribute to reference when altering the div

        let outfitTitle = document.createElement('h4');
        outfitTitle.textContent = `Outfit ${index + 1}`; // first saved outfit

        let itemsDiv = document.createElement('div');
        itemsDiv.setAttribute('class', 'row'); // makes a new row for the saved outfit

        let totalPrice = 0; // will be updated for the new total

        outfit.forEach(product => { // iterate through the products in the outfit to display and retrieve data
            let colDiv = document.createElement('div');
            colDiv.setAttribute('class', 'col-md-3');

            let cardDiv = document.createElement('div');
            cardDiv.setAttribute('class', 'card h-100');

            let img = document.createElement('img');
            img.setAttribute('src', product.image.url);
            img.setAttribute('class', 'card-img-top');
            img.setAttribute('alt', product.name);

            let cardBody = document.createElement('div');
            cardBody.setAttribute('class', 'card-body');

            let name = document.createElement('h5'); // the name of the item is to be the title
            name.setAttribute('class', 'card-title');
            name.textContent = product.name;

            let price = document.createElement('p'); // retrieves and updates the price as a string
            price.setAttribute('class', 'card-text');
            let salePrice = product.priceRange.minPrice;
            totalPrice += salePrice;
            price.textContent = `$${salePrice.toFixed(2)}`;

            // link the buy button to the website of the original item
            let buyBtn = document.createElement('button');
            buyBtn.setAttribute('class', 'btn btn-primary mt-2');
            buyBtn.textContent = 'Buy';
            buyBtn.addEventListener('click', () => {
                window.open(product.productURL, '_blank');
            });

            // Append elements to the card that the user needs
            cardBody.appendChild(name);
            cardBody.appendChild(price);
            cardBody.appendChild(buyBtn); // Add the Buy button to the card body
            cardDiv.appendChild(img);
            cardDiv.appendChild(cardBody);
            colDiv.appendChild(cardDiv);
            itemsDiv.appendChild(colDiv);
        });

        let totalPriceDiv = document.createElement('p');
        totalPriceDiv.textContent = `Total Price: $${totalPrice.toFixed(2)}`;

        // Delete outfit button functionality
        let deleteOutfitBtn = document.createElement('button');
        deleteOutfitBtn.setAttribute('class', 'delete-btn mt-3');
        deleteOutfitBtn.textContent = 'Delete Outfit';
        deleteOutfitBtn.addEventListener('click', () => deleteOutfit(index));

        let editOutfitBtn = document.createElement('button')
        editOutfitBtn.setAttribute('class', 'save-btn mt-3');
        editOutfitBtn.textContent = 'Edit Outfit';
        editOutfitBtn.addEventListener('click', () => editOutfit(index))

        outfitDiv.appendChild(outfitTitle);
        outfitDiv.appendChild(itemsDiv);
        outfitDiv.appendChild(totalPriceDiv);
        outfitDiv.appendChild(deleteOutfitBtn);
        outfitDiv.appendChild(editOutfitBtn);
        savedOutfitsDiv.appendChild(outfitDiv);
    });
}

function deleteOutfit(index) { // Deletes a specific outfit
    let outfitIndex = localStorage.getItem("outfitIndex");
    let additionalMessageText = "";
    if (outfitIndex != null && outfitIndex == index) {
        additionalMessageText = " The outfit will be deleted from the Create Outfits page.";
    }
    if (confirm("Are you sure you want to delete this outfit?" + additionalMessageText)) {
        let savedOutfits = JSON.parse(localStorage.getItem('savedOutfits')) || [];
        savedOutfits.splice(index, 1);
        localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));

        let outfitIndex = localStorage.getItem("outfitIndex")
        if (outfitIndex != null) {
            if (+outfitIndex > index) {
                outfitIndex = +outfitIndex - 1;
                localStorage.setItem("outfitIndex", outfitIndex);
            } else if (+outfitIndex == index) {
                localStorage.removeItem("outfitIndex");
                localStorage.removeItem("savedItems");
            }
        }

        loadSavedOutfits();
    }
}

function editOutfit(index) {
    let savedOutfits = JSON.parse(localStorage.getItem('savedOutfits')) || [];
    if (index <= savedOutfits.length) {
        if (localStorage.getItem('savedItems') != null) {
            alert("Save or delete your current outfit before editing this one.")
        } else {
            localStorage.setItem("outfitIndex", index);
            localStorage.setItem("savedItems", JSON.stringify(savedOutfits[index]));
            window.location.href = "create.html"
        }
    }
}

function deleteAllOutfits() { // Deletes all outfits
    if (confirm("Are you sure you want to delete all outfits?")) {
        localStorage.removeItem('savedOutfits');
        loadSavedOutfits();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadSavedOutfits();
    // Attach event listener to the Delete All Outfits button
    document.getElementById('delete-all-outfits-btn').addEventListener('click', deleteAllOutfits);
});

// callback for when the json file is loaded during import
function loadedJSON(ev) {
    ev.preventDefault()
    console.log("loading file");
    // TODO 7. get the event's target's result
    let result = ev.target

    // TODO 8. decode the result (recall that it was encoded for use as a URL during export above)
    result = result.result
    result = JSON.parse(result)
    result = result.savedItems

    let savedOutfits = localStorage.getItem("savedOutfits");
    if (savedOutfits === null || savedOutfits === "") {
        savedOutfits = []
    } else {
        savedOutfits = JSON.parse(savedOutfits);
    }

    savedOutfits.push(result);
    localStorage.setItem("savedOutfits", JSON.stringify(savedOutfits));

    window.location.reload();
}

function onImport(ev) {
    ev.preventDefault()
    console.log('import form was submitted')
    // TODO add a feature to import the todo items (or "transportodons") that were previously exported by this app by
    // completing the steps below: 

    // get a reference to the file field
    let inputField = document.createElement("input");
    inputField.setAttribute("type", "file");
    inputField.setAttribute("style", "display: none;");

    // 0: Click on the file output so the user selects a file
    inputField.click();

    inputField.addEventListener("change", function (ev) {
        console.log("onCHange")
        // TODO 1. get the list of file objects selected by the user
        let files = ev.target.files;

        if (files.length > 0) {
            let file = files[0]

            // TODO 4. construct a new FileReader object
            let fileReader = new FileReader();

            // TODO 5. add an event listener for the new FileReader's load event that will call the loadedJSON function below
            fileReader.addEventListener("load", loadedJSON)

            // TODO 6. tell the filereader to read the file as text https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsText
            fileReader.readAsText(file)
        }
    })

}

document.getElementById("import-btn").addEventListener("click", onImport);