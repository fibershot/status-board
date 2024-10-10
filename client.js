// Modules
import { io } from "socket.io-client";
import { terminalStart } from "./js/terminal.js";
import { loading } from "./js/terminalUtilities.js";
import { sucClr, wrnClr, errClr, defClr, graClr, whiClr } from "./js/chalks.js";

const port_ = process.argv[2] || 1337;                      // Set up port for client
const socket = io("http://localhost:" + port_);             // Define socket address

// Check if the server is reponding. If not, help the user understand what might be the issue
const serverTimeout = setTimeout(function () {console.log(errClr("Cannot connect to the server."), wrnClr("Server running? Wrong address / port?")); process.exit(1);}, 5000);

// Connection
socket.on("connect", () => {
    console.log("Connecting to server...");
    loading;                                                // When anything is loading add a loading animation
    clearTimeout(serverTimeout);                            // Stop setTimeout timer
    socket.emit("fetchText", "x");                          // Fetch current text in for client website
    setTimeout(function(){terminalStart(socket)}, 1500);    // Starting terminal

    socket.on("disconnect", () => {
        console.clear();
        console.log("Client timed out, reconnecting.");     // Inform about a disconnection
    })
});