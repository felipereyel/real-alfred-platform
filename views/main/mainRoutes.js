const { refreshSeriesInfo } = require("../../sourceAPIFunctions");
const { getJSONDataBase, updateJSONDataBase } = require("../../databaseFunctions");

const express = require("express");
const router = express.Router();

router.get('/full/:s?', async (req, res, next) => {
    const codename = req.params.s;

    let seriesInfo = await getJSONDataBase();

    let refreshedSeriesInfo = await refreshSeriesInfo(seriesInfo, codename);

    res.render("main/main.html", { seriesInfo: refreshedSeriesInfo, urlListKey: "latestsURLs" });

    await updateJSONDataBase(seriesInfo, refreshedSeriesInfo);

    console.log(`GET/full/${codename || ""}`);
});

router.get('/refresh/:s?', async (req, res, next) => {
    const codename = req.params.s;

    let seriesInfo = await getJSONDataBase();

    let refreshedSeriesInfo = await refreshSeriesInfo(seriesInfo, codename);

    res.render("main/main.html", { seriesInfo: refreshedSeriesInfo, urlListKey: "newURLs" });

    await updateJSONDataBase(seriesInfo, refreshedSeriesInfo);

    console.log(`GET/refresh/${codename || ""}`);
});

router.get('/recent/:s?', async (req, res, next) => {
    const codename = req.params.s;

    let seriesInfo = await getJSONDataBase();

    let filteredSeriesInfo = seriesInfo.filter(serieInfo =>  !codename || serieInfo.codename === codename);

    res.render("main/main.html", { seriesInfo: filteredSeriesInfo, urlListKey: "newURLs" });

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
                        <a href="/views/link">
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
