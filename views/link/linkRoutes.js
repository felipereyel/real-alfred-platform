const { createURL } = require("../../sourceAPIFunctions");

const express = require("express");
const router = express.Router();

router.get('/link', async (req, res, next) => {
    res.render("link/link.html");
    console.log(`GET/link`);
});

router.post('/linkresult', async (req, res, next) => {
    const filename = req.body.filename;

    const filelink = createURL(filename);

    res.render("link/link_result.html", { url: filelink});

    console.log(`POST/result for ${filename}`)
});

module.exports = router;