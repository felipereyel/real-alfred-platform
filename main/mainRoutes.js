const { refreshSeriesInfo } = require("../processFunctions");
const { getJSONDataBase, updateJSONDataBase } = require("../databaseFunctions");

const express = require("express");
const router = express.Router();

router.get('/full/:s?', async (req, res, next) => {
    const codename = req.params.s;

    let seriesInfo = await getJSONDataBase();
    let refreshedSeriesInfo = await refreshSeriesInfo(seriesInfo, codename);

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

    refreshedSeriesInfo.map(serieInfo => {
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
    });

    res.write('</body></html>');
    res.end();

    await updateJSONDataBase(seriesInfo, refreshedSeriesInfo);
    console.log(`GET/full/${codename || ""}`);
});

router.get('/refresh/:s?', async (req, res, next) => {
    const codename = req.params.s;

    let seriesInfo = await getJSONDataBase();
    let refreshedSeriesInfo = await refreshSeriesInfo(seriesInfo, codename);

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

    refreshedSeriesInfo.map(serieInfo => {
        res.write(`
                <h2>
                    ${serieInfo.tittle}
                </h2>
        `);
        if(Array.isArray(serieInfo.newURLs) && serieInfo.newURLs.length){
            serieInfo.newURLs.map(url => {
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
    });

    res.write(`
                </body>
            </html>
    `);
    res.end();

    await updateJSONDataBase(seriesInfo, refreshedSeriesInfo);
    console.log(`GET/refresh/${codename || ""}`);
});

router.get('/recent/:s?', async (req, res, next) => {
    const codename = req.params.s;

    let seriesInfo = await getJSONDataBase();
    let filteredSeriesInfo = seriesInfo.filter(serieInfo =>  !codename || serieInfo.codename === codename);

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

    filteredSeriesInfo.map(serieInfo => {
        res.write(`
                <h2>
                    ${serieInfo.tittle}
                </h2>
        `);
        if(Array.isArray(serieInfo.newURLs) && serieInfo.newURLs.length){
            serieInfo.newURLs.map(url => {
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
    });

    res.write(`
                </body>
            </html>
    `);
    res.end();

    console.log(`GET/recent/${codename || ""}`);
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
                        Fetch new episodes
                    </h2>
                    <p>
                        <a href="/refresh">
                            /refresh
                        </a>
                    </p>
                    <h2>
                        Fetch recent episodes
                    </h2>
                    <p>
                        <a href="/recent">
                            /recent
                        </a>
                    </p>
                    <h2>
                        Fetch full list of episodes
                    </h2>
                    <p>
                        <a href="/full">
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
                </body>
            </html>
    `);
    res.end();
    console.log('GET/');
});

module.exports = router;
