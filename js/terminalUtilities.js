import readlineSync from "readline-sync"
import { sucClr, wrnClr, errClr, defClr, graClr, whiClr } from "./chalks.js"
import chalk from "chalk";
import { presetUI, manualUI } from "./terminalUI.js";
import { terminalStart } from "./terminal.js";

export function sendPreset(socket, terminalStart) {

    console.clear();
    presetUI();
    let index = readlineSync.keyIn("", {limit: "$<1-6>"});


    switch (index) {
        case "1": // Available
            socket.emit("preset", "available");
            break;
        case "2": // Away
            socket.emit("preset", "away");
            break;
        case "3": // Meeting
            socket.emit("preset", "meeting");
            break;
        case "4": // Eating
            socket.emit("preset", "eating");
            break;
        case "5": // Closed
            socket.emit("preset", "closed");
            break;
        case "6":
            console.clear();
            terminalStart(socket);
            break;
        default:
            console.log(wrnClr("Command input", errClr("invalid.")));
            sendPreset(socket, terminalStart);
            break;
    }

    setTimeout(function(){sendPreset(socket, terminalStart)}, 1500);
}

export function sendManual(socket, terminalStart) {

    console.clear();
    manualUI();
    let index = readlineSync.keyIn("", {limit: "$<1-6>"});
    let text;

    switch (index) {
        case "1": // Available
            text = readlineSync.question("Replace text: ");
            socket.emit("text", text);
            break;
        case "2": // Away
            text = readlineSync.question("Replace size: ");
            socket.emit("textSize", text);
            break;
        case "3": // Meeting
            text = readlineSync.question("Replace color: ");
            console.log("Color has been replaced with", chalk.hex(text).bold(text));
            socket.emit("backgroundColor", text);
            break;
        case "4": // Eating
            text = readlineSync.question("Replace image: ");
            console.log("Nice try, Kaspian. This feature is not yet available.");
            break;
        case "5": // Closed
            console.clear();
            terminalStart(socket);
            break;
        default:
            console.log(wrnClr("Command input", errClr("invalid.")));
            sendPreset(socket, terminalStart);
            break;
    }

    setTimeout(function(){sendManual(socket, terminalStart)}, 1500);
}

export var loading = (function() {
    var P = ["\\", "|", "/", "—"];
    var x = 0;
    return setInterval(function() {
      process.stdout.write("\r" + P[x++]);
      x &= 3;
    }, 150);
  })();