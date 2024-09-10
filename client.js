// Modules
const io = require("socket.io-client");
const readline = require("readline");
const { send } = require("process");

const socket = io("http://localhost:1337");

// Connect to the server
socket.on("connect", () => {
    console.log("Connected to the server!");

    // Use nodejs readline
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Starting terminal
    function terminalStart() {
        rl.question("preset [p] | manual [m] | exit [e]): ", (command) => {
            if (command == "preset" || command == "p"){
                sendPreset();
            } else if (command == "manual" || command == "m"){
                sendManual();
            } else if (command == "exit" || command == "e"){
                console.log("Shutting down...");
                process.exit(1);
            } else {
                console.log("Command input invalid.");
                terminalStart();
            }
        });
    }

    // Function to send preset commands
    function sendPreset() {
        // Ask for input
        rl.question("back [b] | preset: ", (command) => {
            // Check input contents
            if (command == "b" || command == "back"){
                terminalStart();
            }
            else if (command) {
                socket.emit("preset", command);
                console.log("Preset", command, "sent!");
            }
            sendPreset(); // Start the function, again.
        });
    }

    // Function to send manual commands
    function sendManual(){
        rl.question("back [b] | manual command: ", (command) => {
            if (command == "back" || command == "b"){
                terminalStart();
            } else if (command) {
                var manualQuery = command + "'s value: ";
                rl.question(manualQuery, (command2) => {
                    if (command2) {
                        socket.emit(command, command2);
                        console.log("Manual", command, "sent!");
                        sendManual();
                    }
                });
            }
        });
    }

    terminalStart();
});

// Log any received messages from the server
socket.on("message", (msg) => {
    console.log(`Message from server: ${msg}`);
});
  
// Handle errors
socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
});