const axios = require('axios');

dburl = 'https://api.jsonbin.io/b/5cd8b6149c11b74347aa9d27';

dbdata = { vrau: "nheee"};

secretKey = '$2a$10$x6s7qqp.6PqaM5uyQoyIRu23f3awCM5freqJFM7Pfqdn3s5FgX7sa';

async function getfromdb(url) {
    r = await axios({
        method: 'get',
        url: url+'/latest',
        headers: {
            'secret-key': secretKey
        }
    });

    console.log(r.data);
    return r;  
}

async function putondb(url, data){
    r = await axios({
        method: 'put',
        url: url,
        headers: {
            'Content-type': 'application/json',
            'versioning': false,
            'secret-key': secretKey
        },
        data: data
    })
    console.log(r.data)
}

async function run(){
    await getfromdb(dburl);
    await putondb(dburl, dbdata);
    await getfromdb(dburl);
}

run();