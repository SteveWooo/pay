/**
* @param swc_session，微信前端用户唯一标识
*/

async function auth(req, res, next){
	var query;
	if(req.method == "GET"){
		query = req.query
	} else {
		query = req.body;
	}

	//查询哈希表
	if(!(query.swc_session in global.swc.redis.swc_session)){
		res.send(JSON.stringify({
			status : 4003,
			error_message : "请重新打开小程序"
		}))
		return ;
	}
	//设置用户信息，纯ID
	req.source.wechat_user = {
		user_id : global.swc.redis.swc_session[query.swc_session].user_id,
		swc_session : query.swc_session
	}
	next();
}

module.exports = auth;