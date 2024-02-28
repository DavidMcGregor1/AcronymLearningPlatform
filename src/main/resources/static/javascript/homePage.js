// Declare the learn and quiz buttons
const learnButton = document.getElementById("learn-button");
const quizButton = document.getElementById("quiz-button");

// If the user clicks the learn button, take them to the learn page
learnButton.addEventListener("click", () => {
  window.location.href = "/learnPage";
});

// If the user clicks the quiz button, take them to the quiz page
quizButton.addEventListener("click", () => {
  window.location.href = "/quizMenuPage";
});
