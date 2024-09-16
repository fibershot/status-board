import * as readline from "node:readline";
import { sucClr, wrnClr, errClr, defClr, graClr, whiClr } from "./chalks.js"

export function liveInput(socket, terminalStart){
    // Hide annoying cursor and enable raw mode to capture individual keypresses
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    let text = "testing";

    // Clear console for inputting
    console.clear();
    console.log(text);

    // Listen for keypress events
    // Exit with ESC or Ctrl+C
    process.stdin.on('keypress', (str, key) => {
    if (key.sequence === '\u001b' || key.sequence === "\u0003") {
        process.exit();
    }

    // Backspace remove character
    // Space
    // Any input
    if (key.name === 'backspace') {
        text = text.slice(0, -1);
    } else if (key.name === 'space') {
        text += ' ';
    } else if (str && str.length === 1 && !key.ctrl && !key.meta) {
        text += str; 
    }

    // Update terminal and website
    console.clear();
    console.log(text);
    socket.emit("text", text);
    });
}