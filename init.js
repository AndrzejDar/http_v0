// process.stdout.write("I hope I get the job!");

const fs = require("fs");

const filePath = "./message.txt";

const stream = fs.createReadStream(filePath, { highWaterMark: 8 });

let line = "";

let remainder = Buffer.alloc(0);

stream.on("data", (chunk) => {
  remainder = Buffer.concat([remainder, chunk]);

  let newLineIndex;

  while ((newLineIndex = remainder.indexOf("\n")) !== -1) {
    const lineBuffer = remainder.slice(0, newLineIndex);
    process.stdout.write(lineBuffer.toString("utf8") + "\n");
    remainder = remainder.slice(newLineIndex + 1);
  }
});

stream.on("error", (err) => {
  console.error(err);
  return;
});

stream.on("end", () => {
  if (remainder.length > 0) process.stdout.write(remainder.toString("utf8") + "\n");
  return;
});
