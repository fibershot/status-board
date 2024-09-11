const readline = require("readline");
const { sendPreset, sendManual } = require("./terminalUtilities.js");

// Use nodejs readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function terminalStart(socket) {
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

module.exports = { terminalStart };