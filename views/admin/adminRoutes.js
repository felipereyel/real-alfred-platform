const { getJSONDataBase, addDataBaseEntry, removeDatabaseEntry, removeDatabaseNestedEntry } = require("../../databaseFunctions");

const express = require("express");
const router = express.Router();

router.get('/list', async (req, res, next) => {
    const seriesInfo = await getJSONDataBase();

    res.render("admin/list.html", { seriesInfo: seriesInfo });

    console.log(`GET/list`);
});

router.get('/create', async (req, res, next) => {
    res.render("admin/create.html");
    console.log(`GET/create`);
});

router.post('/createresult', async (req, res, next) => {
    await addDataBaseEntry(req.body);
    console.log(`POST/createresult`);
    res.redirect("/list");
});

router.get('/delete/:s', async (req, res, next) => {
    const codename = req.params.s;
    await removeDatabaseEntry(codename);
    console.log(`POST/detele/${codename}`);
    res.redirect("/list");
});

router.get('/delete/:s/:id', async (req, res, next) => {
    const codename = req.params.s;
    const epId = req.params.id;
    await removeDatabaseNestedEntry(codename, epId);
    console.log(`POST/detele/${codename}/${epId}`);
    res.redirect(`/existing/${codename}`);
});

router.get('/db', async (req, res, next) => {
    await res.json(await getJSONDataBase());
    console.log(`GET/db`);
});

module.exports = router;