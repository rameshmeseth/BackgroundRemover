const imageInput = document.getElementById("imageInput");
const removeBtn = document.getElementById("removeBtn");
const resultImage = document.getElementById("resultImage");
const downloadLink = document.getElementById("downloadLink");

removeBtn.addEventListener("click", async () => {
  const file = imageInput.files[0];

  if (!file) {
    alert("Please select an image first!");
    return;
  }

  // Visual feedback: Disable button while processing
  removeBtn.disabled = true;
  removeBtn.innerText = "Processing...";

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:8000/remove-bg", {
      method: "POST",
      body: formData,
      // REMINDER: Do not set headers manually here
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error: ${errorText}`);
    }

    const blob = await response.blob();
    
    // Clean up old URL if it exists to save memory
    if (resultImage.src.startsWith('blob:')) {
      URL.revokeObjectURL(resultImage.src);
    }

    const imageUrl = URL.createObjectURL(blob);

    resultImage.src = imageUrl;
    downloadLink.href = imageUrl;
    downloadLink.download = "no-bg.png"; // Suggests a filename for download
    downloadLink.style.display = "inline";

  } catch (error) {
    console.error("Fetch error:", error);
    alert("Failed to remove background. Check if the backend is running and CORS is enabled.");
  } finally {
    // Re-enable button
    removeBtn.disabled = false;
    removeBtn.innerText = "Remove Background";
  }
});