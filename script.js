const API_URL = "https://script.google.com/macros/s/AKfycbzRbRtvLAiG0KZ6k-FwKA_Yz0hqm_MU0QGUfsAqXwR_ygH6y5kKMaGIJk032sGQuhUe/exec"; // Replace with your API URL

// Function to register a new user
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();

    if (!username) {
        alert("Please enter a username.");
        return;
    }

    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "register", username }),
        headers: { "Content-Type": "application/json" }
    });

    const result = await response.text();
    alert(result);

    if (result === "User registered successfully") {
        window.location.href = `user.html?username=${username}`;
    }
});

// Function to log a prayer
async function logPrayer(prayer) {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    if (!username) return;

    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "logPrayer", username, prayer }),
        headers: { "Content-Type": "application/json" }
    });

    const result = await response.text();
    alert(result);
    loadUserProfile(); // Refresh data
}

// Function to load user profile
async function loadUserProfile() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    if (!username) return;

    document.getElementById("username").innerText = username;

    const response = await fetch(API_URL);
    const data = await response.json();
    const userData = data[username];

    document.getElementById("streak").innerText = userData.streak;
    document.getElementById("avgPrayers").innerText = userData.avgPrayers;
    document.getElementById("mostMissed").innerText = userData.mostMissed;
}

// Initialize correct page functions
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("signupForm")) return;
    loadUserProfile();
});
