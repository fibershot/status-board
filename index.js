// Set up modules
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { sucClr, wrnClr, errClr, defClr, graClr, whiClr } from "./js/chalks.js";
import chalk from "chalk";
import jsonfile from "jsonfile";
import fs from "fs";

// Set up variables
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    pingInterval: 600000, // Set the desired ping interval in milliseconds
    pingTimeout: 300000,   // Set the ping timeout in milliseconds
});
// Pathing variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Timestamp for console
function getTimestamp() {
    const now = new Date();
    return `[${now.toLocaleTimeString('en-US', { hour12: false })}]`;
}

// Make filepath public and choose a port for server (default: 1337)
app.use(express.static("public"));
const port_ = process.argv[2] || 1337;

// Load HTML page /public/index.html
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// If a connection occurs:
io.on("connection", (socket) => {
    // Log ip and parse it
    let ip_add = socket.handshake.address;
    let idx = ip_add.lastIndexOf(":");
    if (idx !== -1){
        console.log(defClr(getTimestamp() + " Connection from", sucClr(ip_add.slice(idx + 1))));
    } else {
        console.log(defClr(getTimestamp() + " Connection from", sucClr(ip_add)));
    }

    // Setup file reading
    const file = "./json/webdata.json";
    
    /* About the following socket.on(s) (only index.html uses this request)
    If received text from values is "current", read the .json file and return value
    TODO: If file is empty, resort to something else */
    
    // Change text field in HTML file
    // e.g: socket.emit("text", "Hello world!")
    socket.on("text", (newText) => {
        if (newText == "current"){
            jsonfile.readFile(file)
            .then(data => {
                let text = "";
                text = data.text || "";
                io.emit("updateText", text);
            });
        } else if (newText !== undefined && newText !== null){
            io.emit("updateText", newText);
        }
    });

    // Change text field font size in the HTML file, understands text or int input.
    // e.g: socket.emit("textSize", "24")
    socket.on("textSize", (newSize) => {
        if (newSize == "current"){
            jsonfile.readFile(file)
            .then(data => {
                let size = "";
                size = data.textSize || "";
                io.emit("updateTextSize", size);
            });
        } else if (newSize !== undefined && newSize !== null){
            console.log(defClr(getTimestamp() + " Updating text size to:", sucClr(newSize)));
            io.emit("updateTextSize", newSize);
        }
    });

    // Change background color in the HTML file by using hex values.
    // e.g: socket.emit("backgroundColor", ("#FFFFFF"))
    socket.on("backgroundColor", (newHex) => {
        if (newHex == "current"){
            jsonfile.readFile(file)
            .then(data => {
                let color = "";
                color = data.backgroundColor || "";
                io.emit("updateBackgroundColor", color);
            });
        } else if (newHex !== undefined && newHex !== null){
            let hexcolor = chalk.hex(newHex);
            console.log(defClr(getTimestamp() + " Updating hex to:"), hexcolor(newHex));
            io.emit("updateBackgroundColor", newHex);
        }
    });

    // Change anything at once with a command of your choice
    // socket.emit("preset", "presetName")
    socket.on("preset", function(preset){
        switch (preset) {
            case "available":
                io.emit("updateBackgroundColor", "#B0D47B");
                io.emit("updateText", "Saatavilla");
                break;
            case "meeting":
                io.emit("updateBackgroundColor", "#607D8B");
                io.emit("updateText", "Kokouksessa");
                break;
            case "away":
                io.emit("updateBackgroundColor", "#C0C0C0");
                io.emit("updateText", "Poissa");
                break;
            case "closed":
                io.emit("updateBackgroundColor", "#808080");
                io.emit("updateText", "Suljettu");
                break;
            case "eating":
                io.emit("updateBackgroundColor", "#F5C67F");
                io.emit("updateText", "Lounaalla");
                break;
            case "default":
                io.emit("updateBackgroundColor", "#E0E0E0");
                io.emit("updateText", "default text");
                break;
        }
    });

    /*  Usage:
        socket.emit("fetch", request_)
        text
        textSize
        backgroundColor
    */

    socket.on("fetch", (request_) => {
        io.emit("fetch", request_);
    })

    /* Receive data from fetch and write it into the webdata.json file
    Parse happens with ~prs~ where [0] contains the content and [1]
    contains the fetch request */
    socket.on("returnFetch", (data) => {
        jsonfile.readFile(file)
        .then(existingData => {
            let parse = data.split("~prs~");
            let content = parse[0];
            let contentType = parse[1];

            if (contentType == "fetchText"){
                existingData.text = content;
                console.log("[JSON] fetchText content:", existingData.text);
            } else if (contentType == "textSize"){
                existingData.textSize = content;
                console.log("[JSON] textSize content:", existingData.textSize);
            } else if (contentType == "backgroundColor"){
                existingData.backgroundColor = content;
                console.log("[JSON] backgroundColor content:", existingData.backgroundColor);
            }
            const jsonString = JSON.stringify(existingData, null, 2);
            fs.writeFileSync(file, jsonString);
        }).catch(err => {
            console.error("[JSON] Error:", err);
        });;
    });

    socket.on("disconnect", function() {
        console.log(defClr(getTimestamp() + " Disconnection from", sucClr(ip_add.slice(idx + 1))));
    });
});

// Listen to the server port
server.listen(port_, () => {
    console.log(defClr(getTimestamp() + " Listening to", sucClr(port_)));
    io.on("error", console.error);
});