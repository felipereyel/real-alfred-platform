const { createURL } = require("../processFunctions");

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
                    <form method="POST" action="/linkresult">
                        <input type="text" name="filename" />
                        <input type="submit" />
                    </form>
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
                <p>${filename}</p>
                <p><a href="${filelink}">${filelink}</a></p>
            </body>
        </html>
    `);
    res.end();
    console.log(`POST/result for ${filename}`)
});

module.exports = router;