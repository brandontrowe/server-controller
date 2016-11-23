# Server controller

Creates a NodeJS proxy server on port 80.

## Usage

Add records to config.json to forward traffic to internal servers:
```
{
  "dev.example.com": "http://localhost:3000",
  "dev2.example.com": "http://localhost:3001"
}
```
Start proxy server with `sudo node proxy.js`.
