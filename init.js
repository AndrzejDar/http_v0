// process.stdout.write("I hope I get the job!");

const fs = require("fs");

const filePath = "./message.txt";
// const data = fs.readFile("./message.txt", "utf8", (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
// });
// console.log(data);
// process.stdout.write(data);

const stream = fs.createReadStream(filePath, { highWaterMark: 8 });

let line = "";

stream.on("data", (chunk) => {
  if (chunk.includes("\n")) {
    const parts = chunk.toString("utf8").split("\n");
    line += parts[0];
    process.stdout.write(line + "\n");
    line = parts[1];
  } else {
    line += chunk;
  }
});

stream.on("error", (err) => {
  console.error(err);
  return;
});

stream.on("end", () => {
  process.stdout.write(line + "\n");
  return;
});
