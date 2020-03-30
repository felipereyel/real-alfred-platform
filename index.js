const express = require('express');
const cron = require('node-cron');
const path = require('path');

const { autoRefreshSeriesInfo } = require("./sourceAPIFunctions");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

app.use(require('./views/main/mainRoutes'));
app.use(require('./views/link/linkRoutes'));
app.use(require('./views/admin/adminRoutes'));
app.use('/dev', require('./views/dev/mainRoutes'));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

cron.schedule(
    "45 11 * * *",
    async () => await autoRefreshSeriesInfo()
);
