// Set up modules
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { sucClr, wrnClr, errClr, defClr, graClr, whiClr } from "./js/chalks.js";
import chalk from "chalk";
import fs from "fs";


// Set up variables
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Pathing variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Other variables
var clientText = "default text";

// Make filepath public and choose a port for server (default: 1337)
app.use(express.static("public"));
const port_ = process.argv[2] || 1337;

// Load HTML page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// If a connection occurs:
io.on("connection", (socket) => {
    // Log ip and parse it
    let ip_add = socket.handshake.address;
    let idx = ip_add.lastIndexOf(":");
    if (idx !== -1){
        console.log(defClr("Connection from", sucClr(ip_add.slice(idx + 1))));
    } else {
        console.log(defClr("Connection from", sucClr(ip_add)));
    }

    // Setup file reading
    let text = fs.readFileSync("./txt/current_text.txt", "utf8");
    io.emit("updateText", text);

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
            case "default":
                io.emit("updateBackgroundColor", "#D8C6C6");
                io.emit("updateText", "default text");
                break;
        }
    });

    // Fetch request
    socket.on("fetchText", (i) => {
        io.emit("fetchText", i);
    });

    // Return
    socket.on("returnText", (text) => {
        clientText = text;
        fs.writeFile("./txt/current_text.txt", text, (err) => {
            if (err) {
                console.error("Failed appending file", err);
            }
        });
    });

    socket.on("disconnect", function() {
        console.log(defClr("Disconnection from", sucClr(ip_add.slice(idx + 1))));
    });
});

// Listen to the server port
server.listen(port_, () => {
    console.log(defClr("Listening to", sucClr(port_)));
    io.on("error", console.error);
});