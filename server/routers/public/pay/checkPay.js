module.exports = async function (req, res, next){
	var query = req.query;
	var swc = req.swc;

	if(!query.out_trade_no){
		req.response.status = 4005;
		req.response.error_message = '参数缺失：out_trade_no';
		next();
		return ;
	}

	var pay = await swc.db.models.pays.findAndCountAll({
		where : {
			out_trade_no : query.out_trade_no
		}
	})

	if(pay.count == 0){
		req.response.status = 4004;
		req.response.error_message = '订单不存在';
		next();
		return ;
	}

	req.response.data = {
		payed : pay.rows[0].payed
	}
	next();
}