const additLogin = document.getElementById("addit-login");
additLogin.classList.add("hidden");

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
      Authorization: `Bearer ${jwt}`, // Include JWT in the Authorization header
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      // Handle response
      console.log("Inside handle response ");
    })
    .catch((error) => {
      console.error("Error making authenticated request:", error);
    });
}

const addAcronymContainer = document.getElementById("add-acronym-container");
const editDescriptionSection = document.getElementById("edit-description");
const loginButtonHdr = document.getElementById("login-button-hdr");
const logoutButtonHdr = document.getElementById("logout-button-hdr");
const loggedInTempSection = document.getElementById("logged-in-temp");
const descriptionSection = document.getElementById("description");
loggedInTempSection.classList.add("hidden");
logoutButtonHdr.classList.add("hidden");
addAcronymContainer.classList.add("hidden");
editDescriptionSection.classList.add("hidden");

function attachRowEventListeners() {
  const rows = document.querySelectorAll("#acronym-table tbody tr");
  rows.forEach((row) => {
    row.addEventListener("click", function () {
      rows.forEach((row) => {
        row.classList.remove("highlighted");
      });
      row.classList.add("highlighted");
      const clickedAcronym = row.querySelector(
        ".acronym-cell:first-child"
      ).textContent;
      const clickedAcronymId = row.getAttribute("data-acronym-id");
      updatedDescription(clickedAcronymId);
    });
  });

  if (rows.length > 0) {
    rows[0].click();
  }
}

function updatedDescription(acronymId) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);

        document.getElementById("description-text").innerText =
          response.description;
        document.getElementById("meaning-of-acronym-to-be-edited").innerText =
          response.meaning;
        document.getElementById("meaning-of-chosen-acronym").innerText =
          response.meaning;
      } else {
        console.error("Error:", xhr.status);
      }
    }
  };

  xhr.open("POST", "/getAcronymMeaningAndDescriptionById", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  var requestBody = JSON.stringify({ id: acronymId });
  xhr.send(requestBody);
}

attachRowEventListeners();
var originalAcronyms;
var searchInput = document.getElementById("search-input-id");

function filterTableBySearch() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("search-input-id");
  filter = input.value.toUpperCase();
  table = document.getElementById("acronym-table");
  filterTableBySearch;
  tr = table.getElementsByTagName("tr");

  if (filter === "") {
    resetTable();
    return;
  }

  for (i = 0; i < tr.length; i++) {
    var matchFound = false;
    var tdAcronym = tr[i].getElementsByTagName("td")[0];
    var tdMeaning = tr[i].getElementsByTagName("td")[1];

    if (tdAcronym && tdMeaning) {
      var txtValueAcronym = tdAcronym.textContent || tdAcronym.innerText;
      var txtValueMeaning = tdMeaning.textContent || tdMeaning.innerText;

      if (
        txtValueAcronym.toUpperCase().indexOf(filter) > -1 ||
        txtValueMeaning.toUpperCase().indexOf(filter) > -1
      ) {
        matchFound = true;
      }
    }

    if (matchFound) {
      tr[i].classList.remove("hidden-row");
    } else {
      tr[i].classList.add("hidden-row");
    }
  }
}

searchInput.addEventListener("search", function () {
  if (searchInput.value === "") {
    resetTable();
  }
});

originalAcronyms = Array.from(
  document.querySelectorAll("#acronym-table tbody tr")
).map((row) => {
  return {
    id: row.getAttribute("data-acronym-id"),
    acronym: row.querySelector(".acronym-cell:first-child").textContent,
    meaning: row.querySelector(".acronym-cell:last-child").textContent,
  };
});

// Category dropdown logic
const categoryDropdown = document.getElementById("categoryDropdown");
categoryDropdown.addEventListener("change", function () {
  const selectedCategory = categoryDropdown.value;
  const selectedLength = lengthDropdown.value;
  updateTableWithCategoryAndLength(selectedCategory, selectedLength);
});

// Length dropdown logic
const lengthDropdown = document.getElementById("lengthDropdown");
lengthDropdown.addEventListener("change", function () {
  const selectedLength = lengthDropdown.value;
  const selectedCategory = categoryDropdown.value;
  updateTableWithCategoryAndLength(selectedCategory, selectedLength);
});

// All button logic
const allButton = document.getElementById("all-button");
allButton.addEventListener("click", () => {
  resetTable();
  highlightFirstAcronym();
});

