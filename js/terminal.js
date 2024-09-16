import * as readline from "node:readline";
import { sendPreset, sendManual } from "./terminalUtilities.js";
import { liveInput } from "./liveinput.js";
import { sucClr, wrnClr, errClr, defClr, graClr, whiClr } from "./chalks.js"

// Use nodejs readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Start a terminal
export function terminalStart(socket) {
    // Ask which terminal utility would the user like to use
    rl.question(defClr("preset [p] | manual [m] | exit [e]): "), (command) => {
        if (command == "preset" || command == "p"){
            sendPreset(socket, rl, terminalStart);
        } else if (command == "manual" || command == "m"){
            sendManual(socket, rl, terminalStart);
        } else if (command == "exit" || command == "e"){
            console.log(graClr("Shutting down..."));
            process.exit(1);
        } else if (command == "livetext" || command == "l"){
            console.log(graClr("Confirmed."));
            liveInput(socket, terminalStart);
        } else {
            console.log(wrnClr("Command input", errClr("invalid.")));
            terminalStart(socket);
        }
    });
}