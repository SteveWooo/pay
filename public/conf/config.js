/**
* 初次加载
*/
var keke = {};
keke.config = {
	components : [
		'hello'
	],
	menu : [{
		text : "羞辱入口",
		icon: 'history',
		router : "hello"
	},{
		text : "看看我的兔子",
		icon: 'history',
		router : "hello"
	}],
	router_name : {
		'hello' : '',
		'rabbit' : '我的兔子'
	},

	mchid : '1531506461',
	baseUrl : location.origin, //根目录路径
	baseResUrl : location.origin + "/res", //资源根目录路径
}

keke.getQuery = function(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
	       var pair = vars[i].split("=");
	       if(pair[0] == variable){return pair[1];}
	}

	return undefined;
}
keke.ls = {
	set : function(key, value) {
		window.localStorage.setItem(key, typeof value == 'string' ? 
			value : JSON.stringify(value));
	},
	get : function(key) {
		var item = window.localStorage.getItem(key);
		return JSON.parse(item);
	}
}

function loadInitFile(mode){
	var dom = document.createElement("script");
	dom.src = 'js/init.js';
	document.body.appendChild(dom);
}

//初始化微信jssdk
function initWx(){

}
	

if(!keke.getQuery('openid')){
	location.href = 'https://payjs.cn/api/openid?mchid='+keke.config.mchid+'&callback_url=https://deadfishcrypto.com/pay/public/index.html';
	return ;
} else {
	$.ajax({
		url : keke.config.baseUrl + "/pay/api/p/mode/get",
		success : function(res){
			loadInitFile(res.data);
		},
		error : function(e){
			alert('网络错误！')
		}
	})
}

