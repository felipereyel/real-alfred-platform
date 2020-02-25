const { createURL } = require("../../sourceAPIFunctions");

const express = require("express");
const router = express.Router();

router.get('/link', async (req, res, next) => {
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
                        Converter nome do arquivo em link
                    </h1>
                    <form method="POST" action="/linkresult">
                        Filename: <input type="text" name="filename" />
                        <input type="submit" />
                    </form>
                    <p>
                        (Ex: Banana.HDTV.2CH.x265.HEVC-PSA)
                    </p>
                </body>
            </html>
    `);
    res.end();
    console.log(`GET/link`);
});

router.post('/linkresult', async (req, res, next) => {
    const filename = req.body.filename;
    const filelink = createURL(filename);

    res.write(`
    <!DOCTYPE html>
        <html>
            <head>
                <title>
                    A.L.F.R.E.D.
                </title>
            </head>
            <body>
                <h2>
                    Link do arquivo
                </h2>
                <p>
                    Arquivo: ${filename}
                </p>
                <p>
                    Link: 
                    <a href="${filelink}">
                        ${filelink}
                    </a>
                </p>
            </body>
        </html>
    `);
    res.end();
    console.log(`POST/result for ${filename}`)
});

module.exports = router;