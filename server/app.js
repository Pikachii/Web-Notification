const express = require('express');
const path =  require('path');
const cors = require('cors');
const webpushRouter = require('./routes/api/webpush');
var app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', webpushRouter);

var server = app.listen(3000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});