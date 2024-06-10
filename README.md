# JavaScript MP4 Box Extractor

This is a JavaScript application designed to parse MP4 files, print the layout of the sample file, and specifically extract the content of the MDAT box. The application is compatible with recent versions of Chrome, Internet Explorer 11, and Edge browsers. It leverages the power of typed arrays for efficient binary data manipulation.

## How it Works

The application fetches an MP4 file, reads it into an ArrayBuffer, and then creates a Uint8Array view of the ArrayBuffer. It then parses the MP4 file structure, printing the layout of the sample file to the console.

The application specifically looks for the MDAT box within the MP4 file structure. Once the MDAT box is found, its content is extracted and processed.

## Usage

To use this application, simply call the main function with the URL of the MP4 file you want to parse. The application will fetch the file, print the layout, and extract the MDAT box content.

## Dependencies

This project uses the Fetch API to fetch the MP4 file and typed arrays for efficient binary data manipulation. It does not have any external dependencies.
