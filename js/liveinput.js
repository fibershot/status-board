import * as readline from "node:readline";
import { terminalStart } from "./terminal.js";
import { sendPreset, sendManual } from "./terminalUtilities.js";
import { sucClr, wrnClr, errClr, defClr, graClr, whiClr } from "./chalks.js"
import fs from "fs";

export function liveInput(socket, terminalStart){
    // Hide annoying cursor and enable raw mode to capture individual keypresses
    let exitSequence = false;
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    socket.emit("fetchText", "x");

    let text = fs.readFileSync("./txt/current_text.txt", "utf8");

    // Clear console for inputting
    console.clear();
    console.log(text + "<");

    // Listen for keypress events
    // Exit with ESC or Ctrl+C
    process.stdin.on('keypress', (str, key) => {
    if (key.sequence === '\u001b' || key.sequence === "\u0003") {
        process.stdin.removeAllListeners('keypress');
        exitSequence = true;
        terminalStart();
    } else if (key.name === 'backspace') {
        text = text.slice(0, -1);
    } else if (key.name === 'space') {
        text += ' ';
    }  /*else if (key.name === "return") {
        text += "<br>";
    }*/  else if (str && str.length === 1 && !key.ctrl && !key.meta) {
        text += str; 
    }

    // Update terminal and website
    if (!exitSequence){
        console.clear();
        console.log(text + "<");
        socket.emit("text", text);
    } else {
        console.clear();
        console.log(
            "\n\n    Menu\n\n"+
            "[1] Presets\n"+
            "[2] Manual\n"+
            "[3] LiveInput\n"+
            "[4] Help\n"+
            "[5] Exit\n\nLiveinput's output: ", text);
    }
    });
}