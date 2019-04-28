var express        =        require("express");
var app            =        express();

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

app.get('/reyel', async (req, res, next) => {
    res.write('<a href="https://psarips.net/tv-show/cloak-dagger/">cloak and dagger</a>');
    res.end();
    console.log('GET/ : algum servico maluco');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
