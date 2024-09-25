import readline from 'readline';
import jsonfile from 'jsonfile';
import fs from 'fs';

export function liveInput(socket, startTerminal) {
    // Fetch initial text
    socket.emit("fetchText", "x");

    const file = "./json/webdata.json";
    let text = "";

    jsonfile.readFile(file)
        .then(data => {
            text = data.text || "";

            // Set up readline for capturing keypresses in raw mode
            readline.emitKeypressEvents(process.stdin);
            process.stdin.setRawMode(true);
            process.stdin.resume();

            // Clean console and show initial text
            console.clear();
            console.log("Liveinput:\n" + JSON.stringify(text) + "<");

            // Define keypress event handler
            const onKeyPress = (str, key) => {
                if (key.name === "escape") {
                    cleanup();
                    startTerminal(socket);
                } else if (key && key.name === "backspace") {
                    text = text.slice(0, -1);
                } else if (str && !key.ctrl && !key.meta) {
                    text += str;
                }

                // Clear console and show updated text
                console.clear();
                console.log("Liveinput:\n" + JSON.stringify(text) + "<");

                // Emit updated text to the socket and write to file
                socket.emit("text", text);

                // Write updated text back to the JSON file
                jsonfile.readFile(file)
                    .then(existingData => {
                        existingData.text = text;  // Update only the text field
                        const jsonString = JSON.stringify(existingData, null, 2);
                        fs.writeFileSync(file, jsonString);
                        //return jsonfile.writeFile(file, existingData, { spaces: 2 });
                    })
                    .catch(error => console.error("Error writing to file:", error));
            };

                // Attach keypress event listener
                process.stdin.on('keypress', onKeyPress);

                // Cleanup function to reset readline and event listeners
                function cleanup() {
                    process.stdin.setRawMode(false);
                    process.stdin.pause();
                    process.stdin.removeListener('keypress', onKeyPress);
                    console.clear();
                }
    })
    .catch(error => console.error(error));
}