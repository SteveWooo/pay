module.exports = async function(req, res, next){
	var query = req.body;
	var swc = req.swc
	if(!query || query['return_code'] != 1){
		res.send('error');	
		return ;
	}

	if(!swc.common.signer.checkSign(swc, {
		query : query
	})){
		console.log('sign error');
		res.send('error');
		return ;
	}

	var pay = await req.swc.pay.getSign.findAndCountAll({
		where : {
			out_trade_no : query.out_trade_no
		}
	})

	if(pay.count == 0){
		res.send('error');
		return ;
	}

	try{
		await pay.rows[0].update({
			payed : 1
		})
	}catch(e){
		console.log(e);
	}

	//直接退出
	res.send('success');
	return ;
}