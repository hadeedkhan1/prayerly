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
    if (!username) return;

    document.getElementById("usernameDisplay").innerText = username;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const userData = data[username];

        if (userData) {
            document.getElementById("streak").innerText = userData.streak;
            document.getElementById("avgPrayers").innerText = userData.avgPrayers;
            document.getElementById("mostMissed").innerText = userData.mostMissed;
        }
    } catch (error) {
        alert("Error loading user data.");
        console.error(error);
    }
}

// Attach prayer buttons dynamically
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("signupForm")) return;

    document.querySelectorAll(".prayerButton").forEach(button => {
        button.addEventListener("click", () => logPrayer(button.dataset.prayer));
    });

    loadUserProfile();
});
