const { app } = require("./index");
const { PORT } = require("./constants");

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
