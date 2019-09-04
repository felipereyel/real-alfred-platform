const axios = require('axios');
const fs = require('fs');
const express        =        require("express");
const app            =        express();

const PORT = process.env.PORT || 3000;

const dbURL = 'https://api.jsonbin.io/b/5ce43b79838e9b0c10bcd344';
const dbsecretKey = '$2a$10$x6s7qqp.6PqaM5uyQoyIRu23f3awCM5freqJFM7Pfqdn3s5FgX7sa';
const secret = 'tchakavrau';

app.use(express.static('public'));

function filterQualitySource(names, quality, source){//ta TOPZERA
    //filtro de Qualidade
    let namesFilteredByQuality = names.filter((name) => {
        if(name.search(quality) != -1){
            return true;
        }
    });
    if(namesFilteredByQuality.length == 0){
        //nao tem a qualidade desejada, entao usa todas
        namesFilteredByQuality = names;
    }

    //filtro de source
    let namesFilteredByQualityBySource = namesFilteredByQuality.filter((name) => {
        if(name.search(source) != -1){
            return true;
        }
    });
    if(namesFilteredByQualityBySource.length == 0){
        //nao tem a source desejada entao usa todas
        namesFilteredByQualityBySource = namesFilteredByQuality;
    }

    //retorna o primeiro elemento da lista
    return namesFilteredByQualityBySource[0];
};

function createURL(fileName){//ta PIka daS GalaxiA
    let URL = 'https://get-to.link/' + fileName.replace('.HEVC-PSA', '').replace('.','-').toLowerCase();
    return URL;
};

function getEpNamesFromURL(name, URL){//melhor que essa so duas essa
    return axios.get(URL).then(response => {
        let ss = response.data.split('\n');
        let names = ss.filter((line) => {
            if(line.slice(0, name.length) == name){
                return true;
            }
        }).map((line) => line.split('.HEVC-PSA')[0])
        return names;
    }).catch(error => {
        console.log(errror);
    });
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

function filterNamesToDownload(names, notDowloaded){//le TOPERson
    let namesToDownload = {};

    notDowloaded.map((epNotDownloaded) => {
        namesToDownload[epNotDownloaded] = names.filter((name) => {
            if(name.search(epNotDownloaded) != -1){
                return true;
            }
        });
    });

    return namesToDownload;
};

function promiseRefreshSeriesInfo(seriesInfo){//master of pirocas
    return seriesInfo.map(serieInfo => {
        let {codename, tittle, name, URL, notDownloaded, quality, source, latestsURLs, newURLs} = serieInfo;

        newURLs = [];

        return getEpNamesFromURL(name, URL).then(availableEpisodeNames => {
            availableEpisodeNamesToDownload =  filterNamesToDownload(availableEpisodeNames, notDownloaded);
            for(var ep in availableEpisodeNamesToDownload){
                if(!(Array.isArray(availableEpisodeNamesToDownload[ep]) && availableEpisodeNamesToDownload[ep].length)){
                    continue; //se nao tem link do episodio
                }
                notDownloaded = notDownloaded.filter((epNotDownloaded) => {return epNotDownloaded != ep;});
                latestsURLs.push(createURL(filterQualitySource(availableEpisodeNamesToDownload[ep], quality, source)));
                newURLs.push(createURL(filterQualitySource(availableEpisodeNamesToDownload[ep], quality, source)));
            }

            return {codename, tittle, name, URL, notDownloaded, quality, source, latestsURLs, newURLs};
        });
    }); 
};

async function refreshSeriesInfo(){//pirocoptero
    return getJSONDataBase().then(seriesInfo => {
        return Promise.all(promiseRefreshSeriesInfo(seriesInfo));
    }).then(async newSeriesInfo => {
        await putJSONDataBase(newSeriesInfo);
        return newSeriesInfo
    });
};

async function run(){
    yes = await refreshSeriesInfo();
    console.log(yes);
};

app.get('/all', async (req, res, next) => {
    let seriesInfo = await refreshSeriesInfo();
    res.write(`<!DOCTYPE html><html><head><title>Download Helper</title></head><body><h1>Episodios disponiveis</h1>`);
    seriesInfo.map(serieInfo => {
        if(Array.isArray(serieInfo.latestsURLs) && serieInfo.latestsURLs.length){
            res.write(`<h2>${serieInfo.tittle}</h2>`);
            serieInfo.latestsURLs.map(url => {
                res.write(`<p><a href="${url}">${url}</a></p>`);
            });
        }
    });
    res.write('</body></html>');
    res.end();
    console.log('GET/all');
});

app.get('/new', async (req, res, next) => {
    let seriesInfo = await refreshSeriesInfo();
    res.write(`<!DOCTYPE html><html><head><title>Download Helper</title></head><body><h1>Episodios disponiveis</h1>`);
    seriesInfo.map(serieInfo => {
        if(Array.isArray(serieInfo.newURLs) && serieInfo.newURLs.length){
            res.write(`<h2>${serieInfo.tittle}</h2>`);
            serieInfo.newURLs.map(url => {
                res.write(`<p><a href="${url}">${url}</a></p>`);
            });
        }
    });
    res.write('</body></html>');
    res.end();
    console.log('GET/all');
});

app.get('/esp', async (req, res, next) => {
    const seriesInfo = await refreshSeriesInfo();
    const codename = req.query.s;
    res.write(`<!DOCTYPE html><html><head><title>Download Helper</title></head><body><h1>Episodios disponiveis</h1>`);
    seriesInfo.map(serieInfo => {
        if(serieInfo.codename == codename){
            res.write(`<h2>${serieInfo.tittle}</h2>`);
            if(Array.isArray(serieInfo.latestsURLs) && serieInfo.latestsURLs.length){
                serieInfo.latestsURLs.map(url => {
                    res.write(`<p><a href="${url}">${url}</a></p>`);
                });
            }
            else{
                res.write(`<p>Nao ha episodios diponiveis</p>`);
            }
        }
    });
    res.write('</body></html>');
    res.end();
    console.log(`GET/esp for ${codename}`);
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