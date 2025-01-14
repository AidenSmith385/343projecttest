function addClass(node, CSSClass) {
    if (node.getAttribute("class") === null) {
        node.setAttribute("class", "");
    }
    node.setAttribute("class", node.getAttribute("class") + " " + CSSClass);
}

async function get_clothes(event) {
    let testing = false;

    event.preventDefault();
    let searchQuery = document.getElementById('search-clothes').value;
    
    let store = document.querySelector('input[name="store-select"]:checked').value;
    let respJSON;
    let respData;

    if (store == "kohls") {
        console.log("Kohl's")
        console.log(searchQuery)

        if (!testing) {
            console.log("Sending request")
            let params = new URLSearchParams( {limit: 24, keyword: searchQuery} );
            const options = {
                method: 'GET',
                headers: {
                    // 'x-rapidapi-key': '60ee588bfcmshb9000ad6cecb87fp1b0b5cjsn2206f3f5308c',
                    // 'x-rapidapi-host': 'kohls.p.rapidapi.com'
                    'x-rapidapi-key': 'f2e792afdemshe38931f846eea96p13a3b6jsn9b9f886e23ed',
		            'x-rapidapi-host': 'kohls.p.rapidapi.com'
                }
            };
            let resp = await fetch("https://kohls.p.rapidapi.com/products/list?" + params.toString(), options);
            console.log(resp);

            respJSON = await resp.json();
            respJSON = respJSON.payload.products;
        } else {
            let resp = await fetch('./kohls_response.json');
            console.log(resp);
            respJSON = (await resp.json()).products;
            console.log(respJSON);
        }
        console.log(respJSON);

        let products = []
        for (let product of respJSON) {
            // Get data from response JSON
            let name = product.productTitle;
            let image = {
                url: product.image.url,
                height: product.image.height,
                width: product.image.width,
            }
            
            let  priceRange;
            if (Object.hasOwn(product.prices, "salePrice")) {
                priceRange = {
                    minPrice: product.prices[0].salePrice.minPrice,
                    maxPrice: product.prices[0].salePrice.maxPrice,
                };
            } else {
                priceRange = {
                    minPrice: product.prices[0].regularPrice.minPrice,
                    maxPrice: product.prices[0].regularPrice.maxPrice,
                }
            }
            let productURL = "https://www.kohls.com" + product.seoURL;

            products.push({
                name: name,
                image: image,
                priceRange: priceRange,
                productURL: productURL,
            });
        }

        displayResponse(products);

    } else if (store == "forever21") {
        let respJSON;

        if (!testing) {
            let params = new URLSearchParams({query: searchQuery, rows: 24, start: 0});
            const options = {
                method: 'GET',
                headers: {
                    // 'x-rapidapi-key': '60ee588bfcmshb9000ad6cecb87fp1b0b5cjsn2206f3f5308c',
                    // 'x-rapidapi-host': 'apidojo-forever21-v1.p.rapidapi.com'
                    'x-rapidapi-key': 'f2e792afdemshe38931f846eea96p13a3b6jsn9b9f886e23ed',
		            'x-rapidapi-host': 'apidojo-forever21-v1.p.rapidapi.com'
                }
            };
            let resp = await fetch("https://apidojo-forever21-v1.p.rapidapi.com/products/search?" + params.toString(), options);
            console.log(resp);

            respJSON = await resp.json();
            console.log(respJSON);
        } else {
            respJSON = await fetch('./forever21_response.json');
            respJSON = await respJSON.json();
            console.log(respJSON);
        }

        respJSON = respJSON.response.docs;
        console.log(respJSON);

        let products = []
        for (let product of respJSON) {
            let name = product.title;
            let image = {
                url: product.thumb_image,
                height: 180,
                width: 180,
            }
            let priceRange = {
                minPrice: product.sale_price,
                maxPrice: null
            }
            let productURL = product.url

            products.push({
                name,
                image,
                priceRange,
                productURL,
            })
        }

        displayResponse(products);

    } else {
        console.log(store);
    }
}

function displayResponse(products) {
    let productsDiv = document.getElementById("products");
    productsDiv.textContent = "";

    let rowDiv;
    let colCount = 0;
    
    for (let product of products) {
        if (colCount == 0) {
            rowDiv = document.createElement("div");
            addClass(rowDiv, "row");
            productsDiv.appendChild(rowDiv);
        }

        let productDiv = document.createElement("div");
        addClass(productDiv, "col-md-3");

        // Create a container for the product item
        let productItemDiv = document.createElement("div");
        addClass(productItemDiv, "product-item");

        let productLink = document.createElement("a");
        productLink.setAttribute("href", product.productURL);
        productLink.setAttribute("target", "_blank");
        productLink.setAttribute("rel", "noopener noreferrer");

        let img = document.createElement("img");
        img.setAttribute("src", product.image.url);
        img.setAttribute("alt", product.name);
        productLink.appendChild(img);
        
        let nameP = document.createElement("p");
        nameP.textContent = product.name + " - $" + parseFloat(product.priceRange.minPrice).toFixed(2);
        productLink.appendChild(nameP);

        // Append the product link to the product item container
        productItemDiv.appendChild(productLink);

        let addButton = document.createElement("button");
        addButton.textContent = "Add to Outfit";
        addButton.addEventListener("click", () => {
            let currentOutfit = localStorage.getItem("savedItems");
            if (currentOutfit == null) {
                currentOutfit = [];
            } else {
                currentOutfit = JSON.parse(currentOutfit);
            }

            currentOutfit.push(product);
            localStorage.setItem("savedItems", JSON.stringify(currentOutfit));
            alert("Item added to outfit!");
        });
        addClass(addButton, "add-btn");
        addButton.setAttribute("aria-labelledby", "Add to Outfit");

        // Append the button to the product item container
        productItemDiv.appendChild(addButton);

        // Append the product item container to the column div
        productDiv.appendChild(productItemDiv);

        rowDiv.appendChild(productDiv);

        colCount = (colCount + 1) % 4;
    }
}


document.getElementById("search-btn").addEventListener("click", get_clothes);