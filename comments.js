//Create web server
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;

//Create server
const server = http.createServer((req, res) => {
    //Get URL and parse it
    const parsedUrl = url.parse(req.url, true);
    //Get path
    const path = parsedUrl.pathname;
    //Trimming path
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get query string as an object
    const queryStringObject = parsedUrl.query;

    //Get HTTP method
    const method = req.method;

    //Get headers as an object
    const headers = req.headers;

    //Get payload if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();

        //Choose handler
        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //Construct data object to send to handler
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };

        //Route request to handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            //Use the status code called back by handler or default to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            //Use payload called back by handler or default to empty object
            payload = typeof (payload) == 'object' ? payload : {};

            //Convert payload to a string
            const payloadString = JSON.stringify(payload);

            //Return response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            //Log the request path
            console.log('Returning this response: ', statusCode, payloadString);
        });
    });
});

//Start server
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

//Define handlers
const handlers = {};

//Ping handler
handlers.ping = (data  , callback) => {
    callback(200);
}