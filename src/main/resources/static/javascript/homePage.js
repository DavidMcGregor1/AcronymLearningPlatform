const learnButton = document.getElementById("learn-button");
const quizButton = document.getElementById("quiz-button");

learnButton.addEventListener("click", () => {
  window.location.href = "/learnPage";
});

quizButton.addEventListener("click", () => {
  window.location.href = "/quizMenuPage";
});
