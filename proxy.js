'use strict';

const httpProxy = require('http-proxy');
const http = require('http');
const fs = require('fs');

const proxy = httpProxy.createProxy();

// Get registered subdomains and routes
let routes = {};
fs.readFile('./config.json', 'utf8', (err, data) => {
    if (!err) {
        routes = JSON.parse(data);
    } else {
        throw err;
    }
});

http.createServer((req, res) => {
    if (routes && routes[req.headers.host]) {
        proxy.web(req, res, {
            target: routes[req.headers.host]
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        for (let property in routes) {
            res.write('<div><a href="http://' + property + '">' + property +'</a></div>');
        }
        res.end();
    }
}).listen(80, () => {
    console.log('http proxy started')
});

proxy.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
});

proxy.on('error', (error, req, res) => {
    let json;
    console.log('proxy error', error);
    if (!res.headersSent) {
        res.writeHead(500, { 'content-type': 'application/json' });
    }

    json = { error: 'proxy_error', reason: error.message };
    res.end(JSON.stringify(json));
});
