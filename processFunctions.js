const { dbURL, dbsecretKey, urlPrefix, tagToRemove } = require("./constants");

const axios = require('axios');

function filterQualitySource(names, quality, source) {
    //filtro de Qualidade
    let namesFilteredByQuality = names.filter((name) => {
        if (name.search(quality) != -1) {
            return true;
        }
    });
    if (namesFilteredByQuality.length == 0) {
        //nao tem a qualidade desejada, entao usa todas
        namesFilteredByQuality = names;
    }
    //filtro de source
    let namesFilteredByQualityBySource = namesFilteredByQuality.filter((name) => {
        if (name.search(source) != -1) {
            return true;
        }
    });
    if (namesFilteredByQualityBySource.length == 0) {
        //nao tem a source desejada entao usa todas
        namesFilteredByQualityBySource = namesFilteredByQuality;
    }
    //retorna o primeiro elemento da lista
    return namesFilteredByQualityBySource[0];
};

function createURL(fileName) {
    let URL = urlPrefix + fileName.replace(tagToRemove, '').replace('.', '-').toLowerCase();
    return URL;
};

function getEpNamesFromURL(name, URL) {
    return axios.get(URL).then(response => {
        let ss = response.data.split('\n');
        let names = ss.filter((line) => {
            if (line.slice(0, name.length) == name) {
                return true;
            }
        }).map((line) => line.split(tagToRemove)[0]);
        return names;
    }).catch(error => {
        console.log(errror);
    });
};

async function getJSONDataBase(url = dbURL, secretKey = dbsecretKey) {
    return axios({
        method: 'get',
        url: url + '/latest',
        headers: {
            'secret-key': secretKey
        }
    }).then(res => {
        return res.data;
    });
};

async function putJSONDataBase(jsonfile, url = dbURL, secretKey = dbsecretKey) {
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

function filterNamesToDownload(names, notDowloaded) {
    let namesToDownload = {};
    notDowloaded.map((epNotDownloaded) => {
        namesToDownload[epNotDownloaded] = names.filter((name) => {
            if (name.search(epNotDownloaded) != -1) {
                return true;
            }
        });
    });
    return namesToDownload;
};

function promiseRefreshSeriesInfo(seriesInfo) {
    return seriesInfo.map(serieInfo => {
        let { codename, tittle, name, URL, notDownloaded, quality, source, latestsURLs, newURLs } = serieInfo;
        newURLs = [];
        return getEpNamesFromURL(name, URL).then(availableEpisodeNames => {
            availableEpisodeNamesToDownload = filterNamesToDownload(availableEpisodeNames, notDownloaded);
            for (var ep in availableEpisodeNamesToDownload) {
                if (!(Array.isArray(availableEpisodeNamesToDownload[ep]) && availableEpisodeNamesToDownload[ep].length)) {
                    continue; //se nao tem link do episodio
                }
                notDownloaded = notDownloaded.filter((epNotDownloaded) => { return epNotDownloaded != ep; });
                latestsURLs.push(createURL(filterQualitySource(availableEpisodeNamesToDownload[ep], quality, source)));
                newURLs.push(createURL(filterQualitySource(availableEpisodeNamesToDownload[ep], quality, source)));
            }
            return { codename, tittle, name, URL, notDownloaded, quality, source, latestsURLs, newURLs };
        });
    });
};

async function refreshSeriesInfo() {
    return getJSONDataBase().then(seriesInfo => {
        return Promise.all(promiseRefreshSeriesInfo(seriesInfo));
    }).then(async (newSeriesInfo) => {
        await putJSONDataBase(newSeriesInfo);
        return newSeriesInfo;
    });
};

function buildAndAppendSerieInfo(seriesInfo, pseudoSerieInfo) {
    const { season, numEps, ...otherInfo } = pseudoSerieInfo;
    const notDownloaded = [];

    for (ep = 1; ep <= Number(numEps); ep++){
        if (ep >= 10) {
            notDownloaded.push(season + "E" + ep.toString());
        }
        else {
            notDownloaded.push(season + "E0" + ep.toString());
        }
    }

    const serieInfo = { ...otherInfo, notDownloaded, latestsURLs: [], newURLs:[] };

    seriesInfo.push(serieInfo);

    return seriesInfo;
}

function addSerieInfo(pseudoSerieInfo) {
    
    return getJSONDataBase().then(seriesInfo => {
        return buildAndAppendSerieInfo(seriesInfo, pseudoSerieInfo);
    }).then(async (newSeriesInfo) => {
        await putJSONDataBase(newSeriesInfo);
        return newSeriesInfo;
    });
};

function removeSerieInfo(codename) {
    
    return getJSONDataBase().then(seriesInfo => {
        return seriesInfo.filter(serieInfo => (serieInfo.codename != codename));
    }).then(async (newSeriesInfo) => {
        await putJSONDataBase(newSeriesInfo);
        return newSeriesInfo;
    });
};

exports.createURL = createURL;
exports.getJSONDataBase = getJSONDataBase;
exports.refreshSeriesInfo = refreshSeriesInfo;
exports.addSerieInfo = addSerieInfo;
exports.removeSerieInfo = removeSerieInfo;
