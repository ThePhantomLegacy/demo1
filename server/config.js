// THis file defines the environment variables and scopes
'use strict';

// Autodesk Forge configuration
module.exports = {
    // Set environment variables or hard-code here
    credentials: 
    {
        client_id: process.env.FORGE_CLIENT_ID,
        client_secret: process.env.FORGE_CLIENT_SECRET,
        callback_url: process.env.FORGE_CALLBACK_URL
    },

    // Required scopes for your application on server-side
    scopeInternal: ['bucket:create', 'bucket:read','bucket:delete', 'data:create', 'data:read', 'data:write'],
    // Required scope of the token sent to the client
    scopePublic: ['viewables:read']
};