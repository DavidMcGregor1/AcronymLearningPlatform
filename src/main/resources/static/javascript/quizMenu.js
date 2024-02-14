const optionButtons = document.querySelectorAll(".option-button");
const categoriesButton = document.querySelectorAll(".categories-button");
const allButton = document.getElementById("all-button");
const lengthButton = document.querySelectorAll(".length-button");
const startButton = document.getElementById("start-button");

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
  });
});

allButton.addEventListener("click", () => {
  categoriesButton.forEach((button) => button.classList.remove("clicked"));
  allButton.classList.add("clicked");
  allSelected = allButton.classList.contains("clicked");
});

lengthButton.forEach((button) => {
  button.addEventListener("click", () => {
    lengthButton.forEach((b) => b.classList.remove("clicked"));
    button.classList.add("clicked");
  });
});

startButton.addEventListener("click", () => {
  logSelection();
});

function logSelection() {
  const numberOfQuestions = document.querySelector(".option-button.clicked");
  const selectedCategories = Array.from(
    document.querySelectorAll(".categories-button.clicked")
  ).map((button) => button.textContent);
  const selectedLength = allSelected
    ? null
    : Array.from(document.querySelectorAll(".length-button.clicked"))
        .map((button) => button.textContent)
        .pop();

  console.log(
    "Questions: --> " +
      (numberOfQuestions ? numberOfQuestions.textContent : null)
  );
  console.log(
    "Selected category: " +
      (selectedCategories.length > 0 ? selectedCategories : null)
  );
  console.log("Selected length: " + (selectedLength ? selectedLength : null));
  console.log("Selected all: " + allSelected);
  console.log("------------------------------");
}
