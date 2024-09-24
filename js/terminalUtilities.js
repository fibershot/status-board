import readlineSync from "readline-sync"
import { sucClr, wrnClr, errClr, defClr, graClr, whiClr } from "./chalks.js"
import chalk from "chalk";
import { presetUI, manualUI } from "./terminalUI.js";
import { terminalStart } from "./terminal.js";

export function sendPreset(socket, terminalStart) {

    const presetReset = setTimeout(function(){sendPreset(socket, terminalStart)}, 500);

    console.clear();
    presetUI();
    let index = readlineSync.keyIn("", {limit: "$<1-7>"});

    switch (index) {
        case "1": // Available
            socket.emit("preset", "available");
            presetReset;

            break;
        case "2": // Away
            socket.emit("preset", "away");
            presetReset;
            break;
        case "3": // Meeting
            socket.emit("preset", "meeting");
            presetReset;
            break;
        case "4": // Eating
            socket.emit("preset", "eating");
            presetReset;
            break;
        case "5": // Closed
            socket.emit("preset", "closed");
            presetReset;
            break;
        case "6": // Default
            socket.emit("preset", "default");
            presetReset;
            break;
        case "7": // Back
            console.clear();
            clearTimeout(presetReset);
            setTimeout(function(){terminalStart(socket)}, 500);
            break;
        default:
            console.log(wrnClr("Command input", errClr("invalid.")));
            presetReset;
            break;
    }
}

export function sendManual(socket, terminalStart) {

    const manualReset = setTimeout(function(){sendManual(socket, terminalStart)}, 500);

    console.clear();
    manualUI();
    let index = readlineSync.keyIn("", {limit: "$<1-5>"});
    let text;

    switch (index) {
        case "1": // Text replacement
            text = readlineSync.question("Replace text: ");
            socket.emit("text", text);
            manualReset;
            break;
        case "2": // Text size replacement
            text = readlineSync.question("Replace size: ");
            socket.emit("textSize", text);
            manualReset;
            break;
        case "3": // Color replacement
            text = readlineSync.question("Replace color: ");
            console.log("Color has been replaced with", chalk.hex(text).bold(text));
            socket.emit("backgroundColor", text);
            manualReset;
            break;
        case "4": // Image replacement
            text = readlineSync.question("Replace image: ");
            console.log("Nice try, Kaspian. This feature is not yet available.");
            manualReset;
            break;
        case "5": // Back
            console.clear();
            clearTimeout(manualReset);
            setTimeout(function(){terminalStart(socket)}, 500);
            break;
        default:
            console.log(wrnClr("Command input", errClr("invalid.")));
            manualReset;
            break;
    }
}

// Loading animation in console
export var loading = (function() {
    var P = ["\\", "|", "/", "—"];
    var x = 0;
    return setInterval(function() {
      process.stdout.write("\r" + P[x++]);
      x &= 3;
    }, 150);
  })();