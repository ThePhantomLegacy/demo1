// Ensure the server is what we expect
'use strict';

var app = require('./server/server');

// Start server
var server = app.listen(app.get('port'),
    function()
    {
        if(process.env.FORGE_CLIENT_ID == null || process.env.FORGE_CLIENT_SECRET == null)
        {
            console.log('**********\nWARNING: Forge Client ID or Client Secret not defined as environment variables.\n**********');
        }
        console.log('Starting at ' + (new Date()).toString());
        console.log('Server listening on port ' + server.address().port);
    }
);