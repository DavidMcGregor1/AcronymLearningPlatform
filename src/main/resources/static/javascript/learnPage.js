const additLogin = document.getElementById("addit-login");
additLogin.classList.add("hidden");

function attachRowEventListeners() {
  const rows = document.querySelectorAll("#acronym-table tbody tr");
  rows.forEach((row) => {
    row.addEventListener("click", function () {
      rows.forEach((row) => {
        row.classList.remove("highlighted");
      });
      row.classList.add("highlighted");
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

// Add event listener for the "search" event
searchInput.addEventListener("search", function () {
  if (searchInput.value === "") {
    // If the search input is cleared using 'x', reset the table
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

const descriptionSection = document.getElementById("description");
const addNewAcronymBtn = document.getElementById("add-new-acronym-btn");
addNewAcronymBtn.addEventListener("click", () => {
  additLogin.classList.remove("hidden");
  descriptionSection.classList.add("hidden");
});

const cancelButton = document.getElementById("cancel-login");
cancelButton.addEventListener("click", () => {
  additLogin.classList.add("hidden");
  descriptionSection.classList.remove("hidden");
});

const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", () => {
  const username = document.querySelector(".login-inputu").value;
  const password = document.querySelector(".login-inputp").value;

  console.log("username =  " + username);
  console.log("password = " + password);

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log("inside 200");
        const response = xhr.responseText;
        console.log("response -> " + response);
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
