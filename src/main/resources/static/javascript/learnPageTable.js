// Declaring the add and edit containers as variables and hiding them when the page loads
const addAcronymContainer = document.getElementById("add-acronym-container");
addAcronymContainer.classList.add("hidden");

const editDescriptionSection = document.getElementById("edit-description");
editDescriptionSection.classList.add("hidden");

// Delcaring the error message and hiding it when the page loads
const newDescriptionError = document.getElementById(
  "new-description-error-div"
);
newDescriptionError.classList.add("hidden");

// Declaring the successfully added / edited screens and hiding them when the page loads
const editedDescriptionSuccess = document.getElementById("edited-acronym-temp");
const addedDescriptionSuccess = document.getElementById("added-acronym-temp");
editedDescriptionSuccess.classList.add("hidden");
addedDescriptionSuccess.classList.add("hidden");

const descriptionSection = document.getElementById("description");

var originalAcronyms;
var searchInput = document.getElementById("search-input-id");

// Calling the attachRowEventListeners method to add event listeners to all the rows when the page loads
attachRowEventListeners();

// Loops throw all the rows in the table and adds an event listener for each one to update the description section and highlight the row.
function attachRowEventListeners() {
  const rows = document.querySelectorAll("#acronym-table tbody tr");
  rows.forEach((row) => {
    row.addEventListener("click", function () {
      rows.forEach((row) => {
        row.classList.remove("highlighted");
      });
      row.classList.add("highlighted");
      const clickedAcronymCell = row.querySelector(".acronym-cell:first-child");
      const clickedAcronym = clickedAcronymCell
        ? clickedAcronymCell.textContent
        : "";
      const clickedAcronymId = row.getAttribute("data-acronym-id");
      updatedDescription(clickedAcronymId);
    });
  });

  if (rows.length > 0) {
    rows[0].click();
  }
}

// Posts the clicked acronym Id to the /getAcronymMeaningAndDescriptionById API and updates the description section based on the response.
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

// Filters the acronym table by search using search algorithm
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

// Resets the table if the search bar is empty (either through back space or clearing the search bar using the x)
searchInput.addEventListener("search", function () {
  if (searchInput.value === "") {
    resetTable();
  }
});

// Maps through the list of acronyms and adds each one to the originalAcronyms array
originalAcronyms = Array.from(
  document.querySelectorAll("#acronym-table tbody tr")
).map((row) => {
  return {
    id: row.getAttribute("data-acronym-id"),
    acronym: row.querySelector(".acronym-cell:first-child").textContent,
    meaning: row.querySelector(".acronym-cell:last-child").textContent,
  };
});

// Category dropdown logic - calls update method with the inputted category
const categoryDropdown = document.getElementById("categoryDropdown");
categoryDropdown.addEventListener("change", function () {
  const selectedCategory = categoryDropdown.value;
  const selectedLength = lengthDropdown.value;
  updateTableWithCategoryAndLength(selectedCategory, selectedLength);
});

// Length dropdown logic - calls update method with the inputted length
const lengthDropdown = document.getElementById("lengthDropdown");
lengthDropdown.addEventListener("change", function () {
  const selectedLength = lengthDropdown.value;
  const selectedCategory = categoryDropdown.value;
  updateTableWithCategoryAndLength(selectedCategory, selectedLength);
});

// Resets the table if the user clicks the all button
const allButton = document.getElementById("all-button");
allButton.addEventListener("click", () => {
  resetTable();
  highlightFirstAcronym();
});

