const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const fs = require('fs');
app.use(bodyParser());

//client
let CronJob = require('cron').CronJob;
const client = require(__dirname+'/client');
let job = new CronJob('*/30 * * * * *', function () {
    //client();
}, null, true, 'America/Los_Angeles');
job.start();



//server
app.use(async (ctx, next) => {
    if (ctx.url == '/submit' && ctx.method == "POST") {
        let item = ctx.request.body;
        item.time = new Date();
        fs.writeFileSync(`${__dirname}/tmp/${ctx.request.ip}`, JSON.stringify(item));
        ctx.body = '{ status: "ok" }';
    }else{
        let files = fs.readdirSync(`${__dirname}/tmp`,'utf8');
        console.log(files);
        let res = {};
        files.forEach(e=>{
            res[e] = JSON.parse(fs.readFileSync(`${__dirname}/tmp/${e}`,'utf8'));
        });
        ctx.body = res;
    }
    
});
if(config.isServer){
    app.listen(config.port);
}