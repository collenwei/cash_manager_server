import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import mongoose from 'mongoose';
import promise from 'bluebird';
import glob from 'glob';
import token from './middlewares/token-json';
import log from './middlewares/log-process';
import moment from 'moment';
import schedule from './utils/ScheduleUtil';
// import {MaketDataIndexDAO} from './models/maket.model/maket_data_index.model';
// import db from './config/db';
// import fs from 'fs'
// import path from 'path';
// console.log(moment(new Date()).format('YYYY/M/D'))
const app = express();
const port = process.env.PORT || 16024;//16020;

global.mongoose = mongoose;
global.dirname = __dirname;
global.localhost = process.env.LOCALHOST || 'http://10.1.2.107';
global.pricing_host = process.env.PRICING_HOST || 'http://10.1.2.55:16011';
global.port = process.env.DOWNLOAD_PORT || 16024;
//======= mongo数据库连接 ======
// mongoose.connect('mongodb://' + db.ip + ':' + db.port + '/' + db.database);
// fs.readFile('./test02_origin.xml', function (err, data) {
//    if (err) {
//        return console.error(err);
//    }
//    console.log("异步读取: " );
//    let str = data.toString();
//    str = str.replace('product_type', '【aaaaaawwwwww】');
//    fs.writeFile(path.join(__dirname, 'test02_origin.doc'), str, function(){
//    });
//    // console.log(typeof data);
// });
console.log(new Date(1520561535169))
//======= 对请求体进行解析 =======
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(express.static(__dirname + '/../client'));

app.use('/api/certificate', token);
app.use('/api/department', token);
app.use('/api/template', token);
app.use('/api/upload', token);
app.use('/api/dictionary', token);
app.use('/api/maketdata', token);
app.use('/api/role', token);
app.use('/api/schedule', token);
app.use('/', log);

//======= 跨域请求处理 ========
app.use(cors());
//======= 路由匹配 ========
const routers = glob.sync('./routers/**/*.js', { cwd: __dirname });
routers.forEach(r => {
    const router = require(r);
    router.prefix && app.use(router.prefix, router);
})
//======= 服务启动以及端口匹配 ======
schedule.schedule();
app.listen(port, () => {
	console.log('magic happen on ', port)
});

/*
                   _ooOoo_
                  o8888888o
                  88" . "88
                  (| -_- |)
                  O\  =  /O
               ____/`---'\____
             .'  \\|     |//  `.
            /  \\|||  :  |||//  \
           /  _||||| -:- |||||-  \
           |   | \\\  -  /// |   |
           | \_|  ''\---/''  |   |
           \  .-\__  `-`  ___/-. /
         ___`. .'  /--.--\  `. . __
      .-- '<  `.___\_<|>_/___.'  >'--.
     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
     \  \ `-.   \_ __\ /__ _/   .-` /  /
======`-.____`-.___\_____/___.-`____.-'======
                   `=---='
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         佛祖保佑       永无BUG
*/


exports = module.exports = app; 