// Updates the table content based on the provided list of acronyms
function updateTableContent(acronyms) {
  var tbody = document.querySelector("#acronym-table tbody");
  tbody.innerHTML = "";

  // Sort acronyms alphabetically by acronym
  acronyms.sort((a, b) => {
    return a.acronym.localeCompare(b.acronym);
  });

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

// Updates the table based on the category and length passed in
function updateTableWithCategoryAndLength(category, length) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var acronyms = JSON.parse(xhr.responseText);

        // Updates the table with the new data
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

// Highlights the first acronym in the table and updates the description with the description of the first acronym in the table
function highlightFirstAcronym() {
  const firstRow = document.querySelector(
    "#acronym-table tbody tr:first-child"
  );

  // If the first row is presentm it highlights it whenever this method is called
  if (firstRow) {
    firstRow.classList.add("highlighted");
    const firstRowAcronymId = firstRow.getAttribute("data-acronym-id");
    updatedDescription(firstRowAcronymId);
  }
}

// Resets the category and length dropdown to their placeholder values and cupdates the table content with the original list of acronyms
function resetTable() {
  var categoryDropdown = document.getElementById("categoryDropdown");
  if (categoryDropdown) {
    categoryDropdown.selectedIndex = 0;
  }

  // Resets the length dropdown to its placeholder value
  var lengthDropdown = document.getElementById("lengthDropdown");
  if (lengthDropdown) {
    lengthDropdown.selectedIndex = 0;
  }

  updateTableContent(originalAcronyms);
  attachRowEventListeners();
}

// Hides the display of the add acronym form and shows the description form again when a user cancels the add acronym process
const cancelNewAcronymButton = document.getElementById(
  "cancel-new-acronym-button"
);
cancelNewAcronymButton.addEventListener("click", () => {
  addAcronymContainer.classList.add("hidden");
  descriptionSection.classList.remove("hidden");
  addNewAcronymBtn.classList.remove("hidden");
});

// Hides the display of the edit acronym form and shows the description form again when a user cancels the edit acronym process
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

// Posts the NewAcronymData object to the /addAcronym API if none of the fields are blank
const submitAcronymButton = document
  .getElementById("submit-new-acronym-button")
  .addEventListener("click", () => {
    handleAddAcronym();
  });

const submitNewAcronymDescriptionButton = document
  .getElementById("submit-new-description-button")
  .addEventListener("click", () => {
    handleEditDescription();
  });

// checks if the inputs are valid and posts to the /addAcronym endpoint if they are
function handleAddAcronym() {
  const acronymLetters = document.getElementById("new-acronym-letters").value;
  const meaning = document.getElementById("new-acronym-meaning").value;
  const category = document.getElementById("new-acronym-category").value;
  const description = document.getElementById("new-acronym-description").value;
  const length = acronymLetters.length;

  // Displays the error message if any of the fields are left empty.
  if (
    acronymLetters === "" ||
    meaning === "" ||
    category === "" ||
    description === ""
  ) {
    addAcronymErrorMessage.classList.remove("hidden");
    return;
  }

  if (category === "all") {
    addAcronymContainer.classList.remove("hidden");
    return;
  } else {
    addAcronymErrorMessage.classList.add("hidden");
  }

  const NewAcronymData = {
    acronym: acronymLetters,
    meaning: meaning,
    category: category,
    length: length,
    description: description,
  };

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        // If the acronym is successfully added, then display the success message for one second and refresh the page
        addAcronymContainer.classList.add("hidden");
        addedDescriptionSuccess.classList.remove("hidden");
        setTimeout(function () {
          addedDescriptionSuccess.classList.add("hidden");
          descriptionSection.classList.remove("hidden");
          window.location.reload();
        }, 1000);
      } else {
        console.error("Error adding acronym:", xhr.status);
      }
    }
  };

  xhr.open("POST", "/addAcronym", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  // Retrieves token from local storage and addes it to the authorization header
  const token = localStorage.getItem("jwt");
  if (token) {
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
  } else {
    console.error("JWT token not found in local storage");
    return;
  }

  const requestBody = JSON.stringify(NewAcronymData);
  xhr.send(requestBody);
}

// Updates the description of a selected acronym using the PUT method to the /editAcronymDescription endpoint
function handleEditDescription() {
  const selectedAcronymId = document
    .querySelector(".highlighted")
    .getAttribute("data-acronym-id");

  // If the new description is greater than 275 characters show the 'too long' error message to the user
  const editedDescription = document.getElementById("newDescription").value;
  if (editedDescription.length > 275) {
    newDescriptionError.classList.remove("hidden");
    return;
  }

  const editRequest = {
    id: selectedAcronymId,
    description: editedDescription,
  };

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        updatedDescription(selectedAcronymId);
        editDescriptionSection.classList.add("hidden");
        editedDescriptionSuccess.classList.remove("hidden");
        setTimeout(function () {
          editedDescriptionSuccess.classList.add("hidden");
          descriptionSection.classList.remove("hidden");
          window.location.reload();
        }, 1000);
      } else {
        console.error("Error updating acronym description:", xhr.status);
      }
    }
  };

  xhr.open("PUT", "/editAcronymDescription", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  // Retrieves token from local storage and adds it to the authorization header
  const token = localStorage.getItem("jwt");
  if (token) {
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
  } else {
    console.error("JWT token not found in local storage");
    return;
  }

  const requestBody = JSON.stringify(editRequest);
  xhr.send(requestBody);
}
