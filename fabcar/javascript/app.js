
/* 
	Starts a basic Express server running on port 8080 
*/

const express = require('express');
const app = express();
var bodyParser = require('body-parser');
// Constants
const PORT = 8080;
const HOST = 'localhost';

app.use(bodyParser.json());

require('./routes')(app);

app.listen(PORT, HOST);
console.log(`Server running on http://${HOST}:${PORT}`);
