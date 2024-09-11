// Set up modules
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const sucClr = chalk.hex("#24D18D")
const wrnClr = chalk.hex("#FFA500");
const errClr = chalk.hex("#EE432F");
const defClr = chalk.hex("#3CB5D9");
const graClr = chalk.gray;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Make filepath public and choose a port for server (default: 1337)
app.use(express.static("public"));
const port_ = 1337;

// Load HTML page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// If a connection occurs:
io.on("connection", (socket) => {
    // Log IP stupid fucking ffff: appears in IP address due to IPv6 or whatever fuck it parse it
    let ip_add = socket.handshake.address;
    let idx = ip_add.lastIndexOf(":");
    if (idx !== -1){
        console.log(defClr("Connection from", sucClr(ip_add.slice(idx + 1))));
    } else {
        console.log(defClr("Connection from", sucClr(ip_add)));
    }

    // Explanation of how changes happen:
    // The server receives an emit() from the client and checks it. After checking the message
    // the server sends the client an approving message to continue, which the client
    // processes in index.html via a script. emit() is a way to EMIT (def: to give off or out)
    // data from client to server and server to client

    // Example:
    // Client sends a socket.emit("change.text", "Hello!") => Server recieves it and sends this back
    // to the client: io.emit("update.text", newText) => After which the client recieves the message
    // and updates the HTML element accordingly to the request.

    // Change text field in the HTML file. If input is undefined to null, ignore.
    // socket.emit("text", ("text"));
    socket.on("text", (newText) => {
        if (newText !== undefined && newText !== null){
            console.log(defClr("Updating text to:", sucClr(newText)));
            io.emit("updateText", newText);
        }
    });

    // Change text field font size in the HTML file, understands text or int input.
    // socket.emit("textSize", "24")
    socket.on("textSize", (newSize) => {
        if (newSize !== undefined && newSize !== null){
            console.log(defClr("Updating font to:", sucClr(newSize)));
            io.emit("updateTextSize", newSize);
        }
    });

    // Change background color in the HTML file by using hex values.
    // socket.emit("backgroundColor", ("#FFFFFF"));
    socket.on("backgroundColor", (newHex) => {
        if (newHex !== undefined && newHex !== null){
            let hexcolor = chalk.hex(newHex);
            console.log(defClr("Updating hex to:"), hexcolor(newHex));
            io.emit("updateBackgroundColor", newHex);
        }
    });

    // Presets make changing many settings easy within one command
    // TODO: Make own script? Preset.js?:D
    // socket.emit("preset", "presetName")
    socket.on("preset", function(preset){
        switch (preset) {
            case "available":
                io.emit("updateBackgroundColor", "#6FC276");
                io.emit("updateText", "Saatavilla");
                break;
            case "meeting":
                io.emit("updateBackgroundColor", "#FFA500");
                io.emit("updateText", "Kokouksessa");
                break;
            case "away":
                io.emit("updateBackgroundColor", "#ADA69C");
                io.emit("updateText", "Poissa");
                break;
            case "closed":
                io.emit("updateBackgroundColor", "#8B0000");
                io.emit("updateText", "Suljettu");
                break;
            case "eating":
                io.emit("updateBackgroundColor", "#203396");
                io.emit("updateText", "Syömässä");
                break;
        }
    });
});

// Listen to the server port
server.listen(port_, () => {
    console.log(defClr("Listening to", sucClr(port_)));
    io.on("error", console.error);
});