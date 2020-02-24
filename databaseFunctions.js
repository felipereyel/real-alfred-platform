const { dbURL, dbsecretKey } = require("./constants");
const axios = require('axios');

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
}

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
}

async function updateJSONDataBase(jsonFile, updateFile, url = dbURL, secretKey = dbsecretKey) {

    let newJsonFile = jsonFile.map( entry => {
        let matchingEntries = updateFile.filter(
            newEntry => entry.codename === newEntry.codename
        );

        if (matchingEntries.length !== 0){
            return matchingEntries[0]
        }
        return entry
    });

    return axios({
        method: 'put',
        url: url,
        headers: {
            'Content-type': 'application/json',
            'versioning': false,
            'secret-key': secretKey
        },
        data: newJsonFile
    }).then(res => {
        return res.data;
    });
}

function buildAndAppendSerieInfo(seriesInfo, pseudoSerieInfo) {
    const { season, numEps, ...otherInfo } = pseudoSerieInfo;
    const notDownloaded = [];

    for (let ep = 1; ep <= Number(numEps); ep++){
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

function addDataBaseEntry(pseudoSerieInfo) {

    return getJSONDataBase().then(seriesInfo => {
        return buildAndAppendSerieInfo(seriesInfo, pseudoSerieInfo);
    }).then(async (newSeriesInfo) => {
        await putJSONDataBase(newSeriesInfo);
        return newSeriesInfo;
    });
}

function removeDatabaseEntry(codename) {

    return getJSONDataBase().then(seriesInfo => {
        return seriesInfo.filter(serieInfo => (serieInfo.codename !== codename));
    }).then(async (newSeriesInfo) => {
        await putJSONDataBase(newSeriesInfo);
        return newSeriesInfo;
    });
}

exports.getJSONDataBase = getJSONDataBase;
exports.putJSONDataBase = putJSONDataBase;
exports.updateJSONDataBase = updateJSONDataBase;
exports.addDataBaseEntry = addDataBaseEntry;
exports.removeDatabaseEntry = removeDatabaseEntry;