const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const config = require(`${__dirname}/config`);

const app = new Koa();
const fs = require('fs');
app.use(bodyParser());

//client
let CronJob = require('cron').CronJob;
const client = require(__dirname+'/client');
let job = new CronJob(config.cron, function () {
    client();
}, null, true, 'America/Los_Angeles');
job.start();



//server
app.use(async (ctx, next) => {
    console.log(ctx.path);
    if (ctx.url == '/submit' && ctx.method == "POST") {
        let item = ctx.request.body;
        item.time = new Date();
        fs.writeFileSync(`${__dirname}/tmp/${ctx.request.ip}`, JSON.stringify(item));
        ctx.body = '{ status: "ok" }';
    }else if(ctx.path == "/data" && ctx.method == "GET"){
        let files = fs.readdirSync(`${__dirname}/tmp`,'utf8');
        console.log(files);
        let res = {};
        files.forEach(e=>{
            if(e != '.gitkeep'){
                res[e] = JSON.parse(fs.readFileSync(`${__dirname}/tmp/${e}`, 'utf8'));
            }
        });
        ctx.header['Access-Control-Allow-Origin'] = "*";
        ctx.body = { ip: ctx.request.ip, res};
    }else{
        ctx.body = fs.readFileSync(`${__dirname}/index.html`,'utf8');
    }
    
});
if(config.isServer){
    app.listen(config.port);
}
