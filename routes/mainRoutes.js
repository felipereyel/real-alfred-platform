const { refreshSeriesInfo, getJSONDataBase } = require("../processFunctions");

const express = require("express");
const router = express.Router();

router.get('/all', async (req, res, next) => {
    let seriesInfo = await refreshSeriesInfo();
    res.write(`
        <!DOCTYPE html>
            <html>
                <head>
                    <title>
                        A.L.F.R.E.D.
                    </title>
                </head>
                <body>
                    <h1>
                        Episodios disponiveis
                    </h1>
    `);
    seriesInfo.map(serieInfo => {
        if(Array.isArray(serieInfo.latestsURLs) && serieInfo.latestsURLs.length){
            res.write(`
                    <h2>
                        ${serieInfo.tittle}
                    </h2>
            `);
            serieInfo.latestsURLs.map(url => {
                res.write(`
                    <p><a href="${url}">
                        ${url}
                    </a></p>
                `);
            });
        }
    });
    res.write(`
                </body>
            </html>
    `);
    res.end();
    console.log('GET/all');
});

router.get('/refresh', async (req, res, next) => {
    let seriesInfo = await refreshSeriesInfo();
    res.write(`
        <!DOCTYPE html>
            <html>
                <head>
                    <title>
                        A.L.F.R.E.D.
                    </title>
                </head>
                <body>
                    <h1>
                        Episodios disponiveis
                    </h1>
    `);
    seriesInfo.map(serieInfo => {
        if(Array.isArray(serieInfo.newURLs) && serieInfo.newURLs.length){
            res.write(`
                    <h2>
                        ${serieInfo.tittle}
                    </h2>
            `);
            serieInfo.newURLs.map(url => {
                res.write(`
                    <p><a href="${url}">
                        ${url}
                    </a></p>
                `);
            });
        }
    });
    res.write(`
                </body>
            </html>
    `);
    res.end();
    console.log('GET/refresh');
});

router.get('/recent', async (req, res, next) => {
    let seriesInfo = await getJSONDataBase();
    res.write(`
        <!DOCTYPE html>
            <html>
                <head>
                    <title>
                        A.L.F.R.E.D.
                    </title>
                </head>
                <body>
                    <h1>
                        Episodios disponiveis
                    </h1>
    `);
    seriesInfo.map(serieInfo => {
        if(Array.isArray(serieInfo.newURLs) && serieInfo.newURLs.length){
            res.write(`
                    <h2>
                        ${serieInfo.tittle}
                    </h2>
            `);
            serieInfo.newURLs.map(url => {
                res.write(`
                    <p><a href="${url}">
                        ${url}
                    </a></p>
                `);
            });
        }
    });
    res.write(`
                </body>
            </html>
    `);
    res.end();
    console.log('GET/recent');
});

router.get('/esp', async (req, res, next) => {
    const seriesInfo = await refreshSeriesInfo();
    const codename = req.query.s;
    res.write(`
        <!DOCTYPE html>
            <html>
                <head>
                    <title>
                        A.L.F.R.E.D.
                    </title>
                </head>
                <body>
                    <h1>
                        Episodios disponiveis
                    </h1>
    `);
    seriesInfo.map(serieInfo => {
        if(serieInfo.codename == codename){
            res.write(`
                    <h2>
                        ${serieInfo.tittle}
                    </h2>
            `);
            if(Array.isArray(serieInfo.latestsURLs) && serieInfo.latestsURLs.length){
                serieInfo.latestsURLs.map(url => {
                    res.write(`
                    <p><a href="${url}">
                        ${url}
                    </a></p>
                    `);
                });
            }
            else{
                res.write(`
                    <p>
                        Nao ha episodios diponiveis
                    </p>
                `);
            }
        }
    });
    res.write('</body></html>');
    res.end();
    console.log(`GET/esp for ${codename}`);
});

router.get('/', async (req, res, next) => {
    res.write(`
        <!DOCTYPE html>
            <html>
                <head>
                    <title>
                        A.L.F.R.E.D.
                    </title>
                </head>
                <body>
                    <h1>
                        A.L.F.R.E.D.
                    </h1>
                    <p>
                        Artificialy Legal and Fun
                        Robot for Easy Downloads
                    </p>
                    <h2>
                        New episodes
                    </h2>
                    <p>
                        <a href="/refresh">
                            /refresh
                        </a>
                    </p>
                    <h2>
                        Recent episodes
                    </h2>
                    <p>
                        <a href="/recent">
                            /recent
                        </a>
                    </p>
                    <h2>
                        All episodes
                    </h2>
                    <p>
                        <a href="/all">
                            /all
                        </a>
                    </p>
                    <h2>
                        Convert link
                    </h2>
                    <p>
                        <a href="/link">
                            /link
                        </a>
                    </p>
                    <h2>
                        Contact
                    </h2>
                    <p>
                        contato@reyel.dev
                    </p>
                </body>
            </html>
    `);
    res.end();
    console.log('GET/');
});

module.exports = router;