/**
* 获取签名，参数字典排序后md5
* @param mchid, total_fee, out_trade_no, open_id
*/

module.exports = async (req, res, next)=>{
	if(!req.query.openid){
		req.response.status = '4005';
		req.response.error_message = '参数缺失：openid';
		next();
		return ;
	}

	var result = await req.swc.pay.getSign(req.swc, {
		query : req.query
	});

	//payjs api报错
	if(result.return_code == 0){
		req.response.status = '5000';
		req.response.error_message = result.return_msg;
		next();
		return ;
	}

	req.response.data = result;
	next();
}