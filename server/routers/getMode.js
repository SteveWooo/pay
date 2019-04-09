/*
* @param 返回当前服务器环境
*/
module.exports = async (req, res, next)=>{
	req.response.data = req.swc.mode;
	next();
}