// Modules
const io = require("socket.io-client");
const { terminalStart } = require("./js/terminal.js");

const socket = io("http://localhost:1337");

// Connect to the server
socket.on("connect", () => {
    console.log("Connected to the server!");
    // Starting terminal
    terminalStart(socket);
});