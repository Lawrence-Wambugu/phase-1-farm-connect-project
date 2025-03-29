document.addEventListener("DOMContentLoaded", () => {
    const farmList = document.getElementById("farm-list");
    const farmForm = document.getElementById("farm-form");
    const searchInput = document.createElement("input");
    const toggleThemeButton = document.createElement("button");

    // Create Search Input
    searchInput.type = "text";
    searchInput.placeholder = "Search farms...";
    searchInput.id = "search-bar";
    document.body.insertBefore(searchInput, farmList);

    // Create Dark Light Mode Button
    toggleThemeButton.textContent = "🌙 Toggle Dark Mode";
    toggleThemeButton.id = "toggle-theme";
    document.body.insertBefore(toggleThemeButton, farmList);

    // Fetch and Display Farms
    function fetchFarms() {
        fetch("http://localhost:3000/farms")
            .then(res => res.json())
            .then(farms => {
                farmList.innerHTML = "";
                farms.forEach(farm => displayFarm(farm)); // Iterating farms using forEach
            });
    }
     // Dark Mode Toggle Functionality
     toggleThemeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        // Change button text based on mode
        if (document.body.classList.contains("dark-mode")) {
            toggleThemeButton.textContent = "☀️ Toggle Light Mode";
        } else {
            toggleThemeButton.textContent = "🌙 Toggle Dark Mode";
        }
    });

    // Display Farm Card
    function displayFarm(farm) {
        const farmCard = document.createElement("div");
        farmCard.classList.add("farm-card");
        farmCard.setAttribute("data-name", farm.name.toLowerCase());
    
        farmCard.innerHTML = `
            <img src="${farm.image || '/images/default-farm.jpg'}" alt="${farm.name}">
            <h3>${farm.name}</h3>
            <p><strong>Location:</strong> ${farm.location}</p>
            <p><strong>Produce:</strong> ${farm.produce}</p>
             <p><strong>Phone:</strong> ${farm.phone}</p>
            <button class="interest-btn" data-id="${farm.id}">Interested</button>
        `;
    
        farmList.appendChild(farmCard);
    }
    
    // Handle Form Submission to Add a New Farm
farmForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevents page refresh

    // Get form values
    const name = document.getElementById("farm-name").value.trim();
    const location = document.getElementById("farm-location").value.trim();
    const produce = document.getElementById("farm-produce").value.trim();
    const phone = document.getElementById("farm-phone").value.trim();
    const image = document.getElementById("farm-image").value.trim() || "/images/default-farm.jpg"; // Default image if none provided

    if (!name || !location || !produce || !phone) {
        alert("Please fill in all required fields!");
        return;
    }

    const newFarm = { name, location, produce, phone, image, interested: 0 };

    // Send farm to backend
    fetch("http://localhost:3000/farms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFarm)
    })
    .then(res => res.json())
    .then(farm => {
        displayFarm(farm); // Add new farm to UI immediately
        farmForm.reset(); // Clear form fields
    })
    .catch(error => console.error("Error adding farm:", error));
});

// Search functionality
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const farmCards = document.querySelectorAll(".farm-card");

    farmCards.forEach(card => {
        const farmName = card.getAttribute("data-name");
        if (farmName.includes(searchTerm)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});

    // Interest Click Event - Show Interest Form
    function showInterestForm(event) {
        if (event.target.classList.contains("interest-btn")) {
            const farmId = event.target.getAttribute("data-id");
            
            // Create Form Overlay
            const overlay = document.createElement("div");
            overlay.classList.add("overlay");
            overlay.innerHTML = `
                <div class="interest-form">
                    <h3>Express Your Interest</h3>
                    <label>Name:</label>
                    <input type="text" id="user-name" required>
                    <label>Phone Number:</label>
                    <input type="tel" id="user-phone" required>
                    <label>Products of Interest:</label>
                    <input type="text" id="user-product" required>
                    <label>Delivery Location:</label>
                    <input type="text" id="user-location" required>
                    <button id="submit-interest" data-id="${farmId}">Submit</button>
                    <button id="close-form">Cancel</button>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    }

    // Submit Interest Form
    function submitInterest(event) {
        if (event.target.id === "submit-interest") {
            const farmId = event.target.getAttribute("data-id");
            const userName = document.getElementById("user-name").value.trim();
            const userPhone = document.getElementById("user-phone").value.trim();
            const userProduct = document.getElementById("user-product").value.trim();
            const userLocation = document.getElementById("user-location").value.trim();

            if (!userName || !userPhone || !userProduct || !userLocation) {
                alert("Please fill in all fields!");
                return;
            }

            const newInterest = { farmId, userName, userPhone, userProduct, userLocation };

            fetch("http://localhost:3000/interestedUsers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newInterest)
            }).then(() => {
                document.querySelector(".overlay").remove();
                alert("Interest recorded successfully!");
            });
        }
    }

    // Close Interest form
    function closeForm(event) {
        if (event.target.id === "close-form") {
            document.querySelector(".overlay").remove();
        }
    }

    // Event Listeners
    farmList.addEventListener("click", showInterestForm);
    document.body.addEventListener("click", submitInterest);
    document.body.addEventListener("click", closeForm);

    fetchFarms();
});
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 4000;

server.use(middlewares);
server.use(router);

// Explicitly bind to 0.0.0.0
server.listen(PORT, "0.0.0.0", () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
