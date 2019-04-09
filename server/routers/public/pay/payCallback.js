module.exports = async function(req, res, next){
	var query = req.body;
	if(!query || query['return_code'] != 1){
		res.send('error');	
		return ;
	}

	console.log(query);

	//直接退出
	res.send('success');
	return ;
}