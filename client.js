// Modules
import { io } from "socket.io-client";
import { terminalStart } from "./js/terminal.js";
import chalk from "chalk";

const sucClr = chalk.hex("#24D18D")
const wrnClr = chalk.hex("#FFA500");
const errClr = chalk.hex("#EE432F");
const defClr = chalk.hex("#3CB5D9");
const graClr = chalk.gray;

const port_ = process.argv[2] || 1337;
const socket = io("http://localhost:" + port_);

// Check if the server is reponding. If not, help the user understand what might be the issue
const timer = setTimeout(function () {console.log(errClr("Cannot connect to the server."), wrnClr("Server running? Wrong address / port?")); process.exit(1);}, 5000);

// Connect to the server
socket.on("connect", () => {
    console.log("Connected to the server!");
    clearTimeout(timer);
    // Starting terminal
    terminalStart(socket);
});

socket.on()

function timeOut(){
    console.log(errClr("No response from server."), wrnClr("Is server on or wrong port?"));
}