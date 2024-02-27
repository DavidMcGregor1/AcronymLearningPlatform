let shuffledQuestions = [];
let currentQuestionIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  getQuestionsBasedOnSelections();
});

function getQuestionsBasedOnSelections() {
  const params = new URLSearchParams(window.location.search);
  const numberOfQuestions = params.get("numberOfQuestions");
  const category = params.get("category");
  const length = params.get("length");

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        shuffledQuestions = response;
        displayQuestion();
      } else {
        console.error("Error getting questions:", xhr.status);
      }
    }
  };

  xhr.open(
    "POST",
    `/getSpecifiedNumberOfQuestions?numberOfQuestions=${numberOfQuestions}&category=${category}&length=${length}`,
    true
  );
  xhr.setRequestHeader("Accept", "application/json");
  xhr.send();
}

let globalScore = 0;

function displayQuestion() {
  const questionElement = document.getElementById("question");
  const optionsContainer = document.querySelector(".options");
  const questionNumber = document.getElementById("question-number");
  const quizOverMessages = document.querySelectorAll(".quiz-over");

  if (!questionElement || !optionsContainer || !questionNumber) {
    console.error("One or more required elements not found.");
    return;
  }

  if (currentQuestionIndex < shuffledQuestions.length) {
    questionNumber.innerText = `Question ${currentQuestionIndex + 1} of ${
      shuffledQuestions.length
    }`;
    optionsContainer.innerHTML = "";

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    currentQuestion.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.classList.add("option");
      button.textContent = option;
      button.addEventListener("click", () => {
        selectAnswer(index);
      });
      optionsContainer.appendChild(button);
    });
  } else {
    // Quiz over
    const quizResultsContainer = document.getElementById("quiz-results");
    quizResultsContainer.classList.remove("hidden");
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.classList.add("hidden");
    document.getElementById("score").innerText =
      "Score: " + globalScore + "/" + shuffledQuestions.length;
  }
}

function selectAnswer(selectedIndex) {
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const correctAnswerIndex = currentQuestion.options.indexOf(
    currentQuestion.answer
  );
  const optionsContainer = document.querySelector(".options");
  const selectedButton = optionsContainer.children[selectedIndex];
  const correctButton = optionsContainer.children[correctAnswerIndex];
  let status = "";

  if (selectedIndex === correctAnswerIndex) {
    selectedButton.classList.add("correct");
    globalScore += 1;
  } else {
    status = "incorrect";
    selectedButton.classList.add("wrong");
    correctButton.classList.add("correct");
  }

  let wait = 700;
  if (status === "incorrect") {
    wait = 1200;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    displayQuestion();
  }, wait);
}

const playAgainButton = document.getElementById("playAgainButton");
const changeSettingsButton = document.getElementById("changeSettingsButton");
playAgainButton.addEventListener("click", () => {
  window.location.reload();
});

changeSettingsButton.addEventListener("click", () => {
  window.location.href = "/quizMenuPage";
});
