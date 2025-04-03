const API_URL = "https://script.google.com/macros/s/AKfycbzRbRtvLAiG0KZ6k-FwKA_Yz0hqm_MU0QGUfsAqXwR_ygH6y5kKMaGIJk032sGQuhUe/exec"; // Replace with your actual deployment URL

// Function to register a new user
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();

    if (!username) {
        alert("Please enter a username.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}?action=register&username=${encodeURIComponent(username)}`);
        const result = await response.text();
        alert(result);

        if (result === "User registered successfully") {
            window.location.href = `user.html?username=${username}`;
        }
    } catch (error) {
        alert("Error registering user. Please try again.");
        console.error(error);
    }
});

// Function to log a prayer
async function logPrayer(prayer) {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    if (!username) {
        alert("User not found. Please sign up.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}?action=updatePrayer&username=${encodeURIComponent(username)}&prayer=${encodeURIComponent(prayer)}`);
        const result = await response.text();
        alert(result);
    } catch (error) {
        alert("Error logging prayer. Please try again.");
        console.error(error);
    }
}

// Function to load user profile
async function loadUserProfile() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    
    if (!username) {
        console.error("Username not found in URL");
        return;
    }

    console.log(`Loading data for: ${username}`);

    try {
        const response = await fetch(API_URL);
        const text = await response.text();
        console.log("Raw response:", text);  // Debugging

        try {
            const data = JSON.parse(text);
            console.log("Parsed JSON:", data);
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }


        if (!data[username]) {
            console.error("User not found in data:", data);
            alert("User not found. Try registering again.");
            return;
        }

        const userData = data[username];
        console.log("User data loaded:", userData);

        document.getElementById("streak").innerText = userData.streak || 0;
        document.getElementById("avgPrayers").innerText = userData.avgPrayers || 0;
        document.getElementById("mostMissed").innerText = userData.mostMissed || "None";

    } catch (error) {
        console.error("Error loading user data:", error);
        alert("Error loading user data. Please try again later.");
    }
}

// Attach prayer buttons dynamically
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded.");
    
    // Attach event listeners to prayer buttons
    const buttons = document.querySelectorAll(".prayerButton");
    
    if (buttons.length === 0) {
        console.error("Prayer buttons not found.");
    } else {
        console.log("Buttons found:", buttons);
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                console.log(`Button clicked: ${button.dataset.prayer}`);
                logPrayer(button.dataset.prayer);
            });
        });
    }

    loadUserProfile(); // Load user data
});
