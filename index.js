// Set up modules
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

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
    var ip_add = socket.handshake.address; var idx = ip_add.lastIndexOf(":");
    if (idx !== -1 && ip_add.lastIndexOf !== -1){
        console.log("Connection from", ip_add.slice(idx + 1));
    } else {
        console.log("Connection from", ip_add);
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
            console.log("Updating text to:", newText);
            io.emit("updateText", newText);
        } else {
            console.error("Cannot update text, because text is", newText);
        }
    });

    // Change text field font size in the HTML file, understands text or int input.
    // socket.emit("textSize", "24")
    socket.on("textSize", (newSize) => {
        if (newSize !== undefined && newSize !== null){
            console.log("Updating font to:", newSize);
            io.emit("updateTextSize", newSize);
        } else {
            console.error("Cannot update size, because size is", newSize);
        }
    });

    // Change background color in the HTML file by using hex values.
    // socket.emit("backgroundColor", ("#FFFFFF"));
    socket.on("backgroundColor", (newHex) => {
        if (newHex !== undefined && newHex !== null){
            console.log("Updating hex to:", newHex);
            io.emit("updateBackgroundColor", newHex);
        } else {
            console.error("Cannot update hex, because hex is", newHex);
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
    console.log("Listening to", port_);
    io.on("error", console.error);
});