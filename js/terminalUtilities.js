import chalk from "chalk";
import { terminalStart } from "./terminal.js";

const sucClr = chalk.hex("#24D18D")
const wrnClr = chalk.hex("#FFA500");
const errClr = chalk.hex("#EE432F");
const defClr = chalk.hex("#3CB5D9");
const graClr = chalk.gray;
const whiClr = chalk.white;

export function sendPreset(socket, rl, terminalStart) {
    // Ask for input
    rl.question(defClr("\nback [b] | preset: "), (command) => { //Ask for input
        // Check input contents
        if (command == "b" || command == "back"){
            terminalStart(socket);
        }
        else if (command) {
            socket.emit("preset", command);
            console.log(defClr("Preset", sucClr(command), "sent!"));
            sendPreset(socket, rl, terminalStart);
        }
        else {
            console.log(wrnClr("Command input", errClr("invalid.")));
            sendPreset(socket, rl, terminalStart);
        }
    });
}

export function sendManual(socket, rl, terminalStart) {
    // Ask for input
    rl.question(defClr("\nback [b] | manual command: "), (command) => {
        // Check input contents
        if (command == "back" || command == "b"){
            terminalStart(socket);
        } else if (command) {
            let manualQuery = command + "'s value: ";
            // Since we are doing a manual input, we need a second input as well
            rl.question(defClr(manualQuery), (command2) => {
                if (command2) {
                    socket.emit(command, command2);
                    if (command == "backgroundColor"){
                        let hexBg = chalk.bgHex(command2);
                        console.log(defClr("Background color changed to " + whiClr(hexBg(command2))));
                    } else {
                        console.log(defClr("Manual", sucClr(command), "sent!"));
                    }
                    sendManual(socket, rl, terminalStart);
                } else {
                    console.log(wrnClr("Command input", errClr("invalid.")));
                    sendManual(socket, rl, terminalStart);
                }
            });
        } else {
            console.log(wrnClr("Command input", errClr("invalid.")));
            sendManual(socket, rl, terminalStart);
        }
    });
}