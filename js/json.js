import jsonfile from 'jsonfile'; // Import the jsonfile module

// Path to your JSON file
const file = './json/webdata.json';

/*
// Step 1: Read the existing data from the file
jsonfile.readFile(file)
  .then(data => {
    // Step 2: Modify the "text" field by appending " file"
    data.text += " file";
    console.log(`Updated text: ${data.text}`);

    // Step 3: Add or modify the "textSize" field
    data.textSize = 175;  // Set new textSize value

    // Step 4: Read and change the "backgroundColor"
    console.log(`Old backgroundColor: ${data.backgroundColor}`);
    data.backgroundColor = "#654321";  // Change to new color

    // Write the updated data back to the file
    return jsonfile.writeFile(file, data, { spaces: 2 });
  })
  .then(() => {
    console.log("File updated successfully.");
  })
  .catch(error => console.error(error));
*/
export function jsonText(path, textdata){
    if (!path){
        path = "./json/webdata.json";
    }
    jsonfile.readFile(path)
    .then(data => {
        data.text += textdata;
        data.text = data.text.slice(0, -1);
        return jsonfile.writeFile(file, data, { spaces: 2})
        })
        .then(() => {}) .catch(error => console.error(error));
}