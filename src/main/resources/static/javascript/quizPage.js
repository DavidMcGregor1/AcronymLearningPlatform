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
        // Parse JSON response
        const response = JSON.parse(xhr.responseText);
        // Log the array of questions
        console.log("Array of questions:", response);
      } else {
        console.error("Error updating acronym description:", xhr.status);
      }
    }
  };

  xhr.open("GET", "/getAllQuestions", true);
  xhr.setRequestHeader("Accept", "application/json"); // Change Content-Type to Accept
  xhr.send();
}
