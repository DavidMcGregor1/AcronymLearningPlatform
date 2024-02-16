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

function displayQuestion() {
  const questionElement = document.getElementById("question");
  const optionsContainer = document.querySelector(".options");
  const questionNumber = document.getElementById("question-number");
  questionNumber.innerText = "Question " + (currentQuestionIndex + 1);
  optionsContainer.innerHTML = "";

  if (shuffledQuestions.length > 0) {
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
    console.error("Shuffled questions array is empty or undefined.");
  }
}

function selectAnswer(selectedIndex) {
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const correctAnswerIndex = currentQuestion.options.indexOf(
    currentQuestion.answer
  );
  const optionsContainer = document.querySelector(".options");
  const selectedButton = optionsContainer.children[selectedIndex];

  if (selectedIndex === correctAnswerIndex) {
    selectedButton.classList.add("correct");
  } else {
    selectedButton.classList.add("wrong");
  }

  setTimeout(() => {
    currentQuestionIndex++;
    displayQuestion();
  }, 700);
}
