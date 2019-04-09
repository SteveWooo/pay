const crypto = require("crypto");
const request = require('request');

function requestPayjsApi(swc, param){
	return new Promise(resolve=>{
		var options = {
			url : 'https://payjs.cn/api/jsapi?mchid=' + 
					swc.config.payjs.mchid + '&total_fee=' +
					param.query.total_fee + '&out_trade_no=' +
					param.query.out_trade_no + '&openid=' +
					param.query.openid + '&sign=' +
					param.signResult.sign
		}

		// console.log(options);

		request(options, function(err, res, body){
			body = JSON.parse(body);
			resolve(body);
		})
	})
}

function getTradeNo(swc, openid){
	var source = [
		openid,
		+new Date()
	].join('&');

	var no = crypto.createHash('md5').update(source).digest('hex');
	return no;
}

function getSign(swc, queryDic){
	var source = [];
	for(var i=0;i<queryDic.length;i++){
		source.push(queryDic[i].key + "=" + queryDic[i].value);
	}

	source = source.join('&');
	source += "&key=" + swc.config.payjs.secret;

	// console.log(source);

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
* @param.query 请求串
*/
module.exports = async function (swc, param){
	param.query.out_trade_no = getTradeNo(swc, param.query.openid);
	var queryDic = sortByDic(param.query);
	var signResult = getSign(swc, queryDic);

	var payjsResult = await requestPayjsApi(swc, {
		query : param.query,
		signResult : signResult
	})

	return payjsResult;
}