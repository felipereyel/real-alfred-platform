const { urlPrefix, tagToRemove } = require("./constants");

const axios = require('axios');

function filterQualitySource(names, quality, source) {
    //filtro de Qualidade
    let namesFilteredByQuality = names.filter((name) => {
        if (name.search(quality) !== -1) {
            return true;
        }
    });
    if (namesFilteredByQuality.length === 0) {
        //nao tem a qualidade desejada, entao usa todas
        namesFilteredByQuality = names;
    }
    //filtro de source
    let namesFilteredByQualityBySource = namesFilteredByQuality.filter((name) => {
        if (name.search(source) !== -1) {
            return true;
        }
    });
    if (namesFilteredByQualityBySource.length === 0) {
        //nao tem a source desejada entao usa todas
        namesFilteredByQualityBySource = namesFilteredByQuality;
    }
    //retorna o primeiro elemento da lista
    return namesFilteredByQualityBySource[0];
}

function createURL(fileName) {
    return urlPrefix + fileName.replace(tagToRemove, '').replace('.', '-').toLowerCase();
}

function getEpNamesFromURL(name, URL) {
    return axios.get(URL).then(response => {
        let ss = response.data.split('\n');
        return ss.filter((line) => {
            if (line.slice(0, name.length) === name) {
                return true;
            }
        }).map((line) => line.split(tagToRemove)[0]);
    }).catch(error => {
        console.log(error);
    });
}

function filterNamesToDownload(names, notDowloaded) {
    let namesToDownload = {};
    notDowloaded.map((epNotDownloaded) => {
        namesToDownload[epNotDownloaded] = names.filter((name) => {
            if (name.search(epNotDownloaded) !== -1) {
                return true;
            }
        });
    });
    return namesToDownload;
}

function promiseRefreshSeriesInfo(seriesInfo) {
    return seriesInfo.map(serieInfo => {
        let { codename, tittle, name, URL, notDownloaded, quality, source, latestsURLs, newURLs } = serieInfo;
        newURLs = [];
        return getEpNamesFromURL(name, URL).then(availableEpisodeNames => {
            let availableEpisodeNamesToDownload = filterNamesToDownload(availableEpisodeNames, notDownloaded);
            for (let ep in availableEpisodeNamesToDownload) {
                if (!(Array.isArray(availableEpisodeNamesToDownload[ep]) && availableEpisodeNamesToDownload[ep].length)) {
                    continue; //se nao tem link do episodio
                }
                notDownloaded = notDownloaded.filter((epNotDownloaded) => { return epNotDownloaded !== ep; });
                latestsURLs.push(createURL(filterQualitySource(availableEpisodeNamesToDownload[ep], quality, source)));
                newURLs.push(createURL(filterQualitySource(availableEpisodeNamesToDownload[ep], quality, source)));
            }
            return { codename, tittle, name, URL, notDownloaded, quality, source, latestsURLs, newURLs };
        });
    });
}

async function refreshSeriesInfo(seriesInfo, codename = undefined) {
    if(codename) {
        return Promise.all(
            promiseRefreshSeriesInfo(
                seriesInfo.filter(serieInfo => serieInfo.codename === codename)
            )
        )
    }
    else {
        return Promise.all(promiseRefreshSeriesInfo(seriesInfo));
    }
}

exports.createURL = createURL;
exports.refreshSeriesInfo = refreshSeriesInfo;
