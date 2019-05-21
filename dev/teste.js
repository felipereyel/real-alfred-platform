const axios = require('axios');

dburl = 'https://api.jsonbin.io/b/';
binID = '5ce439b4dbffad51f8ad0903';

dbdata = { vrau: "ohyes"};

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
    await getfromdb(dburl+binID);
    await putondb(dburl+binID, dbdata);
    await getfromdb(dburl+binID);
}

run();