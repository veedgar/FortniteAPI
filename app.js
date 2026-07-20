JavaScript
const API_URL = "https://fortnite-api.com/v2/shop";
const shopContainer = document.getElementById("shop-container");
const loader = document.getElementById("loader");

async function loadShopItems() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        
        let entries = [];
        if (result.data.entries) {
            entries = result.data.entries; 
        } else {
            const featured = result.data.featured ? result.data.featured.entries : [];
            const daily = result.data.daily ? result.data.daily.entries : [];
            entries = [...featured, ...daily];
        }

        if (entries.length === 0) {
            throw new Error("No cosmetics found in the expected structure.");
        }

        loader.style.display = "none";
        
        shopContainer.classList.remove("shop-grid");
        shopContainer.innerHTML = ""; 

        const sectionsMap = {};
        
        entries.forEach(entry => {
            const sectionName = entry.layout?.name || entry.section?.name || "Other Offers";
            
            if (!sectionsMap[sectionName]) {
                sectionsMap[sectionName] = [];
            }
            sectionsMap[sectionName].push(entry);
        });

        const sortedSections = Object.keys(sectionsMap).sort((a, b) => {
            if (a.toUpperCase() === "JAM TRACKS") return 1;
            if (b.toUpperCase() === "JAM TRACKS") return -1;
            return 0;
        });

        for (const sectionName of sortedSections) {
            const sectionEntries = sectionsMap[sectionName];
            
            const title = document.createElement("h2");
            title.innerText = sectionName.toUpperCase();
            title.style.marginTop = "3rem";
            title.style.marginBottom = "1rem";
            title.style.color = "#00e5ff"; 
            title.style.borderBottom = "2px solid #1f1f1f";
            title.style.paddingBottom = "0.5rem";
            title.style.letterSpacing = "1px";
            
            shopContainer.appendChild(title);

            const sectionGrid = document.createElement("div");
            sectionGrid.classList.add("shop-grid"); 

            sectionEntries.forEach(entry => {
                const itemsArray = entry.brItems || entry.items || entry.cars || entry.instruments || entry.tracks;
                if (!itemsArray || itemsArray.length === 0) return;

                const item = itemsArray[0]; 
                
                const itemName = item.name || item.title || entry.bundle?.name || "Unknown";
                const itemPrice = entry.finalPrice;
                
                let itemImage = "https://via.placeholder.com/250?text=No+Image"; 

                if (entry.newDisplayAsset && entry.newDisplayAsset.materialInstances && entry.newDisplayAsset.materialInstances.length > 0) {
                    const images = entry.newDisplayAsset.materialInstances[0].images;
                    itemImage = images.OfferImage || images.Background || itemImage;
                } else if (item.images) {
                    itemImage = item.images.featured || item.images.icon || item.images.small || itemImage;
                } else if (item.albumArt) {
                    itemImage = item.albumArt;
                }

                const card = document.createElement("div");
                card.classList.add("item-card");

                card.innerHTML = `
                    <img src="${itemImage}" alt="${itemName}">
                    <div class="item-info">
                        <h3>${itemName}</h3>
                        <p class="price">${itemPrice} V-Bucks</p>
                    </div>
                `;

                sectionGrid.appendChild(card);
            });

            shopContainer.appendChild(sectionGrid);
        }

    } catch (error) {
        console.error("Failed to fetch shop data:", error);
        loader.style.display = "block"; 
        loader.innerText = `Error loading the shop: ${error.message}`;
        loader.style.color = "red";
    }
}

loadShopItems();