import * as readline from "node:readline";
import { liveInput } from "./liveinput.js";
import { sendPreset, sendManual } from "./terminalUtilities.js";
import { sucClr, wrnClr, errClr, defClr, graClr, whiClr } from "./chalks.js"
import { menuUI } from "./terminalUI.js";

// Start a terminal
export function terminalStart(socket) {

    process.stdin.setRawMode(true);
    process.stdin.removeAllListeners('data');
    process.stdin.removeAllListeners('keypress');
    process.stdin.setEncoding("utf8");
    menuUI();
    
    process.stdin.on('data', (key) => {

        if (key === '\u0003') { // Ctrl + C to exit
            console.log(graClr("Shutting down..."));
            process.exit();
        }

        switch (key) {
            case '1': // Preset
                process.stdin.removeAllListeners('data');
                sendPreset(socket, terminalStart);
                break;
            case '2': // Manual
                process.stdin.removeAllListeners('data');
                sendManual(socket, terminalStart);
                break;
            case '3': // Liveinput
                process.stdin.removeAllListeners('data');
                liveInput(socket, terminalStart);
                break;
            case '4': // Help
                console.log(graClr("Help stuff!!!"));
                break;
            case '5':
                console.log(graClr("Shutting down..."));
                process.exit();
            default:
                console.log(wrnClr("Command input", errClr("invalid.")));
                terminalStart(socket);
                break;
        }
    });
}