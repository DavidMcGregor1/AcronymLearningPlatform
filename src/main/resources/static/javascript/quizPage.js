let shuffledQuestions = [];
let currentQuestionIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  getShuffledQuestions();
});

displayQuestion();

function getShuffledQuestions() {
  console.log("Called test");

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        shuffledQuestions = shuffleArray(response);
        displayFirstQuestion();
      } else {
        console.error("Error updating acronym description:", xhr.status);
      }
    }
  };

  xhr.open("GET", "/getAllQuestions", true);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

console.log(
  "current question index outside anything:   -> " + currentQuestionIndex
);

function displayQuestion() {
  const questionElement = document.getElementById("question");
  questionElement.textContent = shuffledQuestions[currentQuestionIndex];

  const questionNumber = document.getElementById("question-number");
  questionNumber.textContent = "Question " + (currentQuestionIndex + 1);
}

function displayFirstQuestion() {
  const questionElement = document.getElementById("question");
  if (shuffledQuestions.length > 0) {
    questionElement.textContent = shuffledQuestions[0];
  } else {
    console.error("Shuffled questions array is empty or undefined.");
  }
}

function selectAnswer() {
  currentQuestionIndex++;
  displayQuestion();
}

document.querySelector(".options").addEventListener("click", () => {
  selectAnswer();
});
