const button = document.getElementById("button");
button.addEventListener("click", () => {
  test();
});

function test() {
  console.log("Called test");

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const shuffledQuestions = shuffleArray(response);
        console.log("Array of non-shuffled questions: ", response);
        console.log("Array of questions (shuffled):", shuffledQuestions);
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
