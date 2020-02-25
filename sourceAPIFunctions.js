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

function createEpisode(url, id) {
    return {id, url}
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
        namesToDownload[epNotDownloaded.id] = names.filter((name) => {
            if (name.search(epNotDownloaded.id) !== -1) {
                return true;
            }
        });
    });
    return namesToDownload;
}

function promiseRefreshSeriesInfo(seriesInfo) {
    return seriesInfo.map(serieInfo => {
        let { codename, tittle, name, URL, quality, source, notDownloaded, latestsURLs, newURLs } = serieInfo;
        newURLs = [];

        return getEpNamesFromURL(name, URL).then(availableEpisodeNames => {
            let availableEpisodeNamesToDownload = filterNamesToDownload(availableEpisodeNames, notDownloaded);

            for (let ep in availableEpisodeNamesToDownload) {
                //se nao tem link do ep continua
                if (!(Array.isArray(availableEpisodeNamesToDownload[ep]) && availableEpisodeNamesToDownload[ep].length)) {
                    continue;
                }

                // remove o ep.id do notDownloaded
                notDownloaded = notDownloaded.filter(
                    (epNotDownloaded) => { return epNotDownloaded.id !== ep; }
                );

                // cria o url
                let newURL = createURL(
                    filterQualitySource(
                        availableEpisodeNamesToDownload[ep],
                        quality,
                        source
                    )
                );

                // cria o ep
                let newEpisode = createEpisode(newURL, ep);

                // adiciona aos newURLs e latestsURLs
                newURLs.push(newEpisode);
                latestsURLs.push(newEpisode);
            }

            return { codename, tittle, name, URL, quality, source, notDownloaded, latestsURLs, newURLs };
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
exports.createEpisode = createEpisode;
