function buildEpisodesDiv(url) {
    return `
        <div class="episode">
            <a href="${url}">
                ${url}
            </a>
        </div><br>
    `;
}

function buildTVShowDiv(serieInfo) {
    let content = `
        <div class="tv-show">
            <h2>${serieInfo.tittle}</h2>
    `;

    if(Array.isArray(serieInfo.latestsURLs) && serieInfo.latestsURLs.length){
        serieInfo.latestsURLs.map(
            url => {
                content += buildEpisodesDiv(url);
            }
        );
    }
    else{
        content += `
            <div class="episode">
                Não há episódios diponíveis
            </div><br>
        `;
    }

    content += `
        </div>
    `;

    return content;
}

function buildContainerDiv(seriesInfo) {
    let content = `
        <div class="container">
    `;

    seriesInfo.map(
        serieInfo => {
            content += buildTVShowDiv(serieInfo);
        }
    );

    content += `
        </div>
    `;

    return content;
}

exports.buildContainerDiv = buildContainerDiv;