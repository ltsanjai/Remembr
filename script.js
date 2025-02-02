// Load passwords from localStorage
let passwords = JSON.parse(localStorage.getItem("passwords")) || {};

// DOM Elements
const websiteInput = document.getElementById("website");
const passwordInput = document.getElementById("password");
const addButton = document.getElementById("add-btn");
const passwordList = document.getElementById("password-list");
const deleteButton = document.getElementById("delete-btn");

// Function to save passwords to localStorage
function savePasswords() {
  localStorage.setItem("passwords", JSON.stringify(passwords));
}

// Function to add a new password
function addPassword() {
  const website = websiteInput.value.trim();
  const password = passwordInput.value.trim();

  if (website && password) {
    passwords[website] = password;
    savePasswords();
    alert("Password saved successfully!");
    websiteInput.value = "";
    passwordInput.value = "";
    updatePasswordList();
  } else {
    alert("Please enter both website and password.");
  }
}

// Function to delete a selected password
function deletePassword() {
  const selected = document.querySelector(".selected");
  if (!selected) {
    alert("Please select an entry to delete.");
    return;
  }

  const website = selected.textContent.split(":")[0].trim();
  if (passwords[website]) {
    delete passwords[website];
    savePasswords();
    updatePasswordList();
    alert("Password deleted successfully!");
  } else {
    alert("Selected entry not found.");
  }
}

// Function to update the password list in the UI
function updatePasswordList() {
  passwordList.innerHTML = "";
  for (const [website, password] of Object.entries(passwords)) {
    const li = document.createElement("li");
    li.textContent = `${website}: ${password}`;
    li.addEventListener("click", () => {
      document.querySelectorAll("#password-list li").forEach((item) => {
        item.classList.remove("selected");
      });
      li.classList.add("selected");
    });
    passwordList.appendChild(li);
  }
}

// Event Listeners
addButton.addEventListener("click", addPassword);
deleteButton.addEventListener("click", deletePassword);

// Initialize the password list
updatePasswordList();

// Function to export passwords as a JSON file
function exportPasswords() {
  const data = JSON.stringify(passwords, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "passwords.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Function to import passwords from a JSON file
function importPasswords(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedPasswords = JSON.parse(e.target.result);
      if (typeof importedPasswords === "object" && !Array.isArray(importedPasswords)) {
        passwords = importedPasswords;
        savePasswords();
        updatePasswordList();
        alert("Passwords imported successfully!");
      } else {
        alert("Invalid file format. Please upload a valid JSON file.");
      }
    } catch (error) {
      alert("Error parsing the file. Please upload a valid JSON file.");
    }
  };
  reader.readAsText(file);
}

// Event Listeners for Export and Import
document.getElementById("export-btn").addEventListener("click", exportPasswords);
document.getElementById("import-btn").addEventListener("click", () => {
  document.getElementById("import-file").click();
});
document.getElementById("import-file").addEventListener("change", importPasswords);