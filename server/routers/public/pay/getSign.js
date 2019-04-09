/**
* 获取签名，参数字典排序后md5
* @param mchid, total_fee, out_trade_no, open_id
*/

module.exports = async (req, res, next)=>{
	var sign = await req.swc.pay.getSign(req.swc, {
		query : req.query
	});
	req.response = {
		sign : sign
	}
	next();
}