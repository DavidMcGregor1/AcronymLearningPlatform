// Declare all the buttons on the screen as variables
const optionButtons = document.querySelectorAll(".option-button");
const categoriesButton = document.querySelectorAll(".categories-button");
const allButton = document.getElementById("all-button");
const lengthButton = document.querySelectorAll(".length-button");
const startButton = document.getElementById("start-button");
const fiveQuestions = document.getElementById("5-questions");

let allSelected = false;

// For each of the option buttons, ensure not more than one can be selected
optionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    optionButtons.forEach((b) => b.classList.remove("clicked"));
    button.classList.add("clicked");
  });
});

// If any of the categories buttons are selected, remove the selection of the all button
categoriesButton.forEach((button) => {
  button.addEventListener("click", () => {
    const isButtonClicked = button.classList.contains("clicked");
    const group = button.getAttribute("data-group");
    allButton.classList.remove("clicked");

    // If the button that is clicked is the all button, remove the click from the categories buttons
    if (button === allButton) {
      categoriesButton.forEach((b) => b.classList.remove("clicked"));
    } else {
      categoriesButton.forEach((b) => {
        if (b.getAttribute("data-group") === group) {
          b.classList.remove("clicked");
        }
      });
    }
    button.classList.toggle("clicked", !isButtonClicked);
    allSelected = false;
    selectedCategories = isButtonClicked ? null : button.textContent;
  });
});

// For each button in the length section, remove the click from the all button
lengthButton.forEach((button) => {
  button.addEventListener("click", () => {
    const isButtonClicked = button.classList.contains("clicked");
    const group = button.getAttribute("data-group");
    allButton.classList.remove("clicked");
    // Check if clicked button is the all button, if it is then remove the click from the length buttons
    if (button === allButton) {
      lengthButton.forEach((b) => b.classList.remove("clicked"));
    } else {
      // If it is not the all button, remove the currently selected length button and replace the click
      lengthButton.forEach((b) => {
        if (b.getAttribute("data-group") === group) {
          b.classList.remove("clicked");
        }
      });
    }
    // Check if the button contains clicked and toggle the clicked classlist
    button.classList.toggle("clicked", !isButtonClicked);
    allSelected = false;
    selectedLength = isButtonClicked ? null : button.textContent;
  });
});

// If the user clicks the all button then remove any clicked buttons from the categories or length options
allButton.addEventListener("click", () => {
  categoriesButton.forEach((button) => button.classList.remove("clicked"));
  lengthButton.forEach((button) => button.classList.remove("clicked"));
  // Click the all button
  allButton.classList.add("clicked");
  allSelected = true;
  selectedLength = null;
});

startButton.addEventListener("click", () => {
  logSelection();
});

// Takes all of the selections the user has made and calls the sendSelections method to post to the api endpoint
function logSelection() {
  const numberOfQuestions = document.querySelector(
    ".option-button.clicked"
  ).textContent;
  let selectedCategories = Array.from(
    document.querySelectorAll(".categories-button.clicked")
  ).map((button) => button.textContent);
  let selectedLength = allSelected
    ? null
    : Array.from(document.querySelectorAll(".length-button.clicked"))
        .map((button) => button.textContent)
        .pop();

  // If selected length is present, remove the "-letter" from the text context so the value is 3 or 4
  if (selectedLength) {
    selectedLength = parseInt(selectedLength.match(/\d+/)[0]);
  }

  if (selectedCategories.length <= 0) {
    selectedCategories = "all";
  }

  // If no selected length was selected set the value to 0 beacuse the endpoint handles an integer not null
  if (selectedLength == null) {
    selectedLength = 0;
  }
  // Call the sendSelections method with the options the user selected
  sendSelections(numberOfQuestions, selectedCategories, selectedLength);
}

// Tale in the selections and hit the quiz endpoint method and return the list of questions
function sendSelections(numberOfQuestions, selectedCategories, selectedLength) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        const url = `/quizPage?numberOfQuestions=${numberOfQuestions}&category=${encodeURIComponent(
          selectedCategories
        )}&length=${selectedLength}`;
        window.location.href = url;
      } else {
        console.error("Error:", xhr.status);
      }
    }
  };

  xhr.open(
    "POST",
    `/getSpecifiedNumberOfQuestions?numberOfQuestions=${numberOfQuestions}&category=${selectedCategories}&length=${selectedLength}`,
    true
  );
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send();
}

// Click the all button and the 5 questions button when the page loads so something is selected and the user cannot start with empty selections.
allButton.click();
fiveQuestions.click();
