const EztvApi = require('eztv-api-pt');

const OpenSubs = require('opensubtitles-api');
const opensubs = new OpenSubs('ALFREDreyel');
opensubs.api.LogIn('ALFREDreyel', 'qwaP3P6c7XrEKaS', 'en', 'ALFREDreyel');
 
const officialEndpoints = [
    'crau',
    'nhe',
    'https://eztv.io/',
    'https://eztv.tf/',
    'https://eztv.re/',
    'https://eztv.ch/',
    'https://eztv.yt/',
    'https://eztv.ag/',
    'https://eztv.it/'
]

const subsParams = {
    sublanguageid: 'eng',       // Can be an array.join, 'all', or be omitted.
    filename: 'Marvels.Agents.of.S.H.I.E.L.D.S06E11.720p.WEB.x265-MiNX[eztv].mkv',        // The video file name. Better if extension
                                //   is included.
    season: '2',
    episode: '3',
    limit: 'best',                 // Can be 'best', 'all' or an
                                // arbitrary nb. Defaults to 'best'
    imdbid: '2364582'           // 'tt528809' is fine too.
};

function getEztvObject(endpoints = officialEndpoints){//fazer handshake
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

function getTorrentsFiltered(imdbID){
    return getEztvObject().then(eztv => {
        console.log(eztv);
        return eztv.getTorrents({
            page: 1,
            limit: 10, // 10 - 100
            imdb: imdbID
        }).then(
            res => console.log(res)
        ).catch(
            err => console.error(err)
        );
    });
};

function getSubtitles(opensubs, subsParams){
    return opensubs.search(subsParams);
;}


async function run(opensubs, subsParams){
    console.log(await getSubtitles(opensubs, subsParams));
};

run(opensubs, subsParams);