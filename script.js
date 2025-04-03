var SHEET_ID = "1STfg5oEY1J2zAeNaOb1yE0iKemnOBsiuZHSUI9_W49w";  // Replace with your actual Google Sheets ID
var SHEET_NAME = "Users";

function doGet(e) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var response = {};

  data.forEach((row, index) => {
    if (index === 0) return; // Skip header
    var username = row[0];
    response[username] = {
      date: row[1],
      prayers: row.slice(2, 7), // Fajr, Dhuhr, Asr, Maghrib, Isha
      streak: row[7],
      avgPrayers: row[8],
      mostMissed: row[9]
    };
  });

  var output = ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);

  // Ensure CORS headers are included
  output.setHeader("Access-Control-Allow-Origin", "*");  // Allow any origin
  output.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");  // Allowed methods
  output.setHeader("Access-Control-Allow-Headers", "Content-Type");  // Allowed headers

  return output;
}

function doPost(e) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  var params = JSON.parse(e.postData.contents);

  var response = ContentService.createTextOutput().setMimeType(ContentService.MimeType.JSON);
  // Ensure CORS headers are included
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (params.action === "register") {
    return registerUser(params.username, sheet);
  } else if (params.action === "logPrayer") {
    return logPrayer(params.username, params.prayer, sheet);
  } else if (params.action === "getUser") {
    return getUser(params.username, sheet);
  } else {
    response.setContent("No action specified");
    return response;
  }
}

function registerUser(username, sheet) {
  var existingUsers = sheet.getDataRange().getValues().map(row => row[0]);
  if (existingUsers.includes(username)) {
    return ContentService.createTextOutput(JSON.stringify({ message: "User already exists" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([username, new Date().toISOString().split('T')[0], 0, 0, 0, 0, 0, 0, 0, "None"]);
  return ContentService.createTextOutput(JSON.stringify({ message: "User registered successfully" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function logPrayer(username, prayer, sheet) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === username) {
      var row = i + 1;
      var col = ["fajr", "dhuhr", "asr", "maghrib", "isha"].indexOf(prayer) + 2;
      sheet.getRange(row, col + 1).setValue(data[i][col] + 1);
      return ContentService.createTextOutput(JSON.stringify({ message: "Prayer logged!" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ message: "User not found!" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getUser(username, sheet) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === username) {
      var row = i + 1;
      var user = {
        username: data[i][0],
        streak: data[i][7],
        avgPrayers: data[i][8],
        mostMissed: data[i][9]
      };
      return ContentService.createTextOutput(JSON.stringify(user))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ message: "User not found!" }))
    .setMimeType(ContentService.MimeType.JSON);
}
