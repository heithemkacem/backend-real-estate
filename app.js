'use strict';
var express = require ('express');
const cors = require('cors');
var apiRouter = require('./apiRouter').router;
var bodyParser = require('body-parser');
const env =require('./env.js');

const PORT = env.env["PORT"];
const HOST = env.env["HOST"];

const server = express();
server.use(cors());
server.use((req ,res ,next)=>{res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); next()});
server.use(bodyParser.json());
server.use('/api', apiRouter);
server.use('/uploads', express.static('uploads'));
server.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);