const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(cors({ origin: true }));

const { SEASON_VALIDATOR, EPISODE_VALIDATOR } = require("./constants");
const { group } = require("./processing");
const { getEpisodeFilenames } = require("./PSA");

app.get('/:show', async (req, res) => {
    const showKey = req.params.show;

    if (!showKey) {
        res.status(400).send({ error: "Missing parameters" }); 
        return;
    }

    const source = req.query.source || "WEB";
    const quality = req.query.quality || "1080p";

    const episodes = await getEpisodeFilenames(showKey);
    const groupedEps = group(episodes, quality, source);

    res.status(200).send({ data: groupedEps });
});

app.get('/:show/:season', async (req, res) => {
    const showKey = req.params.show;
    const seasonNumber = req.params.season;

    if (!showKey || !seasonNumber) {
        res.status(400).send({ error: "Missing parameters" }); 
        return;
    }

    if (!seasonNumber.match(SEASON_VALIDATOR)) {
        res.status(400).send({ error: "Bad parameters" }); 
        return;
    }

    const source = req.query.source || "WEB";
    const quality = req.query.quality || "1080p";

    const episodes = await getEpisodeFilenames(showKey);
    const groupedEps = group(episodes, quality, source);

    res.status(200).send({ data: groupedEps[seasonNumber] });
});

app.get('/:show/:season/:episode', async (req, res) => {
    const showKey = req.params.show;
    const seasonNumber = req.params.season;
    const episodeNumber = req.params.episode;

    if (!showKey || !seasonNumber || !episodeNumber) {
        res.status(400).send({ error: "Missing parameters" }); 
        return;
    }

    if (!seasonNumber.match(SEASON_VALIDATOR) || !episodeNumber.match(EPISODE_VALIDATOR)) {
        res.status(400).send({ error: "Bad parameters" }); 
        return;
    }

    const source = req.query.source || "WEB";
    const quality = req.query.quality || "1080p";

    const episodes = await getEpisodeFilenames(showKey);
    const groupedEps = group(episodes, quality, source);

    const seasonEps = groupedEps[seasonNumber];
    const data = seasonEps ? seasonEps[episodeNumber] : undefined;

    res.status(200).send({ data });
});

exports.app = app;
