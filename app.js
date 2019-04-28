const axios = require('axios');
const fs = require('fs');

function copy(aObject) {
    if (!aObject) {
      return aObject;
    }
  
    let v;
    let bObject = Array.isArray(aObject) ? [] : {};
    for (const k in aObject) {
      v = aObject[k];
      bObject[k] = (typeof v === "object") ? copy(v) : v;
    }
  
    return bObject;
};

async function filterQualitySource(names, quality, source){//ta TOPZERA
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

async function createURL(fileName){//ta PIka daS GalaxiA
    let URL = 'https://linx.cloud/' + fileName.replace('.HEVC-PSA', '').replace('.','-').toLowerCase();
    return URL;
};

async function getEpNamesFromURL(name, URL){//melhor que essa so duas essa
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

async function getJSONDataBase(fileName){//double triple piroca
    return JSON.parse(fs.readFileSync(fileName));
};

async function pushJSONDataBase(fileName, jsonfile){//nao testada
    fs.writeFileSync(fileName, JSON.stringify(jsonfile, null, 2));
};

async function filterNamesToDownload(names, notDowloaded){//le TOPERson
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

    let serieInfoCopy = copy(serieInfo);
    let URLs = [];

    let names = await getEpNamesFromURL(serieInfoCopy.name, serieInfoCopy.URL);
    let namesToDownload = await filterNamesToDownload(names, serieInfoCopy.notDownloaded);

    for(var ep in namesToDownload){
        if(!(Array.isArray(namesToDownload[ep]) && namesToDownload[ep].length)){
            continue;
        }
        let nameToDownloadFiltered = await filterQualitySource(namesToDownload[ep], serieInfoCopy.quality, serieInfoCopy.source);
        serieInfoCopy.notDownloaded = serieInfoCopy.notDownloaded.filter((epNotDownloaded) => {
            return epNotDownloaded != ep;
        });
        URLs.push(await createURL(nameToDownloadFiltered));
    }

    return {serieInfoCopy, URLs};    
};

async function run(serieCode = 'all'){
    let seriesInfo = await getJSONDataBase('series.json');
    let allURLs = [];

    if(serieCode == 'all'){
        for (let serie in seriesInfo){
            const {serieInfoCopy, URLs} = await findEps(seriesInfo[serie]);
            seriesInfo[serie] = serieInfoCopy;
            //console.log(URLs);
            allURLs.push({tittle: seriesInfo[serie].tittle, URLs});
        }
    }
    else{
        const {serieInfoCopy, URLs} = await findEps(seriesInfo[serieCode]);
        seriesInfo[serieCode] = serieInfoCopy;
        //console.log(URLs);
        allURLs.push({tittle: seriesInfo[serieCode].tittle, URLs});
    }

    await pushJSONDataBase('series.json', seriesInfo);
    console.log(JSON.stringify(allURLs, null, 2));
    return allURLs;
}; 

run('cloak');
