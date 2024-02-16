const optionButtons = document.querySelectorAll(".option-button");
const categoriesButton = document.querySelectorAll(".categories-button");
const allButton = document.getElementById("all-button");
const lengthButton = document.querySelectorAll(".length-button");
const startButton = document.getElementById("start-button");
const fiveQuestions = document.getElementById("5-questions");

let allSelected = false;

optionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    optionButtons.forEach((b) => b.classList.remove("clicked"));
    button.classList.add("clicked");
  });
});

categoriesButton.forEach((button) => {
  button.addEventListener("click", () => {
    const isButtonClicked = button.classList.contains("clicked");
    const group = button.getAttribute("data-group");
    allButton.classList.remove("clicked");

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

lengthButton.forEach((button) => {
  button.addEventListener("click", () => {
    const isButtonClicked = button.classList.contains("clicked");
    const group = button.getAttribute("data-group");
    allButton.classList.remove("clicked");
    if (button === allButton) {
      lengthButton.forEach((b) => b.classList.remove("clicked"));
    } else {
      lengthButton.forEach((b) => {
        if (b.getAttribute("data-group") === group) {
          b.classList.remove("clicked");
        }
      });
    }
    button.classList.toggle("clicked", !isButtonClicked);
    allSelected = false;
    selectedLength = isButtonClicked ? null : button.textContent;
  });
});

allButton.addEventListener("click", () => {
  categoriesButton.forEach((button) => button.classList.remove("clicked"));
  lengthButton.forEach((button) => button.classList.remove("clicked"));
  allButton.classList.add("clicked");
  allSelected = true;
  selectedLength = null;
});

startButton.addEventListener("click", () => {
  logSelection();
});
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

  if (selectedLength) {
    selectedLength = parseInt(selectedLength.match(/\d+/)[0]);
  }

  if (selectedCategories.length <= 0) {
    selectedCategories = "all";
  }

  if (selectedLength == null) {
    selectedLength = 0;
  }

  console.log("selectedCategories -> " + selectedCategories);
  console.log("length:" + selectedLength);
  console.log(
    "Questions: --> " + (numberOfQuestions ? numberOfQuestions : null)
  );
  // console.log(
  //   "Selected category: " +
  //     (selectedCategories.length > 0 ? selectedCategories : "all")
  // );
  console.log("Selected length: " + (selectedLength ? selectedLength : null));
  console.log("Selected all: " + allSelected);
  console.log("------------------------------");
  sendSelections(numberOfQuestions, selectedCategories, selectedLength);
}

function sendSelections(numberOfQuestions, selectedCategories, selectedLength) {
  console.log("called send selections");
  console.log("num of questions passed in:" + numberOfQuestions);
  console.log("categories passed in:" + selectedCategories);
  console.log("length passed in:" + selectedLength);
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        console.log("Response -> ", response);
      } else {
        console.error("Error:", xhr.status);
      }
    }
  };

  // xhr.open("POST", "/getSpecifiedNumberOfQuestions", true);
  xhr.open(
    "POST",
    `/getSpecifiedNumberOfQuestions?numberOfQuestions=${numberOfQuestions}&category=${selectedCategories}&length=${selectedLength}`,
    true
  );
  xhr.setRequestHeader("Content-Type", "application/json");

  // var requestBody = JSON.stringify({
  //   numberOfQuestions: parseInt(numberOfQuestions), // Remove .textContent here
  //   category: selectedCategories[0], // Assuming only one category is selected
  //   length: selectedLength, // Length is already a string or null
  // });

  // console.log("request body -> " + requestBody);
  // xhr.send(requestBody);
  xhr.send();
}

allButton.click();
fiveQuestions.click();
