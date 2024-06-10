const parseXMLAndDisplayImages = async (blob) => {
  try {
    const response = await fetch(blob);
    const str = await response.text();

    // DomParser is not available in the worker thread
    const parser = new DOMParser();
    const data = parser.parseFromString(str, "text/xml");

    const smpteImages = data.getElementsByTagName("smpte:image");

    // Process images in the web worker thread
    const imageData = [];
    for (let i = 0; i < smpteImages.length; i++) {
      const base64String = smpteImages[i].textContent.trim();
      imageData.push({
        base64: base64String,
      });
    }

    // Post message back to the main thread with the image data
    self.postMessage(imageData);
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    self.postMessage(null); // Indicate error by sending null
  }
};

// Wrap the function in a self invoking function
(function () {
  self.addEventListener("message", (event) => {
    const { data: blob } = event;
    parseXMLAndDisplayImages(blob);
  });
})();
