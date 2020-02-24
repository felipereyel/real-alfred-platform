const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.use(require('./main/mainRoutes'));
app.use(require('./link/linkRoutes'));
app.use(require('./admin/managementRoutes'));
app.use('/dev', require('./dev/mainRoutes'));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});