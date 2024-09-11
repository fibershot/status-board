import chalk from "chalk";

const sucClr = chalk.hex("#24D18D")
const wrnClr = chalk.hex("#FFA500");
const errClr = chalk.hex("#EE432F");
const defClr = chalk.hex("#3CB5D9");
const graClr = chalk.gray;

export function sendPreset(socket, rl, terminalStart) {
    // Ask for input
    rl.question(defClr("back [b] | preset: "), (command) => {
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

export function sendManual(socket, rl, terminalStart){
    // Ask for input
    rl.question(defClr("back [b] | manual command: "), (command) => {
        // Check input contents
        if (command == "back" || command == "b"){
            terminalStart(socket);
        } else if (command) {
            var manualQuery = command + "'s value: ";
            // Since we are doing a manual input, we need a second input as well
            rl.question(defClr(manualQuery), (command2) => {
                if (command2) {
                    socket.emit(command, command2);
                    console.log(defClr("Manual", sucClr(command), "sent!\n"));
                    sendManual(socket, rl, terminalStart);
                } else {
                    console.log(wrnClr("Command input", errClr("invalid.")));
                    sendManual(socket, rl, terminalStart);
                }
            });
        }
        else {
            console.log(wrnClr("Command input", errClr("invalid.")));
            sendManual(socket, rl, terminalStart);
        }
    });
}