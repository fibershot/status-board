// Modules
import { io } from "socket.io-client";
import { terminalStart } from "./js/terminal.js";

const socket = io("http://localhost:1337");

// Connect to the server
socket.on("connect", () => {
    console.log("Connected to the server!");
    // Starting terminal
    terminalStart(socket);
});