const axios     =   require('axios');

const EztvApi   =   require('eztv-api-pt');

const OpenSubs = require('opensubtitles-api');

const express   =   require("express");
const app       =   express();
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

const dbURL = 'https://api.jsonbin.io/b/5d3915b88ba2253fc3a2ccb4';
const dbsecretKey = '$2a$10$x6s7qqp.6PqaM5uyQoyIRu23f3awCM5freqJFM7Pfqdn3s5FgX7sa';
const secret = 'tchakavrau';

const officialEndpoints = [
    'https://eztv.io/',
    'https://eztv.tf/',
    'https://eztv.re/',
    'https://eztv.ch/',
    'https://eztv.yt/',
    'https://eztv.ag/',
    'https://eztv.it/'
]

const alternateEndpoints = [
    'https://eztv.unblocked.win/',
    'https://eztv.fux0r.top/',
    'https://unblocktorrent.com/eztv-proxy-unblock/',
    'https://eztv1.unblocked.lol/',
    'https://eztv1.unblocked.is/',
    'https://eztv.unblocker.cc/',
    'http://eztvproxy.com/'
]

function getEztvObject(endpoints = officialEndpoints){//achou quem ta funfando?
    // try endpoints until find some to use
    return Promise.all(
        endpoints.map(endpoint => {
            return new EztvApi({
                baseUrl : endpoint
            }).getTorrents({
                page:1,limit:10
            }).then(
                res => true
            ).catch(
                err => false
            );
        })
    ).then(bools => {
        for (let i = 0; i < bools.length; i++) {
            if (bools[i] === true ) {
                return i;
            }
        }
        return -1;
    }).then(
        index => {
            return new EztvApi({
            baseUrl : endpoints[index]
        });
    });
};

function getOpenSubsObject(){
    const opensubs = new OpenSubs('ALFREDreyel');
    return opensubs.api.LogIn('ALFREDreyel', 'qwaP3P6c7XrEKaS', 'en', 'ALFREDreyel').then(
        res => opensubs
    );
};

function getAPIsObjects(){
    return Promise.all([
        getEztvObject(),
        getOpenSubsObject()
    ]);
};

async function getJSONDataBase(url = dbURL, secretKey = dbsecretKey){//double triple piroca
    return axios({
        method: 'get',
        url: url+'/latest',
        headers: {
            'secret-key': secretKey
        }
    }).then(res => {
        return res.data;
    });
};

async function putJSONDataBase(jsonfile, url = dbURL, secretKey = dbsecretKey){//nao testada - zuera foi sim
    return axios({
        method: 'put',
        url: url,
        headers: {
            'Content-type': 'application/json',
            'versioning': false,
            'secret-key': secretKey
        },
        data: jsonfile
    }).then(res => {
        return res.data;
    });
};

function getTorrFromEZTVAPI(imdbID, eztv){//melhor que essa so duas essa
    return eztv.getTorrents({
        page: 1,
        limit: 100, // 10 - 100
        imdb: imdbID
    }).then(
        res => res.torrents
    ).then( torrents => {
        return torrents.map(torr => {
            // const {id, hash, filename, episode_url, torrent_url, magnet_url, title, imdb_id, season, episode, small_screenshot, large_screenshot, seeds, peers, date_released_unix, size_bytes} = torr;
            const {filename, torrent_url, title, season, episode} = torr;
            return {filename, torrent_url, title, season, episode};
        });
    }).catch(
        err => console.error(err)
    );
};

function getSubFromOpenSubsAPI(subsParams, opensubs){//melhor que essa so duas essa
    return opensubs.search(subsParams).then( res => {
        // const {url, langcode, downloads, lang, encoding, id, filename, date, score, fps, format, utf8, vtt} = res.en;
        let {url} = res.en;
        return url;
    }).catch(
        err => console.error(err)
    );
};

function filterQualitySourceCodec(torrs, quality, source, onlyHEVC){//DONE - UNTESTED
    
    //filtro de codec
    let torrsFilteredByCodec = torrs.filter((torr) => {
        if(torr.title.search('265') != -1){
            return true;
        }
    });
    if((torrsFilteredByCodec.length == 0) && (onlyHEVC == false)){
        //nao tem a source desejada entao usa todas
        torrsFilteredByCodec = torrs;
    }
    
    //filtro de Qualidade
    let torrsFilteredByCodecByQuality = torrsFilteredByCodec.filter((torr) => {
        if(torr.title.search(quality) != -1){
            return true;
        }
    });
    if(torrsFilteredByCodecByQuality.length == 0){
        //nao tem a qualidade desejada, entao usa todas
        torrsFilteredByCodecByQuality = torrsFilteredByCodec;
    }

    //filtro de source
    let torrsFilteredByCodecByQualityBySource = torrsFilteredByCodecByQuality.filter((torr) => {
        if(torr.title.search(source) != -1){
            return true;
        }
    });
    if(torrsFilteredByCodecByQualityBySource.length == 0){
        //nao tem a source desejada entao usa todas
        torrsFilteredByCodecByQualityBySource = torrsFilteredByCodecByQuality;
    }

    //retorna o primeiro elemento da lista
    return torrsFilteredByCodecByQualityBySource[0];
};

