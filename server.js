meno //Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
// app.use(express.static(__dirname + '/dist/<name-of-app>'));
// app.use(express.static(__dirname + '/dist/surcreditosapp'));

/* app.get('/*', function(req, res) {
    // res.sendFile(path.join(__dirname + '/dist/index.html'));
    res.sendFile(path.join(__dirname + '/dist/surcreditosapp/index.html'));
}); */

// Create link to Angular build directory
var distDir = __dirname + "/dist/surcreditosapp";
app.use(express.static(distDir));

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);