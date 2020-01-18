const { officialEndpoints } = require("./constants");

const EztvApi = require('eztv-api-pt');
const OpenSubs = require('opensubtitles-api');

function getEztvObject(endpoints = officialEndpoints) {
    // try endpoints until find some to use
    return Promise.all(endpoints.map(endpoint => {
        return new EztvApi({
            baseUrl: endpoint
        }).getTorrents({
            page: 1, limit: 10
        }).then(res => true).catch(err => false);
    })).then(bools => {
        for (let i = 0; i < bools.length; i++) {
            if (bools[i] === true) {
                return i;
            }
        }
        return -1;
    }).then(index => {
        return new EztvApi({
            baseUrl: endpoints[index]
        });
    });
}

function getOpenSubsObject() {
    const opensubs = new OpenSubs('ALFREDreyel');
    return opensubs.api.LogIn('ALFREDreyel', 'qwaP3P6c7XrEKaS', 'en', 'ALFREDreyel').then(res => opensubs);
}

function getAPIsObjects() {
    return Promise.all([
        getEztvObject(),
        getOpenSubsObject()
    ]);
}

function getTorrFromEZTVAPI(imdbID, eztv) {
    return eztv.getTorrents({
        page: 1,
        limit: 100,
        imdb: imdbID
    }).then(res => res.torrents).then(torrents => {
        return torrents.map(torr => {
            // const {id, hash, filename, episode_url, torrent_url, magnet_url, title, imdb_id, season, episode, small_screenshot, large_screenshot, seeds, peers, date_released_unix, size_bytes} = torr;
            const { filename, torrent_url, title, season, episode } = torr;
            return { filename, torrent_url, title, season, episode };
        });
    }).catch(err => console.error(err));
}

function getSubFromOpenSubsAPI(subsParams, opensubs) {
    return opensubs.search(subsParams).then(res => {
        // const {url, langcode, downloads, lang, encoding, id, filename, date, score, fps, format, utf8, vtt} = res.en;
        let { url } = res.en;
        return url;
    }).catch(err => console.error(err));
}

exports.getAPIsObjects = getAPIsObjects;
exports.getTorrFromEZTVAPI = getTorrFromEZTVAPI;
exports.getSubFromOpenSubsAPI = getSubFromOpenSubsAPI;

