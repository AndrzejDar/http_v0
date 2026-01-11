// import { ReadStream } from "node:fs";

// const fs = require("fs");
import * as fs from "fs";
import * as net from "net";
import * as stream from "stream";
import { Readable } from "stream";

const getLinesFromStream = async function* (stream: stream.Readable): AsyncGenerator<string> {
  let remainder = Buffer.alloc(0);

  for await (const chunk of stream) {
    remainder = Buffer.concat([remainder, chunk]);

    let newLineIndex;
    while ((newLineIndex = remainder.indexOf("\n")) != -1) {
      const lineBuffer = remainder.slice(0, newLineIndex);
      yield lineBuffer.toString("utf8");
      remainder = remainder.slice(newLineIndex + 1);
    }
  }

  if (remainder.length > 0) {
    yield remainder.toString("utf8");
  }
};

const streamFromFile = () => {
  const filePath = "./message.txt";
  const stream = fs.createReadStream(filePath, { highWaterMark: 8 });
  return stream;
};

/**
 * Creates a TCP server that waits for a single client connection.
 * Once a client connects, it returns its socket as an async iterable.
 *
 * @returns {Promise<Readable>} A promise that resolves with a Readable stream
 *                               representing the client socket's data.
 */

const streamFromTCP = (): Promise<Readable> => {
  return new Promise((resolve) => {
    const PORT = 42069;
    const HOST = "127.0.0.1";

    console.log("running");

    const server = net.createServer((socket) => {
      console.log("Client connected. Data stream is now available.");

      socket.on("end", () => {
        console.log("Client disconnected.");
        server.close();
      });

      socket.on("connect", () => {
        console.log("connected");
      });

      resolve(Readable.from(socket));
    });

    server.listen(PORT, HOST, () => {
      console.log(`TCP server listening on ${HOST}:${PORT}. Waiting for a connection...`);
    });

    server.on("error", (err) => {
      console.error("Server error:", err.message);
    });
  });
};

const main = async () => {
  // const stream = streamFromFile();
  const stream = await streamFromTCP();
  console.log("Stream received, starting to read data...");

  const linesIterator = getLinesFromStream(stream);

  for await (const line of linesIterator) {
    console.log(line);
  }
};

main();
