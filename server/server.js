const express = require('express');
const path = require('path');

const publicPath = path.join(process.cwd(),'../public');

var app = express();

app.use(express.static(publicPath));

app.listen(3000, ()=>{
   console.log('Server listening on port 3000');
});