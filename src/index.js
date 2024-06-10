//let worker = new Worker("src/worker.js");

let url = "https://demo.castlabs.com/tmp/text0.mp4";

// Function to log box details
const logBoxDetails = (type, size) => {
  const currentTime = new Date();
  console.log(`  ${currentTime}  Found box of type ${type} and size ${size}`);
};
// Function to read a box
const readBox = (uint8Array, offset) => {
  const size =
    (uint8Array[offset] << 24) |
    (uint8Array[offset + 1] << 16) |
    (uint8Array[offset + 2] << 8) |
    uint8Array[offset + 3];
  const type = String.fromCharCode(
    uint8Array[offset + 4],
    uint8Array[offset + 5],
    uint8Array[offset + 6],
    uint8Array[offset + 7]
  );

  logBoxDetails(type, size);

  if (type === "mdat") {
    const content = new TextDecoder("utf-8").decode(
      uint8Array.slice(offset + 8, offset + size)
    );
    console.log(`Contents of mdat: ${content}`);

    // Create a Blob from the XML content
    let blob = new Blob([content], { type: "text/xml" });

    // Use the Fetch API to parse the XML
    parseXMLAndDisplayImages(blob);
  }

  return { size, type };
};

// Function to read inner boxes
const readInnerBoxes = (uint8Array, startOffset, endOffset) => {
  let offset = startOffset;
  while (offset < endOffset) {
    const { size, type } = readBox(uint8Array, offset);
    offset += size;

    if (type === "traf") {
      readInnerBoxes(uint8Array, offset - size + 8, offset);
    }
  }
};

// Function to read all boxes
const readAllBoxes = (uint8Array) => {
  let offset = 0;
  while (offset < uint8Array.length) {
    const { size, type } = readBox(uint8Array, offset);
    offset += size;

    if (type === "moof") {
      readInnerBoxes(uint8Array, offset - size + 8, offset);
    }
  }
};

// Function to parse the XML and display images
const parseXMLAndDisplayImages = async (blob) => {
  try {
    let response = await fetch(URL.createObjectURL(blob));
    let str = await response.text();
    let data = new window.DOMParser().parseFromString(str, "text/xml");

    let smpteImages = data.getElementsByTagName("smpte:image");

    // mpteImages is a NodeList of  'smpte:image' elements
    for (let i = 0; i < smpteImages.length; i++) {
      let base64String = smpteImages[i].textContent.trim();
      let img = document.createElement("img");
      img.src = "data:image/png;base64," + base64String;
      document.body.appendChild(img);
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
};

// Main function to fetch the file and start reading boxes
const readFiles = async (url) => {
  try {
    const response = await fetch(url);
    const ab = await response.arrayBuffer();
    console.log(`Successfully loaded the file: ${url}`);
    const uint8Array = new Uint8Array(ab);

    readAllBoxes(uint8Array);
  } catch (error) {
    console.error(error);
  }
};

readFiles(url);
