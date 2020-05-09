const { execFileSync, spawnSync } = require('child_process');
const superagent = require('superagent');
const config = require(`${__dirname}/config`);

const main = async ()=>{
    let connections = execFileSync(`${__dirname}/ips.sh`).toString().split('\n');
    let ips = {};
    let connNumber = connections.length - 1;
    connections.forEach(e => {
        if (!ips[e]) {
            ips[e] = 0;
        }
        ips[e]++;
    })
    console.log(ips,connNumber);
    if (connNumber < config.minConn) {
        spawnSync('/etc/init.d/etc/init.d/shadowsocks-libev');
    }

    let req = superagent.post(`${config.server}/submit`).send({ips,connNumber});

    let res;

    try{
        res = await req;
    }catch(e){}

}

module.exports = main;
