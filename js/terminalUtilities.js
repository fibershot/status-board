import chalk from "chalk";
import readlinesync from "readline-sync"
import { terminalStart } from "./terminal.js";
import { sucClr, wrnClr, errClr, defClr, graClr, whiClr } from "./chalks.js"
import { liveInput } from "./liveinput.js";
import { presetUI, manualUI } from "./terminalUI.js";

const stopListen = () => process.stdin.removeAllListeners('data');

export function sendPreset(socket, terminalStart) {
    stopListen();
    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf8");
    // Ask for input
    console.clear();
    presetUI();
    
    process.stdin.on('data', (key) => {
        if (key === '\u0003') { // Ctrl + C to exit
            console.log(graClr("Shutting down..."));
            process.exit();
        }

        switch (key) {
            case '1': // Available
                socket.emit("preset", "available");
                sendPreset(socket, terminalStart);
                break;
            case '2': // Away
                socket.emit("preset", "away");
                sendPreset(socket, terminalStart);
                break;
            case '3': // Meeting
                socket.emit("preset", "meeting");
                sendPreset(socket, terminalStart);
                break;
            case '4': // Eating
                socket.emit("preset", "eating");
                sendPreset(socket, terminalStart);
                break;
            case '5': // Closed
                socket.emit("preset", "closed");
                sendPreset(socket, terminalStart);
                break;
            case '6':
                stopListen();
                console.clear();
                terminalStart(socket);
                break;
            default:
                console.log(wrnClr("Command input", errClr("invalid.")));
                sendPreset(socket, terminalStart);
                break;
        }
    });
}

export function sendManual(socket, terminalStart) {

    stopListen();
    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf8");

    // Ask for input
    console.clear();
    manualUI();
    process.stdin.on('data', (key) => {
        if (key === '\u0003') { // Ctrl + C to exit
            console.log(graClr("Shutting down..."));
            process.exit();
        }

        switch (key) {
            case '1': // Text
                stopListen();
                liveInput(socket, terminalStart);
                break;
            case '2': // Text size
                socket.emit("preset", "away");
                sendManual(socket, terminalStart);
                break;
            case '3': // Background color
                socket.emit("preset", "meeting");
                sendManual(socket, terminalStart);
                break;
            case '4': // Background image
                socket.emit("preset", "eating");
                sendManual(socket, terminalStart);
                break;
            case '5': // Back
                stopListen();
                terminalStart(socket);
                break;
            default:
                console.log(wrnClr("Command input", errClr("invalid.")));
                sendManual(socket, terminalStart);
                break;
        }
    });
}