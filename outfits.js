function loadSavedOutfits() {

    let savedOutfits = JSON.parse(localStorage.getItem('savedOutfits')) || []; // finds the items in local storage
    let savedOutfitsDiv = document.getElementById('saved-outfits');
    savedOutfitsDiv.innerHTML = ''; // Clear existing content


    savedOutfits.forEach((outfit, index) => {
        let outfitDiv = document.createElement('div');
        outfitDiv.setAttribute('class', 'outfit mb-4'); // creates an attribuite to reference when altering the div

        let outfitTitle = document.createElement('h4');
        outfitTitle.textContent = `Outfit ${index + 1}`; // first saved outfit

        let itemsDiv = document.createElement('div');
        itemsDiv.setAttribute('class', 'row'); // makes a new row for the saved outfit

        let totalPrice = 0; // will be updated for the new total

        outfit.forEach(product => { // iterate thru the products in the outfit to display and retrieve data
            let colDiv = document.createElement('div');
            colDiv.setAttribute('class', 'col-md-3');

            let cardDiv = document.createElement('div');
            cardDiv.setAttribute('class', 'card h-100');

            let img = document.createElement('img');
            img.setAttribute('src', product.image.url);
            img.setAttribute('class', 'card-img-top');
            img.setAttribute('alt', product.productTitle);

            let cardBody = document.createElement('div'); 
            cardBody.setAttribute('class', 'card-body');

            let name = document.createElement('h5'); // the name oif the item is to be the title
            name.setAttribute('class', 'card-title');
            name.textContent = product.productTitle;

            let price = document.createElement('p'); // retreives and updates the price as a string
            price.setAttribute('class', 'card-text');
            let salePrice = product.prices[0].salePrice.minPrice;
            totalPrice += salePrice;
            price.textContent = `$${salePrice.toFixed(2)}`;

            // link the buy button to the website of the original item
            let buyBtn = document.createElement('button');
            buyBtn.setAttribute('class', 'btn btn-primary mt-2');
            buyBtn.textContent = 'Buy';
            buyBtn.addEventListener('click', () => {
                window.open(`https://www.kohls.com${product.seoURL}`, '_blank');
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

        outfitDiv.appendChild(outfitTitle);
        outfitDiv.appendChild(itemsDiv);
        outfitDiv.appendChild(totalPriceDiv);
        outfitDiv.appendChild(deleteOutfitBtn);
        savedOutfitsDiv.appendChild(outfitDiv);
    });
}

function deleteOutfit(index) { // pretty muvh the same as create page except the index of each outfit needs the be decremented
    if (confirm("Are you sure you want to delete this outfit?")) {
        let savedOutfits = JSON.parse(localStorage.getItem('savedOutfits')) || [];
        savedOutfits.splice(index, 1);
        localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));
        loadSavedOutfits();
    }
}

document.addEventListener('DOMContentLoaded', loadSavedOutfits);
