const { execFileSync, spawnSync } = require('child_process');
const superagent = require('superagent');
const config = require(`${__dirname}/config`);

const main = async ()=>{
    let connections = execFileSync(`${__dirname}/ips.sh`).toString().split('\n').filter(e=>{
        console.log(e);
        return e.split(/\s|\:/)[1] == "443"
    }).map(e=>{
        console.log(e);
        return e.split(/\s|\:/)[2]
    });
    console.log(connections);
    let ips = {};
    let connNumber = connections.length;
    connections.forEach(e => {
        if (!ips[e]) {
            ips[e] = 0;
        }
        ips[e]++;
    })
    console.log(ips,connNumber);
    if (connNumber < config.minConn) {
        spawnSync('/etc/init.d/etc/init.d/shadowsocks-libev restart');
    }

    let req = superagent.post(`${config.server}/submit`).send({ips,connNumber});

    let res;

    try{
        res = await req;
    }catch(e){}

}

module.exports = main;
