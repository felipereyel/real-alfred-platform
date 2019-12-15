const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.use(require('./routes/mainRoutes'));
app.use(require('./routes/linkRoutes'));
app.use(require('./routes/managementRoutes'));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});