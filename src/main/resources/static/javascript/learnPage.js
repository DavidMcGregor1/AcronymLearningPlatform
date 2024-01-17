console.log("working");

function attachRowEventListeners() {
  console.log("Called attach row event listeners");
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
  console.log("called updatedDescription method");
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

const categoryDropdown = document.getElementById("categoryDropdown");
categoryDropdown.addEventListener("change", function () {
  const selectedCategory = categoryDropdown.value;
  const selectedLength = lengthDropdown.value;
  // updateTableWithCategory(selectedCategory)
  updateTableWithCategoryAndLength(selectedCategory, selectedLength);
});

// Length dropdown logic
const lengthDropdown = document.getElementById("lengthDropdown");
lengthDropdown.addEventListener("change", function () {
  const selectedLength = lengthDropdown.value;
  const selectedCategory = categoryDropdown.value;
  console.log("Selected: " + selectedLength);
  // updateTableWithLength(selectedLength)
  updateTableWithCategoryAndLength(selectedCategory, selectedLength);
});

function updateTableContent(acronyms) {
  console.log("called updateTableContent");
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
  console.log("called updateTableWithCategoryAndLength method");
  var xhr = new XMLHttpRequest();
  console.log("xhr: " + xhr);
  console.log("xhr.response" + xhr.responseText);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log("xhr.readyState = 4");
      if (xhr.status === 200) {
        console.log("xhr.status = 200");
        var acronyms = JSON.parse(xhr.responseText);
        console.log("xhr.response" + xhr.responseText);

        // Update the table with the new data
        updateTableContent(acronyms);

        attachRowEventListeners();
      } else {
        console.error("Error:", xhr.status);
      }
    }
  };

  console.log(
    "URL:",
    "/acronymsByCategoryAndLength?category=" + category + "&length=" + length
  );
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
