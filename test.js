import readline from "readline";
import { Readable } from "stream";

const inStream = new Readable({
  read() { console.log('in reading'); }
});

let i = 0
setInterval(() => { inStream.push(`${i++}`) }, 1000)
readline.emitKeypressEvents(inStream);

inStream.on('keypress', (...ar) => {
  console.log(ar)
});