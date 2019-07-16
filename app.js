const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));   // x-www-form-urlencoded  with a <form>
app.use(bodyParser.json());                          // application/json

app.use('/feed', feedRoutes);

app.listen(8080);
