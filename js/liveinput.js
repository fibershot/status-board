import * as readline from "node:readline";
import fs from "fs";

const stopListen = () => process.stdin.removeAllListeners('keypress');

export function liveInput(socket, terminalStart){
    // Enable raw mode to capture individual keypresses
    let exitSequence = false;

    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY){
        process.stdin.setRawMode(true);
    }

    socket.emit("fetchText", "x");
    let text = fs.readFileSync("./txt/current_text.txt", "utf8");

    // Clear console for inputting
    console.clear();
    console.log("Liveinput:\n" + text + "<");

    readInput();
    function readInput() {
        // Listen for keypress events
        // Exit with ESC or Ctrl+C
        process.stdin.on("keypress", (str, key) => {
            if (key.name === "escape") {
                process.exit();
            } else if (key.name === 'backspace') {
                text = text.slice(0, -1);
            } else if (key.name === 'space') {
                text += ' ';
            }  /*else if (key.name === "return") {
                text += "<br>";
            }*/ else if (str && str.length === 1 && !key.ctrl && !key.meta) {
                text += str; 
            }

            console.clear();
            console.log("Liveinput:\n" + text + "<");
            socket.emit("text", text);
        });
    } 
}

/*
            // Update terminal and website
            if (!exitSequence){
                console.clear();
                console.log("Liveinput:\n" + text + "<");
                socket.emit("text", text);
            } else {
                process.kill(process.pid, "SIGINT");
                console.clear();
                terminalStart(socket);
                

                process.on("disconnect", function() {
                    console.clear();
                    terminalStart(socket);
                });
                */