// Starts the express server and serves the static files and routes the API requests
'use strict';

var express = require('express');
var app = express();

// Prepare server routing
app.use('/', express.static(__dirname + '/../www')); // Redirect static calls
app.set('port', process.env.PORT || 3000); // Main port | check to see if we can change to an integer

// cookie-based session
var cookieSession = require('cookie-session');
app.use(
    cookieSession(
    {
        name: 'forgesession',
        keys: ['forgesecurekey'],
        secure: (process.env.NODE_ENV == 'production'),
        maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days, same as refresh token
    })
)

// Prepare our API endpoint routing
loadRoute('./oauthtoken');
// viewmodels sample
loadRoute('./oss');
loadRoute('./modelderivative');
// View hub models sample
loadRoute('./datamanagement');
loadRoute('./user');

function loadRoute(path)
{
    try 
    {
        require.resolve(path);
        var m = require(path);
        app.use('/', m);
    } catch (e) {}
}

module.exports = app;