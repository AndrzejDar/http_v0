# HTTP v0

An HTTP/1.1 server-side parser implementation from scratch in TypeScript — no
framework, no Express, no Node `http` module. Just `net.Server` (raw TCP socket)
and a hand-rolled line-by-line reader.

Built to understand the HTTP wire format end to end: the request line, header
folding, content-length handling, and where the protocol meets the byte stream.

## What's here

- `init.ts` / `init.js` — server entry. Opens a TCP listener on port 42069
  (`net.createServer`), accepts a client, and pipes the socket through an
  async `getLinesFromStream` generator that yields newline-delimited lines from
  arbitrarily chunked TCP data.
- `message.txt` — sample raw HTTP request bytes used during testing.

## Running

```bash
node init.js
# or directly from source:
npx tsx init.ts
```

Then in another terminal:

```bash
curl -v http://localhost:42069/
# or pipe a raw request:
nc 127.0.0.1 42069 < message.txt
```

## Scope

Not a production HTTP server. Not safe to expose. The point was learning the
protocol by implementing the parser manually from byte-level input.
