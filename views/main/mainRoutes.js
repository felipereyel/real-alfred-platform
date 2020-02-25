const { refreshSeriesInfo } = require("../../sourceAPIFunctions");
const { getJSONDataBase, updateJSONDataBase } = require("../../databaseFunctions");

const express = require("express");
const router = express.Router();

router.get('/full/:s?', async (req, res, next) => {
    const codename = req.params.s;

    let seriesInfo = await getJSONDataBase();

    let refreshedSeriesInfo = await refreshSeriesInfo(seriesInfo, codename);

    res.render("main/main.html", { seriesInfo: refreshedSeriesInfo, urlListKey: "latestsURLs" });

    await updateJSONDataBase(seriesInfo, refreshedSeriesInfo);

    console.log(`GET/full/${codename || ""}`);
});

router.get('/new/:s?', async (req, res, next) => {
    const codename = req.params.s;

    let seriesInfo = await getJSONDataBase();

    let refreshedSeriesInfo = await refreshSeriesInfo(seriesInfo, codename);

    res.render("main/main.html", { seriesInfo: refreshedSeriesInfo, urlListKey: "newURLs" });

    await updateJSONDataBase(seriesInfo, refreshedSeriesInfo);

    console.log(`GET/refresh/${codename || ""}`);
});

router.get('/existing/:s?', async (req, res, next) => {
    const codename = req.params.s;

    let seriesInfo = await getJSONDataBase();

    let filteredSeriesInfo = seriesInfo.filter(serieInfo =>  !codename || serieInfo.codename === codename);

    res.render("main/main.html", { seriesInfo: filteredSeriesInfo, urlListKey: "latestsURLs" });

    console.log(`GET/recent/${codename || ""}`);
});

router.get('/recent/:s?', async (req, res, next) => {
    const codename = req.params.s;

    let seriesInfo = await getJSONDataBase();

    let filteredSeriesInfo = seriesInfo.filter(serieInfo =>  !codename || serieInfo.codename === codename);

    res.render("main/main.html", { seriesInfo: filteredSeriesInfo, urlListKey: "newURLs" });

    console.log(`GET/recent/${codename || ""}`);
});

router.get('/', async (req, res, next) => {
    res.render("main/home.html");
    console.log('GET/');
});

module.exports = router;
