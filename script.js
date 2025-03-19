// DOM Elements
const themeSwitch = document.getElementById("theme-switch");
const generateBtn = document.getElementById("generate-btn");
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("error-message");
const userCard = document.getElementById("user-card");
const userAvatar = document.getElementById("user-avatar").querySelector("img");
const userName = document.getElementById("user-name").querySelector("h2");
const userUsername = document
  .getElementById("user-name")
  .querySelector(".user-username");
const userEmail = document.getElementById("user-email");
const userPhone = document.getElementById("user-phone");
const userDob = document.getElementById("user-dob");
const userLocation = document.getElementById("user-location");
const userNationality = document.getElementById("user-nationality");
const copyBtn = document.getElementById("copy-btn");
const generateNewBtn = document.getElementById("generate-new-btn");
const historyContainer = document.getElementById("history-container");
const userHistory = document.getElementById("user-history");
const tryAgainBtn = document.getElementById("try-again-btn");
const toast = document.getElementById("toast");
const toastIcon = document.getElementById("toast-icon");
const toastTitle = document.getElementById("toast-title");
const toastDescription = document.getElementById("toast-description");

// State
let currentUser = null;
let history = [];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Check for dark mode preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.body.classList.add("dark");
    themeSwitch.checked = true;
  }

  // Event listeners
  setupEventListeners();

  // Generate initial user
  fetchUser();
});

// Setup Event Listeners
function setupEventListeners() {
  // Theme toggle
  themeSwitch.addEventListener("change", toggleTheme);

  // Generate button
  generateBtn.addEventListener("click", fetchUser);

  // Copy button
  copyBtn.addEventListener("click", copyUserInfo);

  // Generate new button
  generateNewBtn.addEventListener("click", fetchUser);

  // Try again button
  tryAgainBtn.addEventListener("click", fetchUser);
}

// Toggle Theme
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Fetch User
function fetchUser() {
  // Show loader, hide error and user card
  loader.style.display = "flex";
  errorMessage.style.display = "none";
  userCard.style.display = "none";

  // Create XMLHttpRequest
  const xhr = new XMLHttpRequest();
  const url = "https://randomuser.me/api/";

  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      currentUser = response.results[0];

      // Add to history
      addToHistory(currentUser);

      // Display user
      displayUser(currentUser);

      // Hide loader
      loader.style.display = "none";
    } else {
      // Show error
      loader.style.display = "none";
      errorMessage.style.display = "block";
    }
  };

  xhr.onerror = function () {
    // Show error
    loader.style.display = "none";
    errorMessage.style.display = "block";
  };

  xhr.send();
}

// Display User
function displayUser(user) {
  // Set user avatar
  userAvatar.src = user.picture.large;

  // Set user name
  userName.textContent = `${user.name.first} ${user.name.last}`;
  userUsername.textContent = `@${user.login.username}`;

  // Set user details
  userEmail.textContent = user.email;
  userPhone.textContent = user.phone;

  // Format and set date of birth
  const dob = new Date(user.dob.date);
  const formattedDob = `${dob.getDate()}/${
    dob.getMonth() + 1
  }/${dob.getFullYear()} (${user.dob.age} years)`;
  userDob.textContent = formattedDob;

  // Set location
  userLocation.textContent = `${user.location.city}, ${user.location.country}`;

  // Set nationality
  userNationality.textContent = user.nat;

  // Show user card
  userCard.style.display = "block";

  // Show history if there are items
  if (history.length > 1) {
    historyContainer.style.display = "block";
  }
}

// Add to History
function addToHistory(user) {
  // Add to beginning of array
  history.unshift(user);

  // Limit to 6 items
  if (history.length > 6) {
    history = history.slice(0, 6);
  }

  // Render history
  renderHistory();
}

// Render History
function renderHistory() {
  // Only show history items after the current user
  const historyItems = history.slice(1);

  if (historyItems.length > 0) {
    userHistory.innerHTML = "";

    historyItems.forEach((user) => {
      const historyCard = document.createElement("div");
      historyCard.className = "history-card";

      const historyAvatar = document.createElement("div");
      historyAvatar.className = "history-avatar";
      historyAvatar.innerHTML = `<img src="${user.picture.medium}" alt="User Avatar">`;

      const historyInfo = document.createElement("div");
      historyInfo.className = "history-info";
      historyInfo.innerHTML = `
                <h4>${user.name.first} ${user.name.last}</h4>
                <p>${user.email}</p>
                <p>${user.location.city}, ${user.location.country}</p>
            `;

      historyCard.appendChild(historyAvatar);
      historyCard.appendChild(historyInfo);
      userHistory.appendChild(historyCard);
    });

    historyContainer.style.display = "block";
  } else {
    historyContainer.style.display = "none";
  }
}

// Copy User Info
function copyUserInfo() {
  if (!currentUser) return;

  const userInfo = `
Name: ${currentUser.name.first} ${currentUser.name.last}
Username: ${currentUser.login.username}
Email: ${currentUser.email}
Phone:  ${currentUser.name.last}
Username: ${currentUser.login.username}
Email: ${currentUser.email}
Phone: ${currentUser.phone}
Date of Birth: ${new Date(currentUser.dob.date).toLocaleDateString()} (${
    currentUser.dob.age
  } years)
Location: ${currentUser.location.city}, ${currentUser.location.country}
Nationality: ${currentUser.nat}
    `;

  navigator.clipboard.writeText(userInfo);
  showToast(
    "success",
    "Copied to clipboard",
    "User information has been copied to your clipboard"
  );
}

// Show Toast
function showToast(type, title, description) {
  // Set toast content
  toastTitle.textContent = title;
  toastDescription.textContent = description;

  // Set toast icon
  switch (type) {
    case "success":
      toastIcon.className = "fas fa-check-circle";
      toastIcon.style.color = "var(--success)";
      break;
    case "error":
      toastIcon.className = "fas fa-times-circle";
      toastIcon.style.color = "var(--destructive)";
      break;
    case "warning":
      toastIcon.className = "fas fa-exclamation-circle";
      toastIcon.style.color = "var(--warning)";
      break;
    case "info":
      toastIcon.className = "fas fa-info-circle";
      toastIcon.style.color = "var(--info)";
      break;
  }

  // Show toast
  toast.classList.add("show");

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