function filterTorrsToDownload(torrs, notDownloaded, season){//le TOPERson
    let availableTorrToDownload = {};

    notDownloaded.map((epNotDownloaded) => {
        availableTorrToDownload[epNotDownloaded] = torrs.filter((torr) => {
            if((torr.episode == String(epNotDownloaded)) && (torr.season == String(season))){
                return true;
            }
        });
    });

    return availableTorrToDownload;
};

function promiseRefreshSeriesInfo(seriesInfo, eztv){//master of pirocas
    return seriesInfo.map(serieInfo => {
        let {imdbID, season, notDownloaded, quality, source, onlyHEVC, latestsEp, newURLs, ...rest} = serieInfo;

        newURLs = [];

        return getTorrFromEZTVAPI(imdbID, eztv).then(availableTorr => {

            availableTorrToDownload =  filterTorrsToDownload(availableTorr, notDownloaded, season);
            for(let ep in availableTorrToDownload){
                if(!(Array.isArray(availableTorrToDownload[ep]) && availableTorrToDownload[ep].length)){
                    continue; //se nao tem link do episodio
                }
                notDownloaded = notDownloaded.filter((epNotDownloaded) => {return epNotDownloaded != ep;});

                let newEp = filterQualitySourceCodec(availableTorrToDownload[ep], quality, source, onlyHEVC);

                if(typeof(newEp) !== 'undefined'){
                    let pos = latestsEp.push(newEp);
                    newURLs.push(pos - 1);
                }  
            }

            return {imdbID, season, notDownloaded, quality, source, onlyHEVC, latestsEp, newURLs, ...rest};
        });
    }); 
};

function promiseRefreshSeriesSubs(incompleteSeriesInfo, opensubs){//master of pirocas
    return incompleteSeriesInfo.map(serieInfo => {
        let {imdbID, latestsEp, ...rest} = serieInfo;

        return Promise.all(latestsEp.map(ep => {

            let {sub, filename, season, episode, ...other} = ep;

            if(typeof sub === 'undefined'){

                const subsParams = {
                    sublanguageid: 'eng',      // Can be an array.join, 'all', or be omitted.
                    limit: 'best',             // Can be 'best', 'all' or an arbitrary nb. Defaults to 'best'
                    filename: filename,        // The video file name. Better if extension is included.
                    season: season,
                    episode: episode,
                    imdbid: imdbID
                };

                return getSubFromOpenSubsAPI(subsParams, opensubs).then(sub => {
                    return {sub, filename, season, episode, ...other};
                });
            }
            else{
                return {sub, filename, season, episode, ...other};
            }
        })).then(latestsEp => {
            return {imdbID, latestsEp, ...rest};
        }); 
    }); 
};

async function refreshSeriesInfoAndSubs(eztv, opensubs){//pirocoptero
    return getJSONDataBase().then(seriesInfo => {
        return Promise.all(promiseRefreshSeriesInfo(seriesInfo, eztv)).then(incompleteSeriesInfo => {
            return Promise.all(promiseRefreshSeriesSubs(incompleteSeriesInfo, opensubs));
        });
    }).then(async newSeriesInfo => {
        await putJSONDataBase(newSeriesInfo);
        return newSeriesInfo
    });
};

{
    // async function run(endPoint){
    //     yes = await refreshSeriesInfoAndSubs(endPoint);
    //     console.log(yes);
    // };

    // run(officialEndpoints[0]);
}

app.get('/all', async (req, res, next) => {
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

app.get('/new', async (req, res, next) => {
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

app.get('/esp', async (req, res, next) => {
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

app.get('/db', async (req, res, next) => {
    const seriesInfo = await getJSONDataBase();
    res.json(seriesInfo);
    console.log(`GET/db`);
});

app.get('/', async (req, res, next) => {
    res.write(`<!DOCTYPE html><html><head><title>Helper</title></head><body><h1>SO VAZA</h1><p>Propriedade privada.</p></body></html>`);
    res.end();
    console.log('GET/');
});

app.get('/reyel', async (req, res, next) => {
    res.write('<a href="tor.reyel.dev">series helper</a>');
    res.end();
    console.log('GET/reyel');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});