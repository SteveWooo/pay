/**
* 初次加载
*/
var keke = {};
keke.config = {
	components : [
		'hello',
		'rabbit'
	],
	menu : [{
		text : "蹂躏入口",
		icon: 'history',
		router : "hello"
	},{
		text : "看看我的兔子",
		icon: 'history',
		router : "rabbit"
	}],
	router_name : {
		'hello' : '要饭系统',
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

$.ajax({
	url : keke.config.baseUrl + "/pay/api/p/mode/get",
	success : function(res){
		loadInitFile(res.data);
	},
	error : function(e){
		alert('网络错误！')
	}
})
