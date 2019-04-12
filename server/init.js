const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');

/**
* 拿进程参数
* c:进程数
* m:启动环境，prod 生产，空 开发&测试
* db:同步数据库
*/
async function getArgv(){
	var argv = {};
	for(var i=2;i<process.argv.length;i++){
		if(process.argv[i].indexOf("-") == 0){
			argv[process.argv[i].replace("-","")] = process.argv[i + 1];
		}
	}

	//默认两条进程
	if(!argv.c){
		argv.c = 2;
	}

	return argv;
}

/**
* 初始化swc
*/
async function init(){
	//初始化控制台输出
	var swc = {
		mode : 'dev',
		log : {
			info : function(msg){
				console.log('^,^ \033[42;37m ' + msg + ' \033[0m');
			},
			error : function(msg){
				console.log('-,- \033[41;37m ' + msg + ' \033[0m');
			}
		},
		argv : await getArgv(),
		app : express(),
		common : {
			saveImage : require("./middlewares/common/images").saveImage,
			getWechatUser : require('./middlewares/common/getWechatUser'),
			signer : require('./middlewares/common/signer'),
		},
		pay : {
			getSign : require('./middlewares/pay/getSign')
		}
	}

	//此处填入配置
	if(!swc.argv.m){
		//默认开发模式
		swc.config = require('../conf/config.json');
	} else if (swc.argv.m === 'prod'){
		//设置一下全局环境
		swc.mode = swc.argv.m;
		swc.config = require('../conf/config.prod.json');
	} else {
		swc.log.error('4005:输入参数错误(m)');
		return undefined;
	}

	//数据库orm定义
	swc = await require("./middlewares/common/db")(swc);
	if(swc.argv.db === '1'){
		swc.log.info('info:database has sync')
		await swc.db.seq.sync();
	}

	//定义全局变量
	global.swc = {
		redis : {
			openid : {}, //openid 表
			swc_session : {}, //swc_session 表
		}
	}

	//资源
	swc.app.use("/pay/res", express.static("res"));
	//支付前端
	swc.app.use("/pay/public", express.static("public"));
	//前端
	swc.app.use("/pay/me", express.static("payme"));
	//中间件
	swc.app.use(bodyParser.urlencoded({extended: false}));
	swc.app.use(bodyParser.json({"limit":"10000kb"}));
	swc.app.use(session({
		secret: 'secret', 
		cookie: {
			maxAge: 60000
		},
		saveUninitialized: true,
		resave: false,
	}));

	//路由定义
	swc = await require('./router').router(swc);

	swc.startup = async function (swc){
		swc.app.listen(swc.config.server.port, ()=>{
			console.log("listen at : " + swc.config.server.port)
		})
	}
	return swc;
}

exports.init = init;