let shuffledQuestions = [];
let currentQuestionIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  getShuffledQuestions();
});

function getShuffledQuestions() {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        shuffledQuestions = response;
        displayQuestion();
      } else {
        console.error("Error getting shuffled questions:", xhr.status);
      }
    }
  };

  xhr.open("GET", "/getAllQuestions", true);
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
  console.log("Selected index:", selectedIndex);
  currentQuestionIndex++;
  displayQuestion();
}
