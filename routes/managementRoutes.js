const { getJSONDataBase } = require("../processFunctions");

const express = require("express");
const router = express.Router();

router.get('/list', async (req, res, next) => {
    const seriesInfo = await getJSONDataBase();
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
                        Series cadastradas
                    </h1>
    `);

    seriesInfo.map(serieInfo => {
        res.write(`
                    <p>
                        ${serieInfo.tittle} - <a href="/esp?s=${serieInfo.codename}">${serieInfo.codename}</a>
                    </p>
        `);
    });

    res.write(`
                </body>
            </html>
    `);

    res.end();

    console.log(`GET/list`);
});

router.get('/db', async (req, res, next) => {
    const seriesInfo = await getJSONDataBase();
    res.json(seriesInfo);
    console.log(`GET/db`);
});

module.exports = router;