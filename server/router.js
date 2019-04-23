/*
* 统一入口
*/
async function handleRequest(req, res, next){
	req.response = {
		status : 2000
	}
	req.response_headers = {};
	req.source = {
		wechat_user : {}, //小程序用户信息
		admin_user : {}, //后台管理员用户信息
	}
	next();
}

/*
* 统一响应出口，把req.response的内容响应给前端
*/
async function handleResponse(req, res){
	if(! ('Content-Type' in req.response_headers)){
		res.header("Content-Type", "application/json; charset=utf-8")
	}
	for(var i in req.response_headers){
		res.header(i, req.response_headers[i]);
	}

	req.response.source = req.source;

	res.send(JSON.stringify(req.response));
}

//小程序接口
var wechat_routers = {
	//用户信息类
	// getUserInfo : {
	// 	module : require("./routers/wechat/user/get"),
	// 	path : "/api/w/user/get",
	// 	method : "get"
	// },
	// setWechatData : {
	// 	module : require("./routers/wechat/user/setWechatData"),
	// 	path : "/api/w/user/set_wechat_data",
	// 	method : "post"
	// }
}

//后台接口
var admin_routers = {
	//管理员信息
	// getAdminInfo : {
	// 	module : require("./routers/admin/user/get"),
	// 	path : "/api/m/user/get",
	// 	method : "post"
	// },

	// //demo
	// getDemo : {
	// 	module : require("./routers/admin/demo/get"),
	// 	path : "/api/m/demo/get",
	// 	method : "get"
	// },
}

//用于登陆的接口
var login_routers = {
	// loginAdmin : {
	// 	module : require("./routers/admin/user/login"),
	// 	path : "/api/m/user/login",
	// 	method : "post"
	// },
	// getCode : {
	// 	module : require("./routers/admin/user/getCode"),
	// 	path : "/api/m/user/get_code",
	// 	method : "get"
	// },
	// loginWechat : {
	// 	module : require("./routers/wechat/user/login"),
	// 	path : "/api/w/user/login",
	// 	method : "get"
	// },

	//获取服务环境
	getMode : {
		module : require('./routers/getMode'),
		path : '/pay/api/p/mode/get',
		method : 'get'
	}
}

var publicRouters = {
	getSign : {
		module : require("./routers/public/pay/getSign"),
		path : '/pay/api/p/pay/get_sign',
		method : 'get'
	},
	payCallback : {
		module : require("./routers/public/pay/payCallback"),
		path : '/pay/api/p/pay/pay_callback',
		method : 'post'
	},
	checkPay : {
		module : require("./routers/public/pay/checkPay"),
		path : '/pay/api/p/pay/check_pay',
		method : 'get'
	},
	getPayList : {
		module : require("./routers/public/paylist/get"),
		path : '/pay/api/p/paylist/get',
		method : 'get'
	},

	getRabbit : {
		module : require("./routers/public/rabbit/get"),
		path : '/pay/api/p/rabbit/get',
		method : 'get'
	}
}

//中间件
var middlewares = {
	authWechat : {
		module : require("./middlewares/authWechat"),
	},
	authAdmin : {
		module : require("./middlewares/authAdmin"),
	}
}

/*
* 加载路由器
*/
async function router(swc){

	//不需要任何鉴权的路由，用于登陆
	for(var i in login_routers){
		var r = login_routers[i];
		swc.app[r.method](r.path, (req, res, next)=>{
			req.swc = swc;
			next();
		}, 
		handleRequest, 
		r.module, 
		handleResponse);
	}

	//公共路由
	for(var i in publicRouters){
		var r = publicRouters[i];
		swc.app[r.method](r.path, (req, res, next)=>{
			req.swc = swc;
			next();
		}, 
		handleRequest, 
		r.module,
		handleResponse);
	}

	//用于小程序前端的接口
	for(var i in wechat_routers){
		var r = wechat_routers[i];
		swc.app[r.method](r.path, (req, res, next)=>{
			req.swc = swc;
			next();
		}, 
		handleRequest, 
		middlewares.authWechat.module,
		r.module, 
		handleResponse);
	}

	//用于服务端的接口
	for(var i in admin_routers){
		var r = admin_routers[i];
		swc.app[r.method](r.path, (req, res, next)=>{
			req.swc = swc;
			next();
		}, 
		handleRequest,
		middlewares.authAdmin.module, 
		r.module, 
		handleResponse);
	}

	return swc;
}

exports.router = router;