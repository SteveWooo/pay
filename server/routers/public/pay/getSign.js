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

	var pay = {
		out_trade_no : reuslt.out_trade_no,
		openid : req.query.openid,
		time_end : 0,
		email : req.query.email || '',
		name : req.query.name || '',
		message : req.query.message || '',
		total_fee : req.query.total_fee,
		payed : 0,
		create_at : +new Date()
	}

	//懒得透传了 还限制长度
	delete req.query.email;
	delete req.query.name;
	delete req.query.message;

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

	//写进数据库
	try{
		await req.swc.db.modles.pays.create(pay);
	}catch(e){
		console.log(e);
	}

	req.response.data = result;
	next();
}