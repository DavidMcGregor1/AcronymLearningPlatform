async function hitEndpoint() {
  const endpoint = "http://localhost/getQuestion";
  const requestOptions = {
    method: "GET", // Use GET method for retrieving data
    headers: {
      "Content-Type": "application/json",
    },
  };

  for (let i = 0; i < 119; i++) {
    const response = await fetch(endpoint, requestOptions);
    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      continue; // Skip to the next iteration of the loop
    }

    // Read response text
    const responseBody = await response.text();

    // Log the raw response
    console.log("Raw Response", responseBody);
  }
}

hitEndpoint();
