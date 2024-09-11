// Modules
import { io } from "socket.io-client";
import { terminalStart } from "./js/terminal.js";
import chalk from "chalk";

const sucClr = chalk.hex("#24D18D")
const wrnClr = chalk.hex("#FFA500");
const errClr = chalk.hex("#EE432F");
const defClr = chalk.hex("#3CB5D9");
const graClr = chalk.gray;

const socket = io("http://localhost:1337");

// Connect to the server
socket.on("connect", () => {
    console.log("Connected to the server!");
    // Starting terminal
    terminalStart(socket);
});