const axios = require('axios');
const fs = require('fs');
const express        =        require("express");
const app            =        express();

const PORT = process.env.PORT || 3000;
const dbURL = 'https://jsonblob.com/api/jsonBlob/1ec7dfb0-7bd0-11e9-b226-638df6227e29';

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
    let URL = 'https://linx.cloud/' + fileName.replace('.HEVC-PSA', '').replace('.','-').toLowerCase();
    return URL;
};

function getEpNamesFromURL(name, URL){//melhor que essa so duas essa
    return axios.get(URL).then(response => {
        let ss = response.data.split('\n');
        let names = ss.filter((line) => {
            if(line.slice(0, name.length) == name){
                return true;
            }
        })
        return names;
    }).catch(error => {
        console.log(errror);
    });
};

async function getJSONDataBase(fileName = 'series.json', url = dbURL){//double triple piroca
    return JSON.parse(fs.readFileSync(fileName));
};

async function pushJSONDataBase(jsonfile, fileName, url = dbURL){//nao testada
    fs.writeFileSync(fileName, JSON.stringify(jsonfile, null, 2));
    return jsonfile;
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
        let {codename, tittle, name, URL, notDownloaded, quality, source} = serieInfo;

        return getEpNamesFromURL(name, URL).then(availableEpisodeNames => {
            availableEpisodeNamesToDownload =  filterNamesToDownload(availableEpisodeNames, notDownloaded);
            let latestsURLs = [];
            for(var ep in availableEpisodeNamesToDownload){
                if(!(Array.isArray(availableEpisodeNamesToDownload[ep]) && availableEpisodeNamesToDownload[ep].length)){
                    continue; //se nao tem link do episodio
                }
                notDownloaded = notDownloaded.filter((epNotDownloaded) => {return epNotDownloaded != ep;});
                latestsURLs.push(createURL(filterQualitySource(availableEpisodeNamesToDownload[ep], quality, source)));
            }

            return {codename, tittle, name, URL, notDownloaded, quality, source, latestsURLs};
        });
    }); 
};

async function refreshSeriesInfo(fileName = 'series.json'){//pirocoptero
    let seriesInfo = await getJSONDataBase(fileName);
    return pushJSONDataBase(await Promise.all(promiseRefreshSeriesInfo(seriesInfo)), fileName);
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

app.get('/json', async (req, res, next) => {
    const seriesInfo = await getJSONDataBase();
    res.json(seriesInfo);
    console.log(`GET/json`);
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