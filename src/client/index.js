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
      body: JSON.stringify({ prompt }),
    };

    try {
      // Change the URL here
      const response = await fetch(
        "http://localhost:3000/api/chat",
        requestPayload
      );

      if (!response.ok) {
        const message = await response.text(); // Use .text() instead of .json() to handle non-JSON responses
        throw new Error(`Error: ${response.status}, ${message}`);
      }
      const data = await response.json();
      responseContainer.innerText = JSON.stringify(data);
    } catch (err) {
      console.error("Error:", err);
      responseContainer.innerText = "An error occurred. Please try again.";
    }
  });
});
