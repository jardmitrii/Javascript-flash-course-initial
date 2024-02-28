const galleryImages = [
    {src: "./assets/gallery/image1.jpg", alt: "Thumbnail Image 1"},
    {src: "./assets/gallery/image2.jpg", alt: "Thumbnail Image 2"},
    {src: "./assets/gallery/image3.jpg", alt: "Thumbnail Image 3"},
];

const products = [
    {title: "AstroFiction", author: "John Doe", price: 49.9, image: "./assets/products/img6.png"},
    {title: "Space Odissey", author: "Marie Anne", price: 35, image: "./assets/products/img1.png"},
    {title: "Doomed City", author: "Jason Cobert", price: undefined, image: "./assets/products/img2.png"},
    {title: "Black Dog", author: "John Doe", price: 85.35, image: "./assets/products/img3.png"},
    {title: "My Little Robot", author: "Pedro Paulo", price: 0, image: "./assets/products/img5.png"},
    {title: "Garden Girl", author: "Ankit Patel", price: 45, image: "./assets/products/img4.png"}
]

const weatherAPIKey = ""
const weatherAPIURL = `https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}&units=metric`

// Menu section
function menuHandler() {
    document.querySelector("#open-nav-menu").addEventListener("click", function () {
        document.querySelector("header nav .wrapper").classList.add("nav-open");
    })

    document.querySelector("#close-nav-menu").addEventListener("click", function () {
        document.querySelector("header nav .wrapper").classList.remove("nav-open");
    })
}
function createImage(src, alt) {
    let image = document.createElement("img");
    image.src = src;
    image.alt = alt;

    return image;
}

// Greetings section
function greetingHandler() {
    let currentHour = new Date().getHours();
    function greetingsText(currentHour)  {
        if (currentHour < 12) { return "Good morning!" }
        if (currentHour < 19) { return "Good afternoon!" }
        if (currentHour < 24) { return "Good evening!" }
        return "Welcome!";
    }

    document.querySelector("#greeting").innerHTML = greetingsText(currentHour);
}

// Weather section
function weatherHandler() {
    function celsiusToFahr(temperature) {
        return (temperature * 9 / 5) + 32
    }

    // navigator.geolocation.getCurrentPosition(position => {
        // const latitude = position.coords.latitude;
        // const longitude = position.coords.longitude;
        const latitude = '37.7749';
        const longitude = '-122.4194';
        let url = weatherAPIURL
            .replace("{lat}", latitude)
            .replace("{lon}", longitude)
            .replace("{API key}", weatherAPIKey)
        fetch(url)
            .then(resp => resp.json())
            .then(data => {
                const condition = data.weather[0].description;
                const location = data.name;
                let temperature = data.main.temp;
                // let temperature = undefined;

                let celsiusText = `The weather is ${condition} in ${location} and it's ${temperature.toFixed(1)}°C outside.`;
                let fahrText = `The weather is ${condition} in ${location} and it's ${celsiusToFahr(temperature).toFixed(1)}°F outside.`;
                document.querySelector("p#weather").innerHTML = celsiusText;
                document.querySelector(".weather-group").addEventListener("click", function (e) {
                    if (e.target.id === "celsius") {
                        document.querySelector("p#weather").innerHTML = celsiusText;
                    } else if (e.target.id === "fahr") {
                        document.querySelector("p#weather").innerHTML = fahrText;
                    }
                });
            }).catch(e => {
            document.querySelector("p#weather").innerHTML = "Error getting the weather temperature. Please, refresh the page to try again.";
        });
    // })
}

// Local time section
function clockHandler() {
    function refreshClock() {
        let localTime = new Date();
        document.querySelector("span[data-time=hours]").textContent = localTime.getHours().toString().padStart(2, "0");
        document.querySelector("span[data-time=minutes]").textContent = localTime.getMinutes().toString().padStart(2, "0");
        document.querySelector("span[data-time=seconds]").textContent = localTime.getSeconds().toString().padStart(2, "0");
    }

    refreshClock();
    setInterval(refreshClock, 1000)
}

// Gallery Section
function galleryHandler() {
    let mainImage = document.querySelector("#gallery > img");
    let thumbnails = document.querySelector("#gallery .thumbnails");
    mainImage.src = galleryImages[0].src
    mainImage.alt = galleryImages[0].alt

    galleryImages.forEach(function (image, index) {
        let thumb = createImage(image.src, image.alt);
        thumb.dataset.arrayIndex = index;
        thumb.dataset.selected = index === 0;

        thumb.addEventListener("click", function (e) {
            let selectedIndex = e.target.dataset.arrayIndex;
            let selectedImage = galleryImages[selectedIndex]
            mainImage.src = selectedImage.src
            mainImage.alt = selectedImage.alt
            thumbnails.querySelectorAll("img").forEach(function (img) {
                img.dataset.selected = false
            })

            e.target.dataset.selected = true
        });

        thumbnails.appendChild(thumb);
    });
}

// Products Section
function populateProducts(productsList) {
    let productsSection = document.querySelector(".products-area");
    productsSection.textContent = "";

    productsList.forEach(function (product) {
        let productElm = document.createElement("div");
        productElm.classList.add("product-item");

        let productImage = createImage(product.image, "Image for " + product.title);

        let productDetails = document.createElement("div");
        productDetails.classList.add("product-details");

        let productTitle = document.createElement("h3");
        productTitle.classList.add("product-title");
        productTitle.textContent = product.title;

        let productAuthor = document.createElement("p");
        productAuthor.classList.add("product-author");
        productAuthor.textContent = product.author;

        let priceTitle = document.createElement("p");
        priceTitle.classList.add("price-title");
        priceTitle.textContent = "Price";

        let productPrice = document.createElement("p");
        productPrice.classList.add("product-price");
        productPrice.textContent = product.price > 0 ? "$" + product.price.toFixed(2) : "Free";

        productDetails.append(productTitle, productAuthor, priceTitle, productPrice);

        productElm.append(productImage);
        productElm.append(productDetails);
        productsSection.append(productElm);
    })
}
function productsHandler() {
    populateProducts(products);

    let freeProducts = products.filter( item => !item.price || item.price === 0 );
    let paidProducts = products.filter( item => item.price && item.price > 0 );

    document.querySelector(".products-filter label[for=all] span.product-amount").textContent = products.length;
    document.querySelector(".products-filter label[for=paid] span.product-amount").textContent = paidProducts.length;
    document.querySelector(".products-filter label[for=free] span.product-amount").textContent = freeProducts.length;

    let productFilter = document.querySelector(".products-filter");
    productFilter.addEventListener("click", function (e) {
        if (e.target.id === "all") {
            populateProducts(products);
        } else if (e.target.id === "paid") {
            populateProducts(paidProducts);
        } else if (e.target.id === "free") {
            populateProducts(freeProducts);
        }
    })

}

function footerHandler() {
    const d = new Date();
    let year = d.getFullYear();
    document.querySelector("footer").textContent = `(C) ${year} - All rights reserved`
}

// Page load
menuHandler();
greetingHandler();
weatherHandler();
clockHandler();
galleryHandler();
productsHandler();
footerHandler();