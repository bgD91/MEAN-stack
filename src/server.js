const http = require('http');
const app  = require('../backend/app');

const port = process.env.PORT || 3456;

app.set('port', port);
const server = http.createServer(app);


server.listen(process.env.PORT || 3456);
