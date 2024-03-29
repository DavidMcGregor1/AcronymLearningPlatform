// Declare the add/edit form as a variable and hide it when the page loads
const additLogin = document.getElementById("addit-login");
additLogin.classList.add("hidden");

// Declare the login successful message as a variable and hide it when the page loads
const loggedInTempSection = document.getElementById("logged-in-temp");
loggedInTempSection.classList.add("hidden");

// Declare the login and logout button and hide the logout button when the page loads
const loginButtonHdr = document.getElementById("login-button-hdr");
const logoutButtonHdr = document.getElementById("logout-button-hdr");
logoutButtonHdr.classList.add("hidden");

// Declare the login error message and hide it when the page loads
const loginErrorMessage = document.getElementById("login-error-div");
loginErrorMessage.classList.add("hidden");

// Declare the add acronym error message and hide it when the page loads
const addAcronymErrorMessage = document.getElementById("add-acronym-error-div");
addAcronymErrorMessage.classList.add("hidden");

var editAddOrLogin;

// Store web token in local storage if the response from the server jwt is not null
function isLoggedIn() {
  return localStorage.getItem("jwt") !== null;
}

// Displays the login page when the user clicks the login button
loginButtonHdr.addEventListener("click", () => {
  editAddOrLogin = "login";
  additLogin.classList.remove("hidden");
  descriptionSection.classList.add("hidden");
});

// Remove jwt from local storage and reloads the page
function logout() {
  localStorage.removeItem("jwt");
  window.location.reload();
}

// Logs the user out when the user clicks the logout button
logoutButtonHdr.addEventListener("click", () => {
  logout();
});

// Only remove login button and show logout button if the user is logged in
if (isLoggedIn()) {
  replaceLoginButtonWithLogoutButton();
}

// Cancel button on login form
const cancelButton = document.getElementById("cancel-login");
cancelButton.addEventListener("click", () => {
  additLogin.classList.add("hidden");
  addAcronymContainer.classList.add("hidden");
  descriptionSection.classList.remove("hidden");
});

// Starts login process if user has pressed enter
function handleKeyPress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    login();
  }
}

// Calls handleKeyPress function on any keypress event from the user
document
  .querySelector(".login-inputu")
  .addEventListener("keypress", handleKeyPress);
document
  .querySelector(".login-inputp")
  .addEventListener("keypress", handleKeyPress);

// Handles login request
function login() {
  const username = document.querySelector(".login-inputu").value;
  const password = document.querySelector(".login-inputp").value;

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const jwt = xhr.responseText;

        if (jwt) {
          localStorage.setItem("jwt", jwt);

          // if the user clicked the add acronym button to get to this login form then show the add acronym form
          if (editAddOrLogin === "add") {
            replaceLoginButtonWithLogoutButton();
            additLogin.classList.add("hidden");
            addAcronymContainer.classList.remove("hidden");
            // if the user clicked the edit acronym button to get to this login form then show the edit acronym form
          } else if (editAddOrLogin === "edit") {
            replaceLoginButtonWithLogoutButton();
            additLogin.classList.add("hidden");
            editDescriptionSection.classList.remove("hidden");
            // if the user clicked the login button to get to this form then show login successfull page for one second and reload the page so they see the description form again
          } else if (editAddOrLogin === "login") {
            loggedInTempSection.classList.remove("hidden");
            additLogin.classList.add("hidden");
            setTimeout(function () {
              loggedInTempSection.classList.add("hidden");
              description.classList.remove("hidden");
              window.location.reload();
            }, 1000);
          }
        }
        // if the login was incorrect then show the login error message
        else {
          loginErrorMessage.classList.remove("hidden");
        }
      }
      // if there is an issue getting a response from the server then log out the error (dev use)
      else {
        console.error("Error: ", xhr.status);
      }
    }
  };

  // Send a post request to the /login api with the users inputted username and password
  xhr.open("POST", "/login", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  const requestBody =
    "submittedUsername=" +
    encodeURIComponent(username) +
    "&submittedPassword=" +
    encodeURIComponent(password);
  xhr.send(requestBody);
}

// Login button on login form
const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", () => {
  login();
});

// Replaces the login button with the logout button if this function is called (should only be called if the user is logged in)
function replaceLoginButtonWithLogoutButton() {
  const loginButtonHdr = document.getElementById("login-button-hdr");
  const logoutButtonHdr = document.getElementById("logout-button-hdr");
  loginButtonHdr.classList.add("hidden");
  logoutButtonHdr.classList.remove("hidden");
}

// Checks if the user is logged in when they click the add button. If they are, they see the add form, if they are not, they see the login form.
const addNewAcronymBtn = document.getElementById("add-new-acronym-btn");
addNewAcronymBtn.addEventListener("click", () => {
  editAddOrLogin = "add";

  // Checks if the user is logged in and displays the add acronym form if they are
  if (isLoggedIn()) {
    addAcronymContainer.classList.remove("hidden");
    descriptionSection.classList.add("hidden");
    addNewAcronymBtn.classList.add("hidden");
  } else {
    // If they are not logged in, show the login form
    additLogin.classList.remove("hidden");
    descriptionSection.classList.add("hidden");
  }
});

// Checks if the user is logged in when they click the edit button. If they are, they see the edit form, if they are not, they see the login form.
const editDescriptionBtn = document.getElementById("edit-description-button");
editDescriptionBtn.addEventListener("click", () => {
  const currentDescription =
    document.getElementById("description-text").innerText;
  const newDescriptionTextArea = document.getElementById("newDescription");
  newDescriptionTextArea.value = currentDescription;

  editAddOrLogin = "edit";

  // Checks if the user is logged in and displays the edit description form if they are
  if (isLoggedIn()) {
    descriptionSection.classList.add("hidden");
    addNewAcronymBtn.classList.add("hidden");
    editDescriptionSection.classList.remove("hidden");
  } else {
    // If they are not logged in, show the login form
    additLogin.classList.remove("hidden");
    descriptionSection.classList.add("hidden");
  }
});
