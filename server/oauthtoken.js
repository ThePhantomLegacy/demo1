'use strict';

// Web framework
var express = require('express');
var router = express.Router();

// Forge NPM
var forgeSDK = require('forge-apis');

// Actually perform the token operation
var oauth = require('./oauth');