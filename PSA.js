const axios = require('axios');

const { BASE_URL, FINDER_1, FINDER_2, FINDER } = require("./constants");

async function getEpisodeFilenames(showKey) {
    const response = await axios.get(BASE_URL + showKey);
    return response.data.match(FINDER).map(div => div.replace(FINDER_1, "").replace(FINDER_2, ""));
}

exports.getEpisodeFilenames = getEpisodeFilenames;
