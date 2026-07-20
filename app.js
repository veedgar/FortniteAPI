// Store the API endpoint in a constant
const API_URL = "https://fortnite-api.com/v2/shop";

// Select the HTML elements we need to interact with
const shopContainer = document.getElementById("shop-container");
const loader = document.getElementById("loader");

// Async function to fetch and display the data
async function loadShopItems() {
    try {
        // 1. Fetch data from the API
        const response = await fetch(API_URL);
        
        // 2. Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // 3. Convert the response into a JavaScript object
        const result = await response.json();
        
        // The Fortnite API stores the shop arrays inside data.entries
        const entries = result.data.entries;
        console.log("Datos recibidos de la API:", result);

        // Hide the loading text once data is ready
        loader.style.display = "none";

        // 4. Loop through each entry in the shop
        entries.forEach(entry => {
            // Skip entries that don't have items
            if (!entry.items || entry.items.length === 0) return;

            // Extract the basic data we need
            const item = entry.items[0]; 
            const itemName = item.name;
            const itemPrice = entry.finalPrice;
            
            // Default image fallback in case the cosmetic is encrypted or missing art
            let itemImage = "https://via.placeholder.com/250?text=No+Image"; 

            // 5. Image fetching logic (Handling Epic Games' structural updates)
            if (entry.newDisplayAsset && entry.newDisplayAsset.materialInstances && entry.newDisplayAsset.materialInstances.length > 0) {
                // Try to get the modern dynamic background or offer image
                const images = entry.newDisplayAsset.materialInstances[0].images;
                itemImage = images.OfferImage || images.Background || itemImage;
            } 
            else if (item.images) {
                // Fallback to the classic format
                itemImage = item.images.featured || item.images.icon || itemImage;
            }

            // 6. Create the HTML structure for the card
            const card = document.createElement("div");
            card.classList.add("item-card");

            card.innerHTML = `
                <img src="${itemImage}" alt="${itemName} Outfit">
                <div class="item-info">
                    <h3>${itemName}</h3>
                    <p class="price">${itemPrice} V-Bucks</p>
                </div>
            `;

            // 7. Add the completed card to the grid container
            shopContainer.appendChild(card);
        });

    } catch (error) {
        // Handle any errors (like network issues or API being down)
        console.error("Failed to fetch shop data:", error);
        loader.innerText = "Error loading the shop. Please try again later.";
        loader.style.color = "red";
    }
}

// Call the function to run as soon as the script loads
loadShopItems();