// Function to update the table with list of acronyms passed in
function updateTableContent(acronyms) {
  var tbody = document.querySelector("#acronym-table tbody");
  tbody.innerHTML = "";

  acronyms = acronyms || originalAcronyms;

  acronyms.forEach(function (acronym) {
    var row = document.createElement("tr");

    row.setAttribute("data-acronym-id", acronym.id);

    var acronymCell = document.createElement("td");
    acronymCell.textContent = acronym.acronym;

    var meaningCell = document.createElement("td");
    meaningCell.textContent = acronym.meaning;

    row.appendChild(acronymCell);
    row.appendChild(meaningCell);
    tbody.appendChild(row);
  });

  highlightFirstAcronym();
}

function updateTableWithCategoryAndLength(category, length) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var acronyms = JSON.parse(xhr.responseText);

        // Update the table with the new data
        updateTableContent(acronyms);

        attachRowEventListeners();
      } else {
        console.error("Error:", xhr.status);
      }
    }
  };
  xhr.open(
    "GET",
    "/acronymsByCategoryAndLength?category=" + category + "&length=" + length,
    true
  );
  xhr.send();
}

function highlightFirstAcronym() {
  const firstRow = document.querySelector(
    "#acronym-table tbody tr:first-child"
  );

  if (firstRow) {
    firstRow.classList.add("highlighted");

    const firstRowAcronymId = firstRow.getAttribute("data-acronym-id");

    updatedDescription(firstRowAcronymId);
  }
}

function resetTable() {
  // Reset the category dropdown to its placeholder value
  var categoryDropdown = document.getElementById("categoryDropdown");
  if (categoryDropdown) {
    categoryDropdown.selectedIndex = 0;
  }

  // Reset the length dropdown to its placeholder value
  var lengthDropdown = document.getElementById("lengthDropdown");
  if (lengthDropdown) {
    lengthDropdown.selectedIndex = 0;
  }

  updateTableContent(originalAcronyms);
  attachRowEventListeners();
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

const cancelNewAcronymButton = document.getElementById(
  "cancel-new-acronym-button"
);
cancelNewAcronymButton.addEventListener("click", () => {
  addAcronymContainer.classList.add("hidden");
  descriptionSection.classList.remove("hidden");
  addNewAcronymBtn.classList.remove("hidden");
});

const cancelDescriptionButton = document.getElementById(
  "cancel-description-button"
);
cancelDescriptionButton.addEventListener("click", () => {
  addAcronymContainer.classList.add("hidden");
  descriptionSection.classList.remove("hidden");
  addNewAcronymBtn.classList.remove("hidden");
  editDescriptionSection.classList.add("hidden");
  addAcronymContainer.classList.add("hidden");
});

const cancelButton = document.getElementById("cancel-login");
cancelButton.addEventListener("click", () => {
  additLogin.classList.add("hidden");
  addAcronymContainer.classList.add("hidden");
  descriptionSection.classList.remove("hidden");
});

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
        localStorage.setItem("jwt", jwt);

        // if (response === "true") {
        //   console.log("success!");
        //   localStorage.setItem("isLoggedIn", "true");
        //   console.log("should switch buttons");

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

const submitAcronymButton = document.getElementById(
  "submit-new-acronym-button"
);

submitAcronymButton.addEventListener("click", () => {
  console.log("clicked submit acronym button");
  const acronymLetters = document.getElementById("new-acronym-letters").value;
  const meaning = document.getElementById("new-acronym-meaning").value;
  const category = document.getElementById("new-acronym-category").value;
  const description = document.getElementById("new-acronym-description").value;
  const length = acronymLetters.length;

  if (
    acronymLetters === "" ||
    meaning === "" ||
    category === "" ||
    description === ""
  ) {
    console.log("something was blank");
    addAcronymErrorMessage.classList.remove("hidden");
    return;
  }

  if (category === "all") {
    addAcronymContainer.classList.remove("hidden");
    return;
  } else {
    addAcronymErrorMessage.classList.add("hidden");
  }

  console.log("acronym" + " " + acronymLetters);
  console.log("meaning" + " " + meaning);
  console.log("category" + " " + category);
  console.log("description" + " " + description);
  console.log("length" + " " + length);

  const NewAcronymData = {
    acronym: acronymLetters,
    meaning: meaning,
    category: category,
    length: length,
    description: description,
  };
  console.log("NewAcronymData: " + NewAcronymData);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log("Acronym Sucessfully added");
      } else {
        console.error("Error adding acronym:", xhr.status);
      }
    }
  };

  xhr.open("POST", "/addAcronym", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  const requestBody = JSON.stringify(NewAcronymData);
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
