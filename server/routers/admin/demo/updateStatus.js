/*
* @param demo_id, status
*/
module.exports = async (req, res, next)=>{
	var query = req.body;
	var swc = req.swc;

	if(!query.demo_id || query.demo_id.length != 32){
		req.response.status = 4005;
		req.response.error_message = "参数错误";
		next();
		return ;
	}

	if(!query.status || parseInt(query.status) != query.status){
		req.response.status = 4005;
		req.response.error_message = "参数错误";
		next();
		return ;
	}

	try{
		var selfService = await swc.db.models.demos.findAndCountAll({
			where : {
				demo_id : query.demo_id
			}
		})
		var now = +new Date();
		var result = await selfService.rows[0].update({
			status : query.status,
			update_at : now,
			update_by : req.source.admin_user.admin_id
		});
		req.response.data = result;
		next();
	}catch(e){
		req.response.status = 5000;
		req.response.error_message = e.message;
		next();
		return ;
	}

	next();
}