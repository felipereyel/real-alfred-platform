const { getTorrFromEZTVAPI, getSubFromOpenSubsAPI } = require("./externalAPIs");
const { getJSONDataBase, putJSONDataBase } = require("./databaseFunctions");

function filterQualitySourceCodec(torrs, quality, source, onlyHEVC) {
    //filtro de codec
    let torrsFilteredByCodec = torrs.filter((torr) => {
        if (torr.title.search('265') != -1) {
            return true;
        }
    });
    if ((torrsFilteredByCodec.length == 0) && (onlyHEVC == false)) {
        //nao tem a source desejada entao usa todas
        torrsFilteredByCodec = torrs;
    }
    //filtro de Qualidade
    let torrsFilteredByCodecByQuality = torrsFilteredByCodec.filter((torr) => {
        if (torr.title.search(quality) != -1) {
            return true;
        }
    });
    if (torrsFilteredByCodecByQuality.length == 0) {
        //nao tem a qualidade desejada, entao usa todas
        torrsFilteredByCodecByQuality = torrsFilteredByCodec;
    }
    //filtro de source
    let torrsFilteredByCodecByQualityBySource = torrsFilteredByCodecByQuality.filter((torr) => {
        if (torr.title.search(source) != -1) {
            return true;
        }
    });
    if (torrsFilteredByCodecByQualityBySource.length == 0) {
        //nao tem a source desejada entao usa todas
        torrsFilteredByCodecByQualityBySource = torrsFilteredByCodecByQuality;
    }
    //retorna o primeiro elemento da lista
    return torrsFilteredByCodecByQualityBySource[0];
}

function filterTorrsToDownload(torrs, notDownloaded, season) {
    let availableTorrToDownload = {};
    notDownloaded.map((epNotDownloaded) => {
        availableTorrToDownload[epNotDownloaded] = torrs.filter((torr) => {
            if ((torr.episode == String(epNotDownloaded)) && (torr.season == String(season))) {
                return true;
            }
        });
    });
    return availableTorrToDownload;
}

function promiseRefreshSeriesInfo(seriesInfo, eztv) {
    return seriesInfo.map(serieInfo => {
        let { imdbID, season, notDownloaded, quality, source, onlyHEVC, latestsEp, newURLs, ...rest } = serieInfo;
        newURLs = [];
        return getTorrFromEZTVAPI(imdbID, eztv).then(availableTorr => {
            availableTorrToDownload = filterTorrsToDownload(availableTorr, notDownloaded, season);
            for (let ep in availableTorrToDownload) {
                if (!(Array.isArray(availableTorrToDownload[ep]) && availableTorrToDownload[ep].length)) {
                    continue; //se nao tem link do episodio
                }
                notDownloaded = notDownloaded.filter((epNotDownloaded) => { return epNotDownloaded != ep; });
                let newEp = filterQualitySourceCodec(availableTorrToDownload[ep], quality, source, onlyHEVC);
                if (typeof (newEp) !== 'undefined') {
                    let pos = latestsEp.push(newEp);
                    newURLs.push(pos - 1);
                }
            }
            return { imdbID, season, notDownloaded, quality, source, onlyHEVC, latestsEp, newURLs, ...rest };
        });
    });
}

function promiseRefreshSeriesSubs(incompleteSeriesInfo, opensubs) {
    return incompleteSeriesInfo.map(serieInfo => {
        let { imdbID, latestsEp, ...rest } = serieInfo;
        return Promise.all(latestsEp.map(ep => {
            let { sub, filename, season, episode, ...other } = ep;
            if (typeof sub === 'undefined') {
                const subsParams = {
                    sublanguageid: 'eng',
                    limit: 'best',
                    filename: filename,
                    season: season,
                    episode: episode,
                    imdbid: imdbID
                };
                return getSubFromOpenSubsAPI(subsParams, opensubs).then(sub => {
                    return { sub, filename, season, episode, ...other };
                });
            }
            else {
                return { sub, filename, season, episode, ...other };
            }
        })).then(latestsEp => {
            return { imdbID, latestsEp, ...rest };
        });
    });
}

async function refreshSeriesInfoAndSubs(eztv, opensubs) {
    return getJSONDataBase().then(seriesInfo => {
        return Promise.all(promiseRefreshSeriesInfo(seriesInfo, eztv)).then(incompleteSeriesInfo => {
            return Promise.all(promiseRefreshSeriesSubs(incompleteSeriesInfo, opensubs));
        });
    }).then(async (newSeriesInfo) => {
        await putJSONDataBase(newSeriesInfo);
        return newSeriesInfo;
    });
}

exports.refreshSeriesInfoAndSubs = refreshSeriesInfoAndSubs;

