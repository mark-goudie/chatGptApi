import "../css/style.scss";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("prompt-form");
  const responseContainer = document.getElementById("response-container");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const prompt = e.target.elements["prompt-input"].value;

    if (!prompt) {
      alert("Please enter a prompt!");
      return;
    }

    const requestPayload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      }),
    };

    // Clear existing interval if there is one
    if (window.loadingInterval) {
      clearInterval(window.loadingInterval);
    }

    // Start loading text
    responseContainer.innerText = "Loading";
    let dots = 0;

    // Update the text every 500 milliseconds
    window.loadingInterval = setInterval(() => {
      dots = (dots + 1) % 4; // Cycle through 0, 1, 2, 3
      responseContainer.innerText = "Loading" + ".".repeat(dots);
    }, 400);

    try {
      // Change the URL here

      const response = await fetch("/api/chat", requestPayload);

      // Once response is received, clear the interval
      clearInterval(window.loadingInterval);

      if (!response.ok) {
        const message = await response.text(); // Use .text() instead of .json() to handle non-JSON responses
        throw new Error(`Error: ${response.status}, ${message}`);
      }
      const data = await response.json();
      responseContainer.innerText = data.choices[0].message.content;
    } catch (err) {
      // If error occurs, clear the interval
      clearInterval(window.loadingInterval);
      console.error("Error:", err);
      responseContainer.innerText = "An error occurred. Please try again.";
    }
  });
});
