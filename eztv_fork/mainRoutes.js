const { refreshSeriesInfoAndSubs } = require("./processFunctions");
const { getAPIsObjects } = require("./externalAPIs");
const { getJSONDataBase, } = require("./databaseFunctions");

const express = require("express");
const router = express.Router();

router.get('/all', async (req, res, next) => {
    await getAPIsObjects().then(apis => {
        const [eztv, opensubs] = apis;

        refreshSeriesInfoAndSubs(eztv, opensubs).then(seriesInfo => {
            res.write(`<!DOCTYPE html><html><head><title>ALFRED For Real</title></head><body>`);
            res.write(`<h1>All available episodes</h1>`);

            // Notify server to begin download all
            let serverApi = 'https://www.google.com/';
            res.write(`<h2><a href=${serverApi}>Server Download All</a></h2>`);

            seriesInfo.map(serieInfo => {
                if(Array.isArray(serieInfo.latestsEp) && serieInfo.latestsEp.length){

                    res.write(`<h2>\n${serieInfo.title}</h2>`);
                    
                    // Notify server to begin download this series
                    let serverApi = 'https://www.google.com/';
                    res.write(`<p><a href=${serverApi}>Server Download</a></p>`);

                    serieInfo.latestsEp.map(ep => {
                        res.write(`<p>${ep.title} `);
                        res.write(`<a href=${ep.torrent_url}>Local Download</a> `)
                        res.write(`<a href=${ep.sub}>Subtitles</a></p>`);
                    });
                }
            });

            res.write('</body></html>');
            res.end();

            console.log('GET/all');
        });
    });    
});

router.get('/new', async (req, res, next) => {
    await getAPIsObjects().then(apis => {
        const [eztv, opensubs] = apis;

        refreshSeriesInfoAndSubs(eztv, opensubs).then(seriesInfo => {
            res.write(`<!DOCTYPE html><html><head><title>ALFRED For Real</title></head><body>`);
            res.write(`<h1>All available episodes</h1>`);

            // Notify server to begin download all
            let serverApi = 'https://www.google.com/';
            res.write(`<h2><a href=${serverApi}>Server Download All</a></h2>`);

            seriesInfo.map(serieInfo => {
                if(Array.isArray(serieInfo.newURLs) && serieInfo.newURLs.length){

                    res.write(`<h2>\n${serieInfo.title}</h2>`);
                    
                    // Notify server to begin download this series
                    let serverApi = 'https://www.google.com/';
                    res.write(`<p><a href=${serverApi}>Server Download</a></p>`);

                    serieInfo.newURLs.map(index => {
                        res.write(`<p>${serieInfo.latestsEp[index].title} `);
                        res.write(`<a href=${serieInfo.latestsEp[index].torrent_url}>Local Download</a> `);
                        res.write(`<a href=${'https://opensubtitles.org'}>Subtitles</a></p>`);
                    });
                }
            });

            res.write('</body></html>');
            res.end();

            console.log('GET/new');
        });
    });
});

router.get('/esp', async (req, res, next) => {
    await getAPIsObjects().then(apis => {
        const [eztv, opensubs] = apis;

        refreshSeriesInfoAndSubs(eztv, opensubs).then(seriesInfo => {
            res.write(`<!DOCTYPE html><html><head><title>ALFRED For Real</title></head><body>`);
            res.write(`<h1>All available episodes</h1>`);

            seriesInfo.map(serieInfo => {
                if(serieInfo.codename == codename){

                    res.write(`<h2>\n${serieInfo.title}</h2>`);
                    
                    // Notify server to begin download this series
                    let serverApi = 'https://www.google.com/';
                    res.write(`<p><a href=${serverApi}>Server Download</a></p>`);
                    
                    serieInfo.latestsEp.map(ep => {
                        res.write(`<p>${ep.title} `);
                        res.write(`<a href=${ep.torrent_url}>Local Download</a> `)
                        res.write(`<a href=${'https://opensubtitles.org'}>Subtitles</a></p>`);
                    });
                }
            });

            res.write('</body></html>');
            res.end();
            
            console.log('GET/esp');
        });
    });    
});

router.get('/db', async (req, res, next) => {
    const seriesInfo = await getJSONDataBase();
    res.json(seriesInfo);
    console.log(`GET/db`);
});

router.get('/', async (req, res, next) => {
    res.write(`<!DOCTYPE html><html><head><title>Helper</title></head><body><h1>SO VAZA</h1><p>Propriedade privada.</p></body></html>`);
    res.end();
    console.log('GET/');
});

module.exports = router;
