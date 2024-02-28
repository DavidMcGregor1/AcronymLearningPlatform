// Declare an empty array for the questions to ask and set the question index to 0
let shuffledQuestions = [];
let currentQuestionIndex = 0;

// When the page loads, call the get questions method
document.addEventListener("DOMContentLoaded", () => {
  getQuestionsBasedOnSelections();
});

// Gets all of the questions from the api endpoint and calls the display question method
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

// Set the global score to be 0 when the page loads
let globalScore = 0;

// Displays the question
function displayQuestion() {
  const questionElement = document.getElementById("question");
  const optionsContainer = document.querySelector(".options");
  const questionNumber = document.getElementById("question-number");
  const quizOverMessages = document.querySelectorAll(".quiz-over");

  if (!questionElement || !optionsContainer || !questionNumber) {
    console.error("One or more required elements not found.");
    return;
  }

  // Checks if the current question number is less than the number of questions in the list
  if (currentQuestionIndex < shuffledQuestions.length) {
    questionNumber.innerText = `Question ${currentQuestionIndex + 1} of ${
      shuffledQuestions.length
    }`;
    optionsContainer.innerHTML = "";

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    // For each question, create 4 options
    currentQuestion.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.classList.add("option");
      button.textContent = option;
      // If they click a button, call the selectAnswer method with the index they selected
      button.addEventListener("click", () => {
        selectAnswer(index);
      });
      // Add the created button to the button container
      optionsContainer.appendChild(button);
    });
  } else {
    // Quiz is over
    // Display the quiz over message and the score out of the length of questions
    const quizResultsContainer = document.getElementById("quiz-results");
    quizResultsContainer.classList.remove("hidden");
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.classList.add("hidden");
    document.getElementById("score").innerText =
      "Score: " + globalScore + "/" + shuffledQuestions.length;
  }
}

// Takes in the index the user selected and checks if the answer is correct
function selectAnswer(selectedIndex) {
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const correctAnswerIndex = currentQuestion.options.indexOf(
    currentQuestion.answer
  );
  const optionsContainer = document.querySelector(".options");
  const selectedButton = optionsContainer.children[selectedIndex];
  const correctButton = optionsContainer.children[correctAnswerIndex];
  let status = "";

  // Checks if the answer the user selected is correct
  if (selectedIndex === correctAnswerIndex) {
    // if the answer is correct then make the selected button green and add one to the score
    selectedButton.classList.add("correct");
    globalScore += 1;
  } else {
    // if the answer is not correct, make the selected button red and the correct answer green
    status = "incorrect";
    selectedButton.classList.add("wrong");
    correctButton.classList.add("correct");
  }

  // If the user gets a question wrong, display the correct answer for slightly longer so they can see what the answer was
  // If the user gets the question right, the wait time stays at the default value.
  let wait = 700;
  if (status === "incorrect") {
    wait = 1200;
  }

  // Wait for the selected time and then go to the next question
  setTimeout(() => {
    currentQuestionIndex++;
    displayQuestion();
  }, wait);
}

const playAgainButton = document.getElementById("playAgainButton");
const changeSettingsButton = document.getElementById("changeSettingsButton");

// If the user clicks the play again button, refresh the page to get a new set of questions (with the same category)
playAgainButton.addEventListener("click", () => {
  window.location.reload();
});

// If the user clicks the change settings button, take them back to the quize menu page
changeSettingsButton.addEventListener("click", () => {
  window.location.href = "/quizMenuPage";
});
