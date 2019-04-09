module.exports = async function(req, res, next){
	var query = req.body;
	if(!query || query['return_code'] != 1){
		res.send('error');	
		return ;
	}

	console.log(query);
	if(!swc.common.signer.checkSign(swc, query)){
		console.log('sign error');
		res.send('error');
		return ;
	}

	//直接退出
	res.send('success');
	return ;
}