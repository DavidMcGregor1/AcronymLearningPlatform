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