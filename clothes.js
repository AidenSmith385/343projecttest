async function get_clothes(event) {
    event.preventDefault();
    let searchQuery = document.getElementById('search-clothes').value;
    
    let store = document.querySelector('input[name="store-select"]:checked').value;

    if (store == "kohls") {
        console.log("Kohl's")
        console.log(searchQuery)

        let params = new URLSearchParams( {limit: 24, keyword: searchQuery} );
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
        let respData = JSON.stringify(respJSON, null, 2);

        console.log(respJSON);

        let imagesDiv = document.getElementById("products");
        imagesDiv.textContent = "";
        for (let product of respJSON) {
            let div = document.createElement("div");
            div.setAttribute("class", "col-md-1");

            let img = document.createElement("img");
            img.setAttribute("src", product.image.url)
            img.setAttribute("width", product.image.width);
            img.setAttribute("height", product.image.height);
            // div.appendChild(img);

            let name = document.createElement("p");
            name.textContent = product.productTitle;
            div.appendChild(name);

            let priceRange = document.createElement("p");
            // if (product.)
            
            imagesDiv.appendChild(img);
        }

        let output = document.getElementById("response");
        output.textContent = respData;
    } else if (store == "jcpenney") {
        console.log("JCPenney")
        console.log(searchQuery)
    }
}

document.getElementById("search-btn").addEventListener("click", get_clothes);