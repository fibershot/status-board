import readline from 'readline';
import fs from 'fs';

export function liveInput(socket, startTerminal) {
    // Fetch initial text
    socket.emit("fetchText", "x");
    let text = fs.readFileSync("./txt/current_text.txt", "utf8");

    // Set up readline for capturing keypresses in raw mode
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();

    // Clean console and show initial text
    console.clear();
    console.log("Liveinput:\n" + text + "<");

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
        console.log("Liveinput:\n" + text + "<");

        // Emit updated text to the socket and write to file
        socket.emit("text", text);
        fs.writeFileSync("./txt/current_text.txt", text, "utf8");
    };

    // Attach keypress event listener
    process.stdin.on('keypress', onKeyPress);

    // Cleanup function to reset readline and event listeners
    // Restore normal stdin mode
    // Stops reading from stdin
    // Remove keypress listener
    function cleanup() {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener('keypress', onKeyPress);
        console.clear();
    }
}