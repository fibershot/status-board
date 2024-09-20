process.title = "status-board - client";

// Modules
import { io } from "socket.io-client";
import { terminalStart } from "./js/terminal.js";
import { sucClr, wrnClr, errClr, defClr, graClr, whiClr } from "./js/chalks.js";

// Set up port for client
const port_ = process.argv[2] || 1337;
const socket = io("http://localhost:" + port_);

// Check if the server is reponding. If not, help the user understand what might be the issue
const serverTimeout = setTimeout(function () {console.log(errClr("Cannot connect to the server."), wrnClr("Server running? Wrong address / port?")); process.exit(1);}, 5000);

// Connect to the server
socket.on("connect", () => {
    console.log("Connected to the server!\n");
    clearTimeout(serverTimeout);
    // Fetch current text in for client website
    socket.emit("fetchText", "x");
    // Starting terminal
    terminalStart(socket);
});