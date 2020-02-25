const { getJSONDataBase, addDataBaseEntry, removeDatabaseEntry } = require("../../databaseFunctions");

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
                        ${serieInfo.tittle} 
                        - <a href="/full/${serieInfo.codename}">${serieInfo.codename}</a>
                        - <a href="/delete/${serieInfo.codename}">x</a>
                    </p>
        `);
    });

    res.write(`
                    <p>
                       <a href="/create"> Create new entry </a>
                    </p>
                </body>
            </html>
    `);

    res.end();

    console.log(`GET/list`);
});

router.get('/create', async (req, res, next) => {
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
                        Adicionar serie na watchlist
                    </h1>
                    <form method="POST" action="/createresult">
                        Codinome (Ex: got): <input type="text" name="codename" /><br>
                        Titulo (Ex: Game Of Thrones): <input type="text" name="tittle" /><br>
                        Gatilho (Ex: Game.of.Thrones.S): <input type="text" name="name" /><br>
                        URL (Ex: https://psarips.eu/tv-show/game-thrones-season-8/): <input type="text" name="URL" /><br>
                        Qualidade (Ex: 720p): <input type="text" name="quality" /><br>
                        Fonte (Ex: WEB): <input type="text" name="source" /><br>
                        Temporada (Ex: S08): <input type="text" name="season" /><br>
                        Numero de episodios (Ex: 6): <input type="text" name="numEps" /><br>
                        <input type="submit"/>
                    </form>
                </body>
            </html>
    `);
    res.end();
    console.log(`GET/create`);
});

router.post('/createresult', async (req, res, next) => {
    await addDataBaseEntry(req.body);
    console.log(`POST/createresult`);
    res.redirect("/list");
});

router.get('/delete/:s', async (req, res, next) => {
    const codename = req.params.s
    await removeDatabaseEntry(codename);
    console.log(`POST/detele/${codename}`);
    res.redirect("/list");
});

router.get('/db', async (req, res, next) => {
    await res.json(await getJSONDataBase());
    console.log(`GET/db`);
});

module.exports = router;