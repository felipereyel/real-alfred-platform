const axios = require('axios');
const fs = require('fs');

let URLs = [];

async function filterQualitySource(names, quality, source){
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

async function createURL(fileName){
    let URL = 'https://linx.cloud/' + fileName.replace('.HEVC-PSA', '').replace('.','-').toLowerCase();
    return URL;
};

async function getEpNamesFromURL(name, URL){
    return await axios.get(URL).then(response => {
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

async function getJSONDataBase(fileName){
    return JSON.parse(fs.readFileSync(fileName));
};

async function pushJSONDataBase(fileName, jsonfile){
    fs.writeFileSync(fileName, JSON.stringify(jsonfile, null, 2));
};

async function filterNamesToDownload(names, notDowloaded){
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

async function findEps(serieInfo){
    names = await getEpNamesFromURL(serieInfo.name, serieInfo.URL);
    namesToDownload = await filterNamesToDownload(names, serieInfo.notDownloaded);

    for(var ep in namesToDownload){
        if(namesToDownload[ep] == []){
            continue;
        }
        nameToDownloadFiltered = await filterQualitySource(namesToDownload[ep], serieInfo.quality, serieInfo.source);
        serieInfo.notDownloaded = serieInfo.notDownloaded.filter((epNotDownloaded) => {
            return epNotDownloaded != ep;
        });
        URLs.push(await createURL(nameToDownloadFiltered));
    }

    return serieInfo;    
};

async function run(){
    let seriesInfo = await getJSONDataBase('series.json');
    for (let serie in seriesInfo){
        seriesInfo[serie] = await findEps(seriesInfo[serie]);
    }
    await pushJSONDataBase('series.json', seriesInfo);
    console.log(URLs);
}; 

run();
