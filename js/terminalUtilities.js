function sendPreset(socket, rl, terminalStart) {
    // Ask for input
    rl.question("back [b] | preset: ", (command) => {
        // Check input contents
        if (command == "b" || command == "back"){
            terminalStart(socket);
        }
        else if (command) {
            socket.emit("preset", command);
            console.log("Preset", command, "sent!");
            sendPreset(socket, rl, terminalStart);
        }
        else {
            console.log("Command input invalid.");
            sendPreset(socket, rl, terminalStart);
        }
    });
}

function sendManual(socket, rl, terminalStart){
    // Ask for input
    rl.question("back [b] | manual command: ", (command) => {
        // Check input contents
        if (command == "back" || command == "b"){
            terminalStart(socket);
        } else if (command) {
            var manualQuery = command + "'s value: ";
            // Since we are doing a manual input, we need a second input as well
            rl.question(manualQuery, (command2) => {
                if (command2) {
                    socket.emit(command, command2);
                    console.log("Manual", command, "sent!");
                    sendManual(socket, rl, terminalStart);
                } else {
                    console.log("Command input invalid.");
                    sendManual(socket, rl, terminalStart);
                }
            });
        }
        else {
            console.log("Command input invalid.");
            sendManual(socket, rl, terminalStart);
        }
    });
}

module.exports = { sendPreset, sendManual };