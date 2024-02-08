const additLogin = document.getElementById("addit-login");
additLogin.classList.add("hidden");

const loggedInTempSection = document.getElementById("logged-in-temp");
loggedInTempSection.classList.add("hidden");

const loginButtonHdr = document.getElementById("login-button-hdr");
const logoutButtonHdr = document.getElementById("logout-button-hdr");
logoutButtonHdr.classList.add("hidden");

var editAddOrLogin;

function isLoggedIn() {
  return localStorage.getItem("jwt") !== null;
}

function logout() {
  localStorage.removeItem("jwt");
  window.location.reload();
}

function makeAuthenticatedRequest(endpoint, method, data) {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    console.error("JWT not found. User is not logged in.");
    return;
  }

  fetch(endpoint, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log("Inside handle response ");
    })
    .catch((error) => {
      console.error("Error making authenticated request:", error);
    });
}

loginButtonHdr.addEventListener("click", () => {
  console.log("Clicked the login button in the header");
  editAddOrLogin = "login";
  additLogin.classList.remove("hidden");
  descriptionSection.classList.add("hidden");
});

if (isLoggedIn()) {
  console.log("User is logged in (outside any method)");
  replaceLoginButtonWithLogoutButton();
}

const loginErrorMessage = document.getElementById("login-error-div");
const addAcronymErrorMessage = document.getElementById("add-acronym-error-div");
loginErrorMessage.classList.add("hidden");
addAcronymErrorMessage.classList.add("hidden");

const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", () => {
  console.log("clicked login button after entering fields");
  const username = document.querySelector(".login-inputu").value;
  const password = document.querySelector(".login-inputp").value;

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const jwt = xhr.responseText;
        if (jwt) {
          localStorage.setItem("jwt", jwt);

          if (editAddOrLogin === "add") {
            replaceLoginButtonWithLogoutButton();
            additLogin.classList.add("hidden");
            addAcronymContainer.classList.remove("hidden");
          } else if (editAddOrLogin === "edit") {
            replaceLoginButtonWithLogoutButton();
            additLogin.classList.add("hidden");
            editDescriptionSection.classList.remove("hidden");
          } else if (editAddOrLogin === "login") {
            loggedInTempSection.classList.remove("hidden");
            additLogin.classList.add("hidden");

            setTimeout(function () {
              loggedInTempSection.classList.add("hidden");
              description.classList.remove("hidden");
              window.location.reload();
            }, 1000);
          }
        } else {
          console.log("Login failed. Display error message.");
          loginErrorMessage.classList.remove("hidden");
        }
      } else {
        console.error("Error: ", xhr.status);
      }
    }
  };

  xhr.open("POST", "/login", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  const requestBody =
    "submittedUsername=" +
    encodeURIComponent(username) +
    "&submittedPassword=" +
    encodeURIComponent(password);
  xhr.send(requestBody);
});

logoutButtonHdr.addEventListener("click", () => {
  console.log("clicked logout button");
  logout();
});

function replaceLoginButtonWithLogoutButton() {
  console.log("called replaceLoginWithLogout method");
  const loginButtonHdr = document.getElementById("login-button-hdr");
  const logoutButtonHdr = document.getElementById("logout-button-hdr");
  loginButtonHdr.classList.add("hidden");
  logoutButtonHdr.classList.remove("hidden");
}

const addNewAcronymBtn = document.getElementById("add-new-acronym-btn");
addNewAcronymBtn.addEventListener("click", () => {
  editAddOrLogin = "add";
  if (isLoggedIn()) {
    addAcronymContainer.classList.remove("hidden");
    descriptionSection.classList.add("hidden");
    addNewAcronymBtn.classList.add("hidden");
  } else {
    additLogin.classList.remove("hidden");
    descriptionSection.classList.add("hidden");
  }
});

const editDescriptionBtn = document.getElementById("edit-description-button");
editDescriptionBtn.addEventListener("click", () => {
  editAddOrLogin = "edit";
  if (isLoggedIn()) {
    descriptionSection.classList.add("hidden");
    addNewAcronymBtn.classList.add("hidden");
    editDescriptionSection.classList.remove("hidden");
  } else {
    additLogin.classList.remove("hidden");
    descriptionSection.classList.add("hidden");
  }
});
