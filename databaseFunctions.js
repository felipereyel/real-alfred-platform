const { dbURL, dbsecretKey } = require("./constants");

const axios = require('axios');

async function getJSONDataBase(url = dbURL, secretKey = dbsecretKey) {
    return axios({
        method: 'get',
        url: url + '/latest',
        headers: {
            'secret-key': secretKey
        }
    }).then(res => {
        return res.data;
    });
};

async function putJSONDataBase(jsonfile, url = dbURL, secretKey = dbsecretKey) {
    return axios({
        method: 'put',
        url: url,
        headers: {
            'Content-type': 'application/json',
            'versioning': false,
            'secret-key': secretKey
        },
        data: jsonfile
    }).then(res => {
        return res.data;
    });
};

exports.getJSONDataBase = getJSONDataBase;
exports.putJSONDataBase = putJSONDataBase;