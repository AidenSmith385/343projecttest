async function get_clothes(event) {
    event.preventDefault();
    let searchQuery = document.getElementById('search-clothes').value;
    let store = document.querySelector('input[name="store-select"]:checked').value;

    if (store == "kohls") {
        console.log("Kohl's");
        console.log(searchQuery);

        let params = new URLSearchParams({ limit: 24, keyword: searchQuery });
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '60ee588bfcmshb9000ad6cecb87fp1b0b5cjsn2206f3f5308c',
                'x-rapidapi-host': 'kohls.p.rapidapi.com'
            }
        };
        let resp = await fetch("https://kohls.p.rapidapi.com/products/list?" + params.toString(), options);

        let respJSON = await resp.json();
        respJSON = respJSON.payload.products;

        console.log(respJSON);

        let imagesDiv = document.getElementById("products");
        imagesDiv.textContent = "";

        // Create a container row for Bootstrap grid
        let rowDiv = document.createElement("div");
        rowDiv.setAttribute("class", "row");

        for (let product of respJSON) {
            // Create a column for each product
            let colDiv = document.createElement("div");
            colDiv.setAttribute("class", "col-md-3 mb-4");

            // Card container
            let cardDiv = document.createElement("div");
            cardDiv.setAttribute("class", "card h-100");

            // Product image
            let img = document.createElement("img");
            img.setAttribute("src", product.image.url);
            img.setAttribute("class", "card-img-top");
            img.setAttribute("alt", product.productTitle);

            // Card body
            let cardBody = document.createElement("div");
            cardBody.setAttribute("class", "card-body");

            // Product title
            let name = document.createElement("h5");
            name.setAttribute("class", "card-title");
            name.textContent = product.productTitle;

            // Product price
            let price = document.createElement("p");
            price.setAttribute("class", "card-text");
            let salePrice = product.prices[0].salePrice.minPrice;
            let regularPrice = product.prices[0].regularPrice.minPrice;
            price.innerHTML = `<strong>$${salePrice.toFixed(2)}</strong> <del>$${regularPrice.toFixed(2)}</del>`;

            // Save button
            let saveBtn = document.createElement("button");
            saveBtn.setAttribute("class", "btn btn-success");
            saveBtn.textContent = "Save";
            saveBtn.addEventListener("click", () => saveItem(product));

            // Append elements
            cardBody.appendChild(name);
            cardBody.appendChild(price);
            cardBody.appendChild(saveBtn);
            cardDiv.appendChild(img);
            cardDiv.appendChild(cardBody);
            colDiv.appendChild(cardDiv);
            rowDiv.appendChild(colDiv);
        }

        imagesDiv.appendChild(rowDiv);

    } else if (store == "jcpenney") {
        console.log("JCPenney");
        console.log(searchQuery);
        // Implement JCPenney API call here
    }
}

function saveItem(product) {
    // Get existing saved items from localStorage
    let savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];

    // Check if the item is already saved
    if (savedItems.some(item => item.webID === product.webID)) {
        alert("This item is already saved.");
        return;
    }

    // Add the new product to the array
    savedItems.push(product);

    // Save back to localStorage
    localStorage.setItem('savedItems', JSON.stringify(savedItems));

    alert("Item saved to your outfit!");
}

document.getElementById("search-btn").addEventListener("click", get_clothes);
