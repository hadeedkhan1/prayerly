const API_URL = "https://script.google.com/macros/s/AKfycbzRbRtvLAiG0KZ6k-FwKA_Yz0hqm_MU0QGUfsAqXwR_ygH6y5kKMaGIJk032sGQuhUe/exec";

// Load leaderboard
async function loadLeaderboard() {
    const response = await fetch(API_URL);
    const data = await response.json();
    const leaderboard = document.getElementById("leaderboard");

    Object.keys(data).forEach(username => {
        let row = leaderboard.insertRow();
        row.insertCell(0).innerHTML = `<a href="user.html?username=${username}">${username}</a>`;
        row.insertCell(1).innerText = data[username].streak;
        row.insertCell(2).innerText = data[username].avgPrayers;
    });
}

// Load user profile
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

    drawChart(userData.prayers);
}

// Log prayer
async function logPrayer(prayer) {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    if (!username) return;

    await fetch(`${API_URL}?username=${username}&prayer=${prayer}`);
    alert("Prayer logged!");
    loadUserProfile();
}

// Draw GitHub-style chart
function drawChart(data) {
    const ctx = document.getElementById("chart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"],
            datasets: [{
                label: "Prayers Logged",
                data: data,
                backgroundColor: ["#3498db", "#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6"]
            }]
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("leaderboard")) loadLeaderboard();
    if (document.getElementById("username")) loadUserProfile();
});
