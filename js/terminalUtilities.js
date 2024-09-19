import chalk from "chalk";
import readlinesync from "readline-sync"
import { terminalStart } from "./terminal.js";
import { sucClr, wrnClr, errClr, defClr, graClr, whiClr } from "./chalks.js"
import { liveInput } from "./liveinput.js";

const stopListen = () => process.stdin.removeAllListeners('data');

export function sendPreset(socket, terminalStart) {
    stopListen();
    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf8");
    // Ask for input
    console.clear();
    console.log(
        "    Presets\n\n"+
        "[1] Available\n"+
        "[2] Away\n"+
        "[3] Meeting\n"+
        "[4] Lunch\n"+
        "[5] Closed\n"+
        "[6] Back"
    );
    
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
                terminalStart(socket);
                break;
            default:
                console.log(wrnClr("Command input", errClr("invalid.")));
                sendPreset(socket, terminalStart);
                break;
        }

        console.clear();
    });
}

export function sendManual(socket, terminalStart) {

    stopListen();
    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf8");

    // Ask for input
    console.clear();
    console.log(
        "    Manual\n\n"+
        "[1] Text\n"+
        "[2] Text size\n"+
        "[3] Background color\n"+
        "[4] Background image\n"+
        "[5] Back\n"
    );
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
                terminalStart(socket);
                break;
            default:
                console.log(wrnClr("Command input", errClr("invalid.")));
                sendManual(socket, terminalStart);
                break;
        }
    });
}