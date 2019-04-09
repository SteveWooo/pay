/**
* 初次加载
*/
var keke = {};
keke.config = {
	components : [
		'hello'
	],
	menu : [{
		text : "富到你拉开我也懒得写目录名",
		icon: 'history',
		router : "hello"
	}],
	router_name : {
		'hello' : ''
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

function loadInitFile(mode){
	var dom = document.createElement("script");
	dom.src = 'js/init.js';
	document.body.appendChild(dom);
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