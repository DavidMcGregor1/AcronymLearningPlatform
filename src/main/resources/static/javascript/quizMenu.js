const optionButtons = document.querySelectorAll(".option-button");
const categoriesButton = document.querySelectorAll(".categories-button");
const allButton = document.getElementById("all-button");
const lengthButton = document.querySelectorAll(".length-button");

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
