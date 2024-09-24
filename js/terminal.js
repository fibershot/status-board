import readlineSync, { keyInPause } from "readline-sync"
import { liveInput } from "./liveinput.js";
import { sendPreset, sendManual } from "./terminalUtilities.js";
import { sucClr, wrnClr, errClr, defClr, graClr, whiClr } from "./chalks.js"
import { menuUI, helpUI } from "./terminalUI.js";

// Start a terminal
export function terminalStart(socket) {
    console.clear();
    menuUI();
    let index = readlineSync.keyIn("", {limit: "$<1-5>"});

    switch (index) {
        case "1": // Preset
            console.clear();
            sendPreset(socket, terminalStart);
            break;
        case "2": // Manual
            console.clear();
            sendManual(socket, terminalStart);
            break;
        case "3": // Liveinput
            liveInput(socket, terminalStart);
            break;
        case "4": // Help
            console.clear();
            helpUI();
            readlineSync.keyInPause("\n\n    :");
            terminalStart(socket);
            break;
        case "5":
            console.log(graClr("Shutting down..."));
            process.exit();
        default:
            console.log(wrnClr("Command input", errClr("invalid.")));
            terminalStart(socket);
            break;
    }
}