const crypto = require("crypto");

function getSign(swc, queryDic){
	var source = [];
	for(var i=0;i<queryDic.length;i++){
		source.push(queryDic[i].key + "=" + queryDic[i].value);
	}

	source = source.join('&');
	source += "&key=" + swc.config.payjs.secret;

	var sign = crypto.createHash('md5').update(source).digest('hex').toUpperCase();
	return sign;
}

function sortByDic(query){
	var queryTemp = [];
	for(var i in query){
		queryTemp.push({
			key : i,
			value : query[i]
		})
	}
	queryTemp = queryTemp.sort(function(a, b){
		return a.key > b.key;
	})

	return queryTemp;
}

/**
* @param.query 请求串
*/
module.exports = async function (swc, param){
	var queryDic = sortByDic(param.query);

	return getSign(swc, queryDic);
}