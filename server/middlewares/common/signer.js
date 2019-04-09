const crypto = require("crypto");

function getSign(swc, queryDic){
	var source = [];
	for(var i=0;i<queryDic.length;i++){
		source.push(queryDic[i].key + "=" + queryDic[i].value);
	}

	source = source.join('&');
	source += "&key=" + swc.config.payjs.secret;
	var sign = crypto.createHash('md5').update(source).digest('hex').toUpperCase();
	return {
		sign : sign
	};
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
* @param.query 参数段
*/
exports.getSignByQuery = async function (swc, param){
	var queryDic = sortByDic(param.query);
	var signResult = getSign(swc, queryDic);

	return signResult;
}

/**
* @param query请求参数，包含key
*/
exports.checkSign = async function(swc, param){
	var keyFromQuery = param.query.key;
	delete param.query.key;

	var sign = swc.common.signer.getSignByQuery(swc, {
		query : param.query
	})

	if(sign == keyFromQuery){
		return true;
	} else {
		return false;
	}
}