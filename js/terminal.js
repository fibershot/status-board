import * as readline from "node:readline";
import { sendPreset, sendManual } from "./terminalUtilities.js";

// Use nodejs readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Start a terminal
export function terminalStart(socket) {
    // Ask which terminal utility would the user like to use
    rl.question("preset [p] | manual [m] | exit [e]): ", (command) => {
        if (command == "preset" || command == "p"){
            sendPreset(socket, rl, terminalStart);
        } else if (command == "manual" || command == "m"){
            sendManual(socket, rl, terminalStart);
        } else if (command == "exit" || command == "e"){
            console.log("Shutting down...");
            process.exit(1);
        } else {
            console.log("Command input invalid.");
            terminalStart(socket);
        }
    });
}