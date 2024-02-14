const optionButtons = document.querySelectorAll(".option-button");
optionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    optionButtons.forEach((b) => b.classList.remove("clicked"));
    button.classList.add("clicked");
  });
});